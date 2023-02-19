const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const answerTypes = {
  reply: "reply",
  private: "private"
}

const answerLengthTypes = {
  short: { name: "short", value: 256 },
  medium: { name: "medium", value: 1024 },
  long: { name: "long", value: 4000 },
}

module.exports = {
  getAnswerLengthValue(nameOption) {
    const name = nameOption ? nameOption.value : answerLengthTypes.short.name;
    const answerLength = answerLengthTypes[name];
    return answerLength.value;
  },
  getEmbed(isPrivate, question, answer) {
    if (isPrivate) {
      return new EmbedBuilder().setDescription("Answer to your question has been sent as a private message")
    }
    return new EmbedBuilder().setTitle(question).setDescription(answer)
  },
  getBasicGptOptions(name, description) {
    return new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Question to ask')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('answer-type')
        .setDescription('Choose a method how do you want to receive answer. Default: Reply')
        .setChoices(
          {name: "Reply", value: answerTypes.reply}, 
          {name: "Private", value: answerTypes.private},
        )
      )
    .addStringOption(option =>
      option.setName('answer-length')
        .setDescription('Choose a maximum length of answer you want to receive. Default: Short(256 tokens)')
        .setChoices(
          {name: "Short(256 tokens)", value: answerLengthTypes.short.name}, 
          {name: "Medium(1024 tokens)", value: answerLengthTypes.medium.name},
          {name: "Long(4000 tokens)", value: answerLengthTypes.long.name},
        )
      )
  }
}