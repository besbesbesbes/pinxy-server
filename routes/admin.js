const express = require('express')
const { adminSearchPost, adminSearchUser, adminBanUser, adminUnbanUser, adminBanPost, adminUnbanPost } = require('../controllers/admin')
const authRoute = express.Router()




//import controller



authRoute.post('/search/post',adminSearchPost)
authRoute.post('/search/user',adminSearchUser)
authRoute.post('/ban/user/:id',adminBanUser)
authRoute.post('/unban/user/:id',adminUnbanUser)
authRoute.post('/ban/post/:id',adminBanPost)
authRoute.post('/unban/post/:id',adminUnbanPost)

module.exports = authRoute