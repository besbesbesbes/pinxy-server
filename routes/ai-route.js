const express = require("express");
const aiRoute = express.Router();
const aiController = require("../controllers/ai-controller");
const { authenticate } = require("../middlewares/authenticate");

aiRoute.post("/summary", authenticate, aiController.getAiSummary);
aiRoute.post("/sentiment", authenticate, aiController.getSentiment);
aiRoute.post("/askme", authenticate, aiController.getAskme);

module.exports = aiRoute;
