const bcrypt = require("bcryptjs")
const prisma = require("../models/index")
const jwt = require("jsonwebtoken")
const createError = require('../utils/createError')

exports.register = async (req, res, next) => {
    console.log(req.body)
    try {
        const { name, email, password, confirmPassword } = req.body

        const isUser = await prisma.user.findUnique({
            where: {
                name: name
            }
        })

        const isEmail = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (isUser && isEmail) {
            return res.status(400).json({ message: "This username and email already exits." })
        }
        if (isUser) {
            return res.status(400).json({ message: "This username already exits." })
        }
        if (isEmail) {
            return res.status(400).json({ message: "This email already exits." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword)
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        })
        res.json({ message: "Register success." })

    } catch (err) {
        next(err)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { input, password, roleInput } = req.body;
        console.log(req.body);

        let user;

        if (roleInput) {
            user = await prisma.user.findUnique({
                where: { email: input }
            });
        } else {
            user = await prisma.user.findUnique({
                where: { name: input }
            });
        }

        if (!user) {
            return res.status(400).json({ message: "This USERNAME/EMAIL and password are invalid." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "This USERNAME/EMAIL and password are invalid." });
        }

        const payload = {
            name: user.name,
            id: user.id,
            role: user.role,
            isBanned: user.isBanned,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ payload, token });
    } catch (err) {
        next(err)
    }
}
