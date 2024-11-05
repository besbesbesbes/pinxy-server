const express = require("express");
const postRoute = express.Router();
const postController = require("../controllers/post-controller");
const { authenticate } = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

postRoute.post("/", authenticate, postController.getPost);
postRoute.post(
  "/new",
  authenticate,
  upload.array("images", 10),
  postController.newPost
);
postRoute.post("/delete", authenticate, postController.deletePost);
postRoute.post(
  "/edit",
  authenticate,
  upload.array("images", 10),
  postController.editPost
);
postRoute.post("/up", authenticate, postController.upPost);
postRoute.post("/down", authenticate, postController.downPost);
postRoute.post("/comment", authenticate, postController.getComment);
postRoute.post("/comment/add", authenticate, postController.addComment);
postRoute.post("/comment/delete", authenticate, postController.delComment);
postRoute.patch("/comment/edit", authenticate, postController.editComment);
postRoute.post("/comment/up", authenticate, postController.upComment);
postRoute.post("/comment/down", authenticate, postController.downComment);
postRoute.get("/new/user", authenticate, postController.newPostUser);
postRoute.get("/report/post", authenticate, postController.getReportPostReason);
postRoute.post("/report/post", authenticate, postController.reportPost);
postRoute.get("/report/user", authenticate, postController.getReportUserReason);
postRoute.post("/report/user", authenticate, postController.reportUser);
postRoute.post(
  "/report/reported-user",
  authenticate,
  postController.reportedUser
);

module.exports = postRoute;
