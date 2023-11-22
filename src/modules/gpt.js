const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { OpenAI } = require("openai");
const NodeCache = require( "node-cache" );
const { getLanguageRole } = require("./roles");
const { gpt } = require("../modules/messages");
const { colors } = require("../constants");

const gptCounter = new NodeCache({ stdTTL: 86400 });

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
    messages: [{role: "user", content: prompt}],
  });
}

const saveGptCounter = (memberId, counter) => {
  gptCounter.set(memberId.toString(), counter);
}

const getGptCounter = (memberId) => {
  return gptCounter.get(memberId.toString());
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
  async getAnswer(text, memberId) {
    let completion;
    const counter = getGptCounter(memberId) || 1;
    saveGptCounter(memberId, counter + 1);
    if (counter < 5) {
      try {
        completion = await createCompletion(MODELS.gpt4, 4096, text);
      } catch (error) {
        console.error(MODELS.gpt4, error);
      }
      console.log("using " + MODELS.gpt4);
      if (completion) return completion.choices[0].message.content;
    }
    try {
      completion = await createCompletion(MODELS.gpt3, 4000, text);
    } catch (error) {
      console.error(MODELS.gpt3, error);
    }
    console.log("using " + MODELS.gpt3);
    if (completion) return completion.choices[0].message.content;
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