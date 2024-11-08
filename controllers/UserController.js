const prisma = require("../models/index")
const bcrypt = require("bcryptjs")
const createError = require("../utils/createError");
const cloudinary = require("../config/cloundinary");
const path = require("path");
const fs = require("fs/promises");
const nodemailer = require("nodemailer")
const crypto = require("crypto")



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

exports.checkResetPasswordData = async (req, res, next) => {
    try {
        const { realName, email } = req.body
        const checkRealName = await prisma.user.findFirst({
            where: {
                name: realName,
            }
        })
        if (!checkRealName) {
            return res.status(400).json({ message: "Your name or email is incorrect." })
        }
        const checkEmail = await prisma.user.findFirst({
            where: {
                email: email,
            }
        })
        if (!checkEmail) {
            return res.status(400).json({ message: "Your name or email is incorrect." })
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',  // เลือก provider ที่ใช้ เช่น Gmail
            auth: {
                user: 'supakornpattayanant@gmail.com', // อีเมลที่ใช้ส่ง
                pass: process.env.EMAIL_PASSWORD,  // รหัสผ่านแอปพลิเคชัน
            },
            tls: {
                rejectUnauthorized: false
            }
        });



        const token = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires = Date.now() + 1800000;
        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                password: token,
                updatedAt: (new Date(resetPasswordExpires))
            }
        })

        const resetUrl = `http://localhost:5173/reset-password/${token}`

        const mailOptions = {
            from: 'supakornpattayanant@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Failed to send email' });
            } else {
                res.status(200).json({ message: 'Password reset email sent!' });
            }
        });

    } catch (err) {
        next(err)
    }

}

exports.resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword, confirmNewPassword } = req.body
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "Password and confirm password aren't match" })
        }

        const checkToken = await prisma.user.findFirst({
            where: {
                password: token
            }
        })

        console.log("checktoken", checkToken)

        if (!checkToken) {
            return res.status(400).json({ message: "Token is invalid." })
        }
        if (checkToken.updatedAt < Date.now()) {
            return res.status(400).json({ message: 'Token has expired. Please request a new password reset.' });
        }


        const getPassword = await bcrypt.hash(newPassword, 10)
        const updatePass = await prisma.user.update({
            where: {
                id: checkToken.id,
            },
            data: {
                password: getPassword
            },
        })
        res.json({ message: "Password reset successfully" })

    } catch (err) {
        next(err)
    }
}