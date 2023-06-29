const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const { getLanguageRole } = require("./roles");
const { gpt } = require("../modules/messages");
const { colors } = require("../constants");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const MODELS = {
  davinci: "text-davinci-003",
  gpt: "gpt-3.5-turbo"
}

const answerTypes = {
  reply: "reply",
  private: "private"
}

const createCompletion = (model, maxTokens, prompt) => {
  if (model === MODELS.gpt) {
    return openai.createChatCompletion({
      model,
      messages: [{role: "user", content: prompt}],
    }).catch((error) => console.log(error));
  }
  return openai.createCompletion({
    model,
    prompt,
    max_tokens: maxTokens,
  });
}

module.exports = {
  getEmbed(isPrivate, question, answer, member) {
    const title = question.length > 256 ? `${question.slice(0, 253)}...` : question;

    const memberLanguagesRole = getLanguageRole(member.roles);
    
    if (isPrivate) {
      return new EmbedBuilder().setColor(colors.primary).setDescription(gpt.answerSent[memberLanguagesRole])
    }
    return new EmbedBuilder().setColor(colors.primary).setTitle(title).setDescription(answer)
  },
  async getAnswer(text) {
    let completion;
    try {
      completion = await createCompletion(MODELS.gpt, 4096, text);
    } catch (error) {
      console.error(MODELS.gpt, error);
    }
    if (completion) return completion.data.choices[0].message.content;
    try {
      completion = await createCompletion(MODELS.davinci, 4000, text);
    } catch (error) {
      console.error(MODELS.davinci, error);
    }
    if (completion) return completion.data.choices[0].text;
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
  }
}