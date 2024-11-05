const prisma = require("../models/index")
const bcrypt = require("bcryptjs")
const createError = require("../utils/createError");
const cloudinary = require("../config/cloundinary");
const path = require("path");
const fs = require("fs/promises");



exports.getProfileData = async (req, res, next) => {
    try {
        console.log("req", req.params)
        const { id } = req.params
        const profileData = await prisma.user.findFirst({
            where: {
                id: Number(id),
            }
        })
        res.status(200).json({ profileData })
    } catch (err) {
        next(err)
    }

}


exports.changeProfileData = async (req, res, next) => {
    try {
        console.log(req.body)
        const { id, displayName, bio } = req.body
        const editProfileData = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                displayName: displayName,
                bio: bio,
            }

        })
        res.status(200).json({ editProfileData })
    } catch (err) {
        next(err)
    }
}

exports.changeProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            createError(400, "Picture not found")
        }
        const resp = await cloudinary.uploader.upload(req.file.path, {
            overwrite: true,
            public_id: path.parse(req.file.path).name,
        })
        console.log("picture", resp)
        res.json({ message: "Update picture done." })

        const user = await prisma.user.findFirst({
            where: {
                id: Number(req.user.id)
            }
        })

        if (user.imageUrl) {
            const public_id = user.imageUrl.split("/")[7].split(".")[0]
            console.log("123", public_id)
            cloudinary.uploader.destroy(public_id)
        }

        const updateUser = await prisma.user.update({
            where: {
                id: Number(req.user.id)
            },
            data: {
                imageUrl: resp.secure_url
            }
        })
        res.status(200).json({ message: "Update picture done.", data: updateUser })
    } catch (err) {
        next(err)

    } finally {
        fs.unlink(req.file.path)
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, id } = req.body

        const user = await prisma.user.findFirst({
            where: {
                id: id
            }
        })
        const isMatch = await bcrypt.compare(oldPassword, user.password)


        if (!isMatch) {
            return res.status(400).json({ message: "Your current password is incorrect." })
        }

        const getPassword = await bcrypt.hash(newPassword, 10)
        const updatePass = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                password: getPassword
            },
        })
        res.json({ message: "Password updated successfully" })
    } catch (err) {
        next(err)
    }
}