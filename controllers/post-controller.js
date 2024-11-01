const prisma = require("../models");
const tryCatch = require("../utils/tryCatch");
const createError = require("../utils/createError");

module.exports.getPost = tryCatch(async (req, res, next) => {
  const { postId } = req.body;
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
  const resPost = {
    ...post,
    upVoteCount,
    downVoteCount,
    comments: post.comments.map((comment) => ({
      ...comment,
      upVoteCount: comment.votes.filter((vote) => vote.status === "UP").length,
      downVoteCount: comment.votes.filter((vote) => vote.status === "DOWN")
        .length,
    })),
  };
  res.json({ msg: "Get post sucessful...", resPost });
});
module.exports.upPost = tryCatch(async (req, res, next) => {
  const userId = 1; //<----------------dummy
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
  const userId = 1; //<----------------dummy
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
  const userId = 1; //<----------------dummy
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
  const userId = 1; //<----------------dummy
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
  const userId = 1; //<----------------dummy
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
  const userId = 1; //<----------------dummy
  const { commentTxt, commentId } = req.body;
  console.log(commentId, commentTxt);
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
  const userId = 1; //<----------------dummy
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
  const userId = 1; //<----------------dummy
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
