const express = require('express')
const { adminSearchPost, adminSearchUser, adminBanUser, adminUnbanUser, adminBanPost, adminUnbanPost, adminApprovePost, adminRejectPost, adminSearchBanUser, adminSearchWaitApprove, adminSeachRejectedPost, adminSearchBanPost, adminSearchReportUser, adminSearchReportPost } = require('../controllers/admin')
const adminRoute = express.Router()




//import controller



adminRoute.post('/search/post',adminSearchPost)
adminRoute.post('/search/user',adminSearchUser)
adminRoute.post('/ban/user/:id',adminBanUser)
adminRoute.post('/unban/user/:id',adminUnbanUser)
adminRoute.post('/ban/post/:id',adminBanPost)
adminRoute.post('/unban/post/:id',adminUnbanPost)
adminRoute.post('/approve/post/:id',adminApprovePost)
adminRoute.post('/reject/post/:id',adminRejectPost)
adminRoute.post('/searchBanUser', adminSearchBanUser)
adminRoute.post('/searchBanPost',adminSearchBanPost)
adminRoute.post('/searchWaitApprove',adminSearchWaitApprove)
adminRoute.post('/searchRejectedPost',adminSeachRejectedPost)
adminRoute.post('/searchReportUser',adminSearchReportUser)
adminRoute.post('/searchReportPost',adminSearchReportPost)

module.exports = adminRoute