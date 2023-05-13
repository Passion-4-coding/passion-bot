const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { getMemberTotalKarma, getAllMembers, addMember } = require("../../modules/member");
const { getPastDayStats } = require("../../modules/stats");
const { updateMembers } = require("../../modules/member/services");

const { GUILD_ID } = process.env;

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Get user karma").setType(ApplicationCommandType.User),
  async execute(interaction, client) {
    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    })

    const guild = client.guilds.resolve(GUILD_ID);

    const members = await guild.members.fetch();

    const dbmembers = await getAllMembers();

    const membersToAdd = [];

    members.forEach(member => {
      const dbmember = dbmembers.find(m => m.discordId === member.id);
      if (!dbmember) {
        membersToAdd.push(member);
      }
    });

    console.log(membersToAdd.length);

    for (let index = 0; index < membersToAdd.length; index++) {
      const memberToAdd = membersToAdd[index];
      try {
        await addMember(memberToAdd);
      } catch (error) {
        console.log(error);
      }
    }


    //updateMembers();

    //getPastDayStats();

    const embed = await getMemberTotalKarma(interaction.targetUser);
    
    await interaction.editReply({
      embeds: [embed]
    })
  }
} 