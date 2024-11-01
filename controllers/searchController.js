const createError = require("../utils/createError");
const prisma = require("../models");
const getNearbyLandmarks = require("../functions/calculate");

exports.search = async (req, res, next) => {
  try {
    const { current_location_lat, current_location_lng, distance } = req.body;

    if (!current_location_lat || !current_location_lng || !distance) {
      return createError(400, "All fields are required");
    }

    if (distance < 0) {
      return createError(400, "distance must be greater than 0");
    }

    const locationOfPost = await prisma.post.findMany({
      include: {
        user: true,
      },
    });

    const data = await getNearbyLandmarks(
      locationOfPost,
      current_location_lat,
      current_location_lng,
      distance
    );

    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};

exports.searchValue = async (req, res, next) => {
  try {
    const { current_location_lat, current_location_lng, distance, value } =
      req.body;

    if (!current_location_lat || !current_location_lng || !distance || !value) {
      return createError(400, "All fields are required");
    }

    if (distance < 0) {
      return createError(400, "distance must be greater than 0");
    }

    const allPostByValue = await prisma.post.findMany({
      where: {
        content: {
          contains: value,
        },
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

    // res.status(200).json({ allPostByValue });
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};

exports.searchCategory = async (req, res, next) => {
  try {
    const { current_location_lat, current_location_lng, distance, category } =
      req.body;

    if (
      !current_location_lat ||
      !current_location_lng ||
      !distance ||
      !category
    ) {
      return createError(400, "All fields are required");
    }

    if (distance < 0) {
      return createError(400, "distance must be greater than 0");
    }

    const allPostByCategory = await prisma.post.findMany({
      where: {
        category: category,
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
  } catch (err) {
    next(err);
  }
};

exports.searchPostByUserId = async (req, res, next) => {
  try {
    const { current_location_lat, current_location_lng, distance, userId } =
      req.body;

    if (
      !current_location_lat ||
      !current_location_lng ||
      !distance ||
      !userId
    ) {
      return createError(400, "All fields are required");
    }

    if (distance < 0) {
      return createError(400, "distance must be greater than 0");
    }

    const allPostByUserId = await prisma.post.findMany({
      where: {
        userId: Number(userId),
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
