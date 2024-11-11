const express = require('express')
const { adminSearchPost, adminSearchUser, adminBanUser, adminUnbanUser, adminBanPost, adminUnbanPost, adminApprovePost, adminRejectPost, adminSearchBanUser, adminSearchWaitApprove, adminSeachRejectedPost, adminSearchBanPost, adminSearchReportUser, adminSearchReportPost } = require('../controllers/admin')
const adminRoute = express.Router()
const { authenticate } = require('../middlewares/authenticate')



//import controller



adminRoute.post('/search/post', authenticate, adminSearchPost)
adminRoute.post('/search/user', authenticate, adminSearchUser)
adminRoute.post('/ban/user/:id', authenticate, adminBanUser)
adminRoute.post('/unban/user/:id', authenticate, adminUnbanUser)
adminRoute.post('/ban/post/:id', authenticate, adminBanPost)
adminRoute.post('/unban/post/:id', authenticate, adminUnbanPost)
adminRoute.post('/approve/post/:id', authenticate, adminApprovePost)
adminRoute.post('/reject/post/:id', authenticate, adminRejectPost)
adminRoute.post('/searchBanUser', authenticate, adminSearchBanUser)
adminRoute.post('/searchBanPost', authenticate, adminSearchBanPost)
adminRoute.post('/searchWaitApprove', authenticate, adminSearchWaitApprove)
adminRoute.post('/searchRejectedPost', authenticate, adminSeachRejectedPost)
adminRoute.post('/searchReportUser', authenticate, adminSearchReportUser)
adminRoute.post('/searchReportPost', authenticate, adminSearchReportPost)

module.exports = adminRoute