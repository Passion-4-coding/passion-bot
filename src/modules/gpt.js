const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { OpenAI } = require("openai");
const { getLanguageRole } = require("./roles");
const { gpt } = require("../modules/messages");
const { colors } = require("../constants");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const MODELS = {
  gpt4: "gpt-4",
  gpt3: "gpt-3.5-turbo"
}

const answerTypes = {
  reply: "reply",
  private: "private"
}

const createCompletion = async (model, maxTokens, prompt) => {
  if (model === MODELS.gpt4) {
    return openai.chat.completions.create({
      model,
      messages: [{role: "user", content: prompt}],
    }).catch((error) => console.log(error));
  }
  return openai.chat.completions.create({
    model,
    prompt,
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
      completion = await createCompletion(MODELS.gpt4, 4096, text);
    } catch (error) {
      console.error(MODELS.gpt4, error);
    }
    if (completion) return completion.choices[0].message.content;
    try {
      completion = await createCompletion(MODELS.gpt3, 4000, text);
    } catch (error) {
      console.error(MODELS.gpt3, error);
    }
    if (completion) return completion.choices[0].text;
  },
  getBasicGptOptions(name, description) {
    return new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Твоє запитання')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('answer-type')
        .setDescription('Вибери метод за яким ти хочеш отримати відповідь. За замовчуванням: На каналі')
        .setChoices(
          {name: "На каналі", value: answerTypes.reply}, 
          {name: "Приватне повідомлення", value: answerTypes.private},
        )
      )
  }
}