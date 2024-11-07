const prisma = require("../models");
const tryCatch = require("../utils/tryCatch");
const createError = require("../utils/createError");
require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports.getAiSummary = tryCatch(async (req, res, next) => {
  const { postForAI } = req.body;
  console.log(postForAI);
  if (postForAI.length == 0) {
    createError(400, "No data to send to ai!");
  }
  const input = postForAI.join(", ");
  const resp = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Please summarize the following text in english and thai which should not over 10 lines each and make result like someone telling you about what happened around you and also add recommendation about how to handel or live in this situation text:\n\n${input}`,
      },
    ],
  });
  const summary = resp.choices[0].message.content.trim();
  console.log(summary);

  res.json({ msg: "Get ai summary sucessful...", summary });
});

module.exports.getSentiment = tryCatch(async (req, res, next) => {
  const { txt } = req.body;
  if (!txt) {
    createError(400, "No text to judge sentiment!");
  }
  const resp = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: `Given the following text, please identify the most dominant emotion and respond with one word: "${txt}"`,
      },
    ],
  });
  const sentiment = resp.choices[0].message.content.trim();
  console.log(`Emotion: ${sentiment}`);
  res.json({ msg: "Get sentiment sucessful...", sentiment });
});

module.exports.getAskme = tryCatch(async (req, res, next) => {
  const { chats } = req.body;
  // console.log(chats);
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: chats,
  });
  const content = response.choices[0].message.content.trim();
  console.log(`Content: ${content}`);
  res.json({ msg: "Get ask me sucessful...", content });
});
