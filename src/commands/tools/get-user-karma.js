const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { getMemberTotalKarma } = require("../../modules/member");
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
    
    members.forEach(member => {
      updateMembers(member);
    });


    //updateMembers();

    //getPastDayStats();

    const embed = await getMemberTotalKarma(interaction.targetUser);
    
    await interaction.editReply({
      embeds: [embed]
    })
  }
} 