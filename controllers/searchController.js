const createError = require("../utils/createError");
const prisma = require("../models");
const getNearbyLandmarks = require("../functions/calculate");

exports.search = async (req, res, next) => {
  try {
    const {
      current_location_lat,
      current_location_lng,
      distance,
      sort,
      order,
    } = req.body;

    if (
      !current_location_lat ||
      !current_location_lng ||
      !distance ||
      !sort ||
      !order
    ) {
      return createError(400, "All fields are required");
    }

    if (distance < 0) {
      return createError(400, "distance must be greater than 0");
    }

    if (!["asc", "desc"].includes(order)) {
      return createError(400, "order must be asc or desc");
    }

    if (!["distance", "createdAt", "upVote"].includes(sort)) {
      return createError(400, "sort must be distance, createdAt, or upVote");
    }

    if (sort === "distance") {
      const allPostByDistance = await prisma.post.findMany({
        where: {
          status: "READY",
        },
        include: {
          user: true,
        },
      });

      const data = await getNearbyLandmarks(
        allPostByDistance,
        current_location_lat,
        current_location_lng,
        distance
      );

      // Sort the resulting data based on the distance and order
      data.sort((a, b) => {
        return order === "asc"
          ? a.distance - b.distance
          : b.distance - a.distance;
      });

      res.status(200).json({ data });
    }

    if (sort === "createdAt") {
      const allPostByDistance = await prisma.post.findMany({
        where: {
          status: "READY",
        },
        orderBy: {
          createdAt: order,
        },
        include: {
          user: true,
        },
      });

      const data = await getNearbyLandmarks(
        allPostByDistance,
        current_location_lat,
        current_location_lng,
        distance
      );

      res.status(200).json({ data });
    }

    if (sort === "upVote") {
      const allPostByDistance = await prisma.post.findMany({
        where: {
          status: "READY",
        },
        include: {
          user: true,
          votes: true,
        },
      });

      // Count the number of UP votes for each post
      const postsWithUpVotes = allPostByDistance.map((post) => {
        const upVoteCount = post.votes.filter(
          (vote) => vote.status === "UP"
        ).length;
        return { ...post, upVoteCount };
      });

      // Sort posts by upVoteCount
      postsWithUpVotes.sort((a, b) => {
        return order === "asc"
          ? a.upVoteCount - b.upVoteCount
          : b.upVoteCount - a.upVoteCount;
      });

      const data = await getNearbyLandmarks(
        postsWithUpVotes,
        current_location_lat,
        current_location_lng,
        distance
      );

      res.status(200).json({ data });
    }
  } catch (err) {
    next(err);
  }
};

exports.searchValue = async (req, res, next) => {
  try {
    const {
      current_location_lat,
      current_location_lng,
      distance,
      sort,
      order,
      value,
    } = req.body;

    if (
      !current_location_lat ||
      !current_location_lng ||
      !distance ||
      !sort ||
      !order ||
      !value
    ) {
      return createError(400, "All fields are required");
    }

    if (distance < 0) {
      return createError(400, "distance must be greater than 0");
    }

    if (!["asc", "desc"].includes(order)) {
      return createError(400, "order must be asc or desc");
    }

    if (!["distance", "createdAt", "upVote"].includes(sort)) {
      return createError(400, "sort must be distance, createdAt, or upVote");
    }

    if (value.trim() === "") {
      return createError(400, "value cannot be empty");
    }

    if (sort === "distance") {
      const allPostByValue = await prisma.post.findMany({
        where: {
          content: {
            contains: value,
          },
          status: "READY",
        },
        include: {
          user: true,
        },
      });

      const data = await getNearbyLandmarks(
        allPostByValue,
        current_location_lat,
        current_location_lng,
        distance
      );

      // Sort the resulting data based on the distance and order
      data.sort((a, b) => {
        return order === "asc"
          ? a.distance - b.distance
          : b.distance - a.distance;
      });

      res.status(200).json({ data });
    }

    if (sort === "createdAt") {
      const allPostByValue = await prisma.post.findMany({
        where: {
          content: {
            contains: value,
          },
          status: "READY",
        },
        orderBy: {
          createdAt: order,
        },
        include: {
          user: true,
        },
      });

      const data = await getNearbyLandmarks(
        allPostByValue,
        current_location_lat,
        current_location_lng,
        distance
      );

      res.status(200).json({ data });
    }

    if (sort === "upVote") {
      const allPostByValue = await prisma.post.findMany({
        where: {
          content: {
            contains: value,
          },
          status: "READY",
        },
        include: {
          user: true,
          votes: true,
        },
      });

      // Count the number of UP votes for each post
      const postsWithUpVotes = allPostByValue.map((post) => {
        const upVoteCount = post.votes.filter(
          (vote) => vote.status === "UP"
        ).length;
        return { ...post, upVoteCount };
      });

      // Sort posts by upVoteCount
      postsWithUpVotes.sort((a, b) => {
        return order === "asc"
          ? a.upVoteCount - b.upVoteCount
          : b.upVoteCount - a.upVoteCount;
      });

      const data = await getNearbyLandmarks(
        postsWithUpVotes,
        current_location_lat,
        current_location_lng,
        distance
      );

      res.status(200).json({ data });
    }
  } catch (err) {
    next(err);
  }
};

exports.searchCategory = async (req, res, next) => {
  try {
    const {
      current_location_lat,
      current_location_lng,
      distance,
      sort,
      order,
      category,
    } = req.body;

    if (
      !current_location_lat ||
      !current_location_lng ||
      !distance ||
      !sort ||
      !order ||
      !category
    ) {
      return createError(400, "All fields are required");
    }

    if (distance < 0) {
      return createError(400, "distance must be greater than 0");
    }

    if (!["asc", "desc"].includes(order)) {
      return createError(400, "order must be asc or desc");
    }

    if (!["distance", "createdAt", "upVote"].includes(sort)) {
      return createError(400, "sort must be distance, createdAt, or upVote");
    }

    if (
      category !== "ALERT" &&
      category !== "NEWS" &&
      category !== "SHOP" &&
      category !== "JOB" &&
      category !== "OTHER"
    ) {
      return createError(
        400,
        "category must be ALERT, NEWS, SHOP, JOB, or OTHER"
      );
    }

    if (sort === "distance") {
      const allPostByCategory = await prisma.post.findMany({
        where: {
          category: category,
          status: "READY",
        },
        include: {
          user: true,
        },
      });

      const data = await getNearbyLandmarks(
        allPostByCategory,
        current_location_lat,
        current_location_lng,
        distance
      );

      // Sort the resulting data based on the distance and order
      data.sort((a, b) => {
        return order === "asc"
          ? a.distance - b.distance
          : b.distance - a.distance;
      });

      res.status(200).json({ data });
    }

    if (sort === "createdAt") {
      const allPostByCategory = await prisma.post.findMany({
        where: {
          category: category,
          status: "READY",
        },
        orderBy: {
          createdAt: order,
        },
        include: {
          user: true,
        },
      });

      const data = await getNearbyLandmarks(
        allPostByCategory,
        current_location_lat,
        current_location_lng,
        distance
      );

      res.status(200).json({ data });
    }

    if (sort === "upVote") {
      const allPostByCategory = await prisma.post.findMany({
        where: {
          category: category,
          status: "READY",
        },
        include: {
          user: true,
          votes: true,
        },
      });

      // Count the number of UP votes for each post
      const postsWithUpVotes = allPostByCategory.map((post) => {
        const upVoteCount = post.votes.filter(
          (vote) => vote.status === "UP"
        ).length;
        return { ...post, upVoteCount };
      });

      // Sort posts by upVoteCount
      postsWithUpVotes.sort((a, b) => {
        return order === "asc"
          ? a.upVoteCount - b.upVoteCount
          : b.upVoteCount - a.upVoteCount;
      });

      const data = await getNearbyLandmarks(
        postsWithUpVotes,
        current_location_lat,
        current_location_lng,
        distance
      );

      res.status(200).json({ data });
    }
  } catch (err) {
    next(err);
  }
};

exports.searchPostByUserId = async (req, res, next) => {
  try {
    const {
      current_location_lat,
      current_location_lng,
      distance,
      sort,
      order,
      userId,
    } = req.body;

    if (
      !current_location_lat ||
      !current_location_lng ||
      !distance ||
      !sort ||
      !order ||
      !userId
    ) {
      return createError(400, "All fields are required");
    }

    if (distance < 0) {
      return createError(400, "distance must be greater than 0");
    }

    if (!["asc", "desc"].includes(order)) {
      return createError(400, "order must be asc or desc");
    }

    if (!["distance", "createdAt", "upVote"].includes(sort)) {
      return createError(400, "sort must be distance, createdAt, or upVote");
    }

    const findUser = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!findUser) {
      return createError(400, "User not found");
    }

    if (sort === "distance") {
      const allPostByUserId = await prisma.post.findMany({
        where: {
          userId: Number(userId),
          status: "READY",
        },
        include: {
          user: true,
        },
      });

      const data = await getNearbyLandmarks(
        allPostByUserId,
        current_location_lat,
        current_location_lng,
        distance
      );

      // Sort the resulting data based on the distance and order
      data.sort((a, b) => {
        return order === "asc"
          ? a.distance - b.distance
          : b.distance - a.distance;
      });

      res.status(200).json({ data });
    }

    if (sort === "createdAt") {
      const allPostByUserId = await prisma.post.findMany({
        where: {
          userId: Number(userId),
          status: "READY",
        },
        orderBy: {
          createdAt: order,
        },
        include: {
          user: true,
        },
      });

      const data = await getNearbyLandmarks(
        allPostByUserId,
        current_location_lat,
        current_location_lng,
        distance
      );

      res.status(200).json({ data });
    }

    if (sort === "upVote") {
      const allPostByUserId = await prisma.post.findMany({
        where: {
          userId: Number(userId),
          status: "READY",
        },
        include: {
          user: true,
          votes: true,
        },
      });

      // Count the number of UP votes for each post
      const postsWithUpVotes = allPostByUserId.map((post) => {
        const upVoteCount = post.votes.filter(
          (vote) => vote.status === "UP"
        ).length;
        return { ...post, upVoteCount };
      });

      // Sort posts by upVoteCount
      postsWithUpVotes.sort((a, b) => {
        return order === "asc"
          ? a.upVoteCount - b.upVoteCount
          : b.upVoteCount - a.upVoteCount;
      });

      const data = await getNearbyLandmarks(
        postsWithUpVotes,
        current_location_lat,
        current_location_lng,
        distance
      );

      res.status(200).json({ data });
    }
  } catch (err) {
    next(err);
  }
};

exports.searchUser = async (req, res, next) => {
  try {
    const { displayName } = req.body;
    const users = await prisma.user.findMany({
      where: {
        isBanned: false,
        role: "USER",
        displayName: {
          contains: displayName,
        },
      },
    });
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};
