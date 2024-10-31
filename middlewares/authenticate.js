const prisma = require('../models/index')
const createError = require('../utils/createError')
const jwt = require('jsonwebtoken')

exports.authenticate = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization
        if (!authorization || !authorization.startsWith("Bearer")) {
            return createError(401, "Unauthorized")
        }
        console.log(authorization)
        const token = authorization.split(" ")[1]
        if (!token) {
            return createError(401, "Unauthorized")
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const foundUser = await prisma.user.findUnique({ where: { email: payload.email } })
        if (!foundUser) {
            return createError(401, "Unauthorized")
        }
        const { password, email, ...userData } = foundUser
        req.user = userData
        next()
    } catch (err) {
        next(err)
    }
}