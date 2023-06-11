const { Configuration, OpenAIApi } = require("openai");
const { format } = require("date-fns");
const { MODELS } = require("./constants");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getSignificantEvents = async () => {
  const today = format(new Date(), "d MMMM");
  const prompt = `Generate a list of 10 items of significant events that happens in the past at day "${today}" in web development history. Present me the list as json where key is a date and value is an event description.`;
  console.log(prompt)
  const completion = await openai.createChatCompletion({
    model: MODELS.gpt,
    messages: [{role: "user", content: prompt }],
  }).catch((error) => console.log(error));
  
  try {
    console.log(completion.data.choices[0].message.content)
    const list = JSON.parse(completion.data.choices[0].message.content);
    console.log(list)
    return list;
  } catch (error) {
    console.log(error)
    return null;
  }
}

module.exports = {
  getSignificantEvents
}