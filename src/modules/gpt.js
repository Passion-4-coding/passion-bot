const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

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
  return openai.createCompletion({
    model,
    prompt,
    temperature: 0.7,
    max_tokens: maxTokens,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
}

module.exports = {
  getEmbed(isPrivate, question, answer) {
    if (isPrivate) {
      return new EmbedBuilder().setDescription("Answer to your question has been sent as a private message")
    }
    return new EmbedBuilder().setTitle(question).setDescription(answer)
  },
  async getAnswer(text) {
    let response;
    try {
      response = await createCompletion(MODELS.gpt, 4096, text);
    } catch (error) {
      console.error(MODELS.gpt, error);
    }
    if (response) return response;
    try {
      response = await createCompletion(MODELS.davinci, 4000, text);
    } catch (error) {
      console.error(MODELS.davinci, error);
    }
    return response;
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