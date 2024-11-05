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
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: `Please summarize the following bulleted in thai not over 5 lines text:\n\n${input}`,
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
