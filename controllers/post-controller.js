const prisma = require("../models");
const tryCatch = require("../utils/tryCatch");
const createError = require("../utils/createError");
const cloudinary = require("../config/cloundinary");
const fs = require("fs/promises");
const getPublicId = require("../utils/getPublicId");
const path = require("path");

module.exports.getPost = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.body;
  //find user
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
  });
  if (!user) {
    createError(401, "Unauthorized!");
  }
  //find post
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      user: true,
      images: true,
      //   votes: true,
      comments: {
        include: {
          user: true,
          votes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });
  //valiate have post?
  if (!post) {
    createError(400, "Post not found!");
  }
  // count post vote
  const [upVoteCount, downVoteCount] = await Promise.all([
    prisma.votePost.count({
      where: {
        postId: post.id,
        status: "UP",
      },
    }),
    prisma.votePost.count({
      where: {
        postId: post.id,
        status: "DOWN",
      },
    }),
  ]);
  const userVotePost = await prisma.votePost.findFirst({
    where: {
      postId: post.id,
      userId,
    },
  });
  let userVotePostValue = "";
  if (userVotePost) {
    userVotePostValue = userVotePost.status;
  }
  const resPost = {
    ...post,
    upVoteCount,
    downVoteCount,
    userVotePostValue,
    comments: post.comments.map((comment) => {
      const userVote = comment.votes.find(
        (vote) => vote.userId === req.user.id
      );

      return {
        ...comment,
        upVoteCount: comment.votes.filter((vote) => vote.status === "UP")
          .length,
        downVoteCount: comment.votes.filter((vote) => vote.status === "DOWN")
          .length,
        userVote: userVote ? userVote.status : "",
      };
    }),
  };
  res.json({ msg: "Get post sucessful...", resPost, user });
});
module.exports.newPostUser = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  res.json({ msg: "Get post user sucessful...", user });
});
module.exports.newPost = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { txt, lat, lng, drt, cat } = req.body;
  const endTime = new Date(Date.now() + drt * 60 * 60 * 1000);
  const expirationDate = endTime.toISOString();
  // validation
  if (!txt || !lat || !lng || !drt || !cat) {
    createError(400, "Post infor should be provided");
  }
  //upload to cloundinary
  const haveFiles = !!req.files;
  let uploadResults = [];
  if (haveFiles) {
    for (const file of req.files) {
      try {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          overwrite: true,
          public_id: path.parse(file.path).name,
          folder: "Pinxy/test",
          width: 500,
          height: 500,
          crop: "limit",
        });
        uploadResults.push(uploadResult.secure_url);
        fs.unlink(file.path);
      } catch (err) {
        return next(createError(500, "Fail to upload image"));
      }
    }
  }
  // create new post
  const post = await prisma.post.create({
    data: {
      userId,
      content: txt,
      category: cat,
      locationLat: +lat,
      locationLng: +lng,
      expirationDate,
      isAIReviewed: false,
      locationTitle: "NA",
      status: "READY",
    },
  });
  // create post pictures
  for (const rs of uploadResults) {
    await prisma.imagePost.create({
      data: {
        postId: post.id,
        imageUrl: rs,
      },
    });
  }
  res.json({ msg: "New post sucessful...", post });
});
module.exports.upPost = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.body;
  //   validate
  const vote = await prisma.votePost.findFirst({
    where: {
      postId,
      userId,
    },
  });
  if (vote) {
    if (vote.status == "DOWN") {
      await prisma.votePost.delete({
        where: {
          id: vote.id,
        },
      });
      await prisma.votePost.create({
        data: {
          userId,
          postId,
          status: "UP",
        },
      });
    } else {
      await prisma.votePost.delete({
        where: {
          id: vote.id,
        },
      });
    }
  } else {
    await prisma.votePost.create({
      data: {
        userId,
        postId,
        status: "UP",
      },
    });
  }
  res.json({ msg: "Post up sucessful..." });
});

module.exports.downPost = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.body;
  //   validate
  const vote = await prisma.votePost.findFirst({
    where: {
      postId,
      userId,
    },
  });
  if (vote) {
    if (vote.status == "UP") {
      await prisma.votePost.delete({
        where: {
          id: vote.id,
        },
      });
      await prisma.votePost.create({
        data: {
          userId,
          postId,
          status: "DOWN",
        },
      });
    } else {
      await prisma.votePost.delete({
        where: {
          id: vote.id,
        },
      });
    }
  } else {
    await prisma.votePost.create({
      data: {
        userId,
        postId,
        status: "DOWN",
      },
    });
  }
  res.json({ msg: "Post down sucessful..." });
});

module.exports.getComment = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId } = req.body;
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      user: true,
    },
  });
  if (!comment) {
    createError(400, "Comment not found!");
  }
  res.json({ msg: "Comment get sucessful...", comment });
});

module.exports.addComment = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { postId, commentTxt } = req.body;
  await prisma.comment.create({
    data: {
      userId,
      postId,
      content: commentTxt,
    },
  });
  res.json({ msg: "Comment added sucessful..." });
});

module.exports.delComment = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId } = req.body;
  //validate
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!comment) {
    createError(400, "Comment not found!");
  }
  if (comment.userId !== userId) {
    createError(401, "Unauthorized!");
  }
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
  res.json({ msg: "Comment added sucessful..." });
});

module.exports.editComment = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { commentTxt, commentId } = req.body;
  //validate
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!comment) {
    createError(400, "Comment not found!");
  }
  if (comment.userId !== userId) {
    createError(401, "Unauthorized!");
  }
  //update comment
  await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: commentTxt,
    },
  });
  res.json({ msg: "Comment edited sucessful..." });
});
module.exports.upComment = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId } = req.body;
  //   validate
  const vote = await prisma.voteComment.findFirst({
    where: {
      commentId,
      userId,
    },
  });
  if (vote) {
    if (vote.status == "DOWN") {
      await prisma.voteComment.delete({
        where: {
          id: vote.id,
        },
      });
      await prisma.voteComment.create({
        data: {
          userId,
          commentId,
          status: "UP",
        },
      });
    } else {
      await prisma.voteComment.delete({
        where: {
          id: vote.id,
        },
      });
    }
  } else {
    await prisma.voteComment.create({
      data: {
        userId,
        commentId,
        status: "UP",
      },
    });
  }
  res.json({ msg: "Comment up sucessful..." });
});
module.exports.downComment = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId } = req.body;
  //   validate
  const vote = await prisma.voteComment.findFirst({
    where: {
      commentId,
      userId,
    },
  });
  if (vote) {
    if (vote.status == "UP") {
      await prisma.voteComment.delete({
        where: {
          id: vote.id,
        },
      });
      await prisma.voteComment.create({
        data: {
          userId,
          commentId,
          status: "DOWN",
        },
      });
    } else {
      await prisma.voteComment.delete({
        where: {
          id: vote.id,
        },
      });
    }
  } else {
    await prisma.voteComment.create({
      data: {
        userId,
        commentId,
        status: "DOWN",
      },
    });
  }
  res.json({ msg: "Comment down sucessful..." });
});
module.exports.getReportPostReason = tryCatch(async (req, res, next) => {
  const reasons = await prisma.reportPostReason.findMany();
  res.json({ msg: "Get report post reason sucessful...", reasons });
});
module.exports.reportPost = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { postId, reasonId } = req.body;
  await prisma.reportPost.create({
    data: {
      userId,
      postId,
      reportPostReasonId: +reasonId,
      reportTime: new Date(),
    },
  });
  res.json({ msg: "Report post sucessful..." });
});

module.exports.getReportUserReason = tryCatch(async (req, res, next) => {
  const reasons = await prisma.reportUserReason.findMany();
  res.json({ msg: "Get report user reason sucessful...", reasons });
});
module.exports.reportUser = tryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const { reportedUserId, reasonId } = req.body;
  await prisma.reportUser.create({
    data: {
      reporterId: userId,
      reportedId: reportedUserId,
      reportUserReasonId: +reasonId,
      reportTime: new Date(),
    },
  });
  res.json({ msg: "Report user sucessful..." });
});
module.exports.reportedUser = tryCatch(async (req, res, next) => {
  const { reportedUserId } = req.body;
  const reportedUser = await prisma.user.findUnique({
    where: {
      id: reportedUserId,
    },
  });
  res.json({ msg: "Reported user sucessful...", reportedUser });
});
