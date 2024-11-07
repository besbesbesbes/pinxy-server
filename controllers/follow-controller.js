const createError = require("../utils/createError");
const prisma = require("../models");

exports.follow = async (req, res, next) => {
  try {
    const { userId, followingId } = req.body;

    // เช็คว่าไม่สามารถ follow ตัวเองได้
    if (userId === followingId) {
      return createError(400, "You cannot follow yourself.");
    }

    // เช็คว่ามี user ทั้ง 2 คนหรือไม่
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return createError(400, "User not found!");
    }

    const following = await prisma.user.findUnique({
      where: { id: followingId },
    });
    if (!following) {
      return createError(400, "User to follow not found!");
    }

    // เช็คว่าเรา follow แล้วหรือยัง
    const existingRelationship = await prisma.relationship.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId,
        },
      },
    });

    if (existingRelationship) {
      return createError(400, "You are already following this user.");
    }

    // Follow action: Create the relationship
    await prisma.relationship.create({
      data: {
        followerId: userId,
        followingId: followingId,
      },
    });

    res.status(200).json({ msg: "Follow successful." });
  } catch (err) {
    next(err);
  }
};

exports.unfollow = async (req, res, next) => {
  try {
    const { userId, followingId } = req.body;

    // เช็คว่าไม่สามารถ follow ตัวเองได้
    if (userId === followingId) {
      return createError(400, "You cannot follow yourself.");
    }

    // เช็คว่ามี user ทั้ง 2 คนหรือไม่
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return next(createError(400, "User not found!"));
    }

    const following = await prisma.user.findUnique({
      where: { id: followingId },
    });
    if (!following) {
      return next(createError(400, "User to unfollow not found!"));
    }

    // เช็คว่าเรา follow แล้วหรือยัง
    const existingRelationship = await prisma.relationship.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId,
        },
      },
    });

    if (!existingRelationship) {
      return next(createError(400, "You are not following this user."));
    }

    // Unfollow action: Delete the relationship
    await prisma.relationship.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId,
        },
      },
    });

    res.status(200).json({ msg: "Unfollow successful." });
  } catch (err) {
    next(err);
  }
};
