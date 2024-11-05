const bcrypt = require("bcryptjs")
const prisma = require("../models/index")
const jwt = require("jsonwebtoken")
const createError = require('../utils/createError')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
require('dotenv').config();



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
                where: {

                    email: { equals: input.toLowerCase(), mode: "insensitive" }

                }
            });
        } else {
            user = await prisma.user.findUnique({
                where: { name: input }
            });
        }

        console.log("user", user)

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

exports.loginGoogle = async (req, res, next) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payloadFromGoogle = ticket.getPayload();
        const password = payloadFromGoogle['sub'];
        const email = payloadFromGoogle['email'];
        const name = payloadFromGoogle['name'];
        const displayName = payloadFromGoogle['given_name'];

        let user = await prisma.user.findFirst({
            where: {
                name: name
            }
        })

        if (!user) {
            await prisma.user.create({
                data: {
                    password: password,
                    email: email,
                    name: name,
                    displayName: displayName,
                }
            })
        } else {
            await prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    name: name,
                    displayName: displayName,
                }

            })
        }

        const payload = {
            name: user.name,
            id: user.id,
            role: user.role,
            isBanned: user.isBanned,
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ payload, accessToken });

    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).send('Invalid token');
    }
};