const express = require("express");
const postRoute = express.Router();
const postController = require("../controllers/post-controller");
const authenticate = require("../middlewares/authenticate");

postRoute.post("/", postController.getPost);
postRoute.post("/up", postController.upPost);
postRoute.post("/down", postController.downPost);
postRoute.post("/comment", postController.getComment);
postRoute.post("/comment/add", postController.addComment);
postRoute.post("/comment/delete", postController.delComment);
postRoute.patch("/comment/edit", postController.editComment);
postRoute.post("/comment/up", postController.upComment);
postRoute.post("/comment/down", postController.downComment);
module.exports = postRoute;
