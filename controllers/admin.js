const prisma = require("../models/index")

exports.adminSearchPost = async (req, res, query) => {
    try {
        const { query } = req.body
        console.log(query)
        const posts = await prisma.post.findMany({
            where: {
                content: {
                    contains: query,
                }
            },
            include : {user : true , images : true}



        })
        res.send(posts)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Search Post Error" })
    }
}

exports.adminSearchUser = async (req, res, query) => {
    try {
        const { query } = req.body
        console.log(req.body.query)
        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: query
                }
            },
        })
        // console.log(users)
        res.send(users)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Search User Error" })
    }
}

exports.adminBanUser = async (req, res) => {
    try {
        const { id } = req.params

        console.log(id)
        const banUser = await prisma.user.update({
            where: {
                id: +id
            }, data: { isBanned: true }

        })
        const report = await prisma.reportUser.findFirst({where:{reportedId:+id}})
        if(report){

            await prisma.reportUser.delete({where:{id:report.id}})
        }
        res.send(banUser)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: " Admin Ban can't proceed" })
    }

}

exports.adminUnbanUser = async (req, res) => {
    try {
        const { id } = req.params

        const rs = await prisma.reportUser.findFirst({
            where: {
                reporterId: +id
            }
        })

        console.log('first', rs)
        if (rs) {
            const result = await prisma.reportUser.delete({
                where: {
                    id: rs.id
                }
            })
        }

        console.log(id)
        const unBanUser = await prisma.user.update({
            where: {
                id: +id
            }, data: { isBanned: false }
        })
        res.send(unBanUser)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Admin UnBan can't proceed" })
    }
}

exports.adminBanPost = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const banPost = await prisma.post.update({
            where: {
                id: +id
            }, data: { status: "BANNED" }
        })
        const reportPost = await prisma.reportPost.findFirst({where:{postId:+id}})
        if(reportPost) {
            await prisma.reportPost.delete({where:{id:reportPost.id}})
        }


        res.send(banPost)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Admin Ban Post can't be done" })
    }
}

exports.adminUnbanPost = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const unBanPost = await prisma.post.update({
            where: {
                id: +id
            }, data: { status: "READY" }
        })
        res.send(unBanPost)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Admin Unban Post Can't be done" })
    }
}

exports.adminApprovePost = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const approvePost = await prisma.post.update({
            where: {
                id: +id
            }, data: { status : "READY" }
        })
        res.send(approvePost)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Admin Approved post  completed" })
    }
}

exports.adminRejectPost = async (req, res) => {
    try {
        const { id } = req.params
        const rejectPost = await prisma.post.update({
            where: {
                id: +id
            }, data: { status: "REJECTED" }
        })
        res.send(rejectPost)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Admin Rejected post completed" })
    }
}

exports.adminSearchBanUser = async (req, res) => {
    try {

        const searchBanUser = await prisma.user.findMany({
            where: {
                isBanned: true
            },
        })
        res.send(searchBanUser)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Admin search Ban Users done" })
    }
}

exports.adminSearchBanPost = async (req, res) => {
    try {

        const searchBanPost = await prisma.post.findMany({
            where: {
                status: "BANNED"

            },
            include: {
                user: true,
                images: true
            }
        })
        res.send(searchBanPost)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Admin Search Ban posts done" })
    }
}

exports.adminSearchWaitApprove = async (req, res) => {
    try {

        const searchWaitApprove = await prisma.post.findMany({
            where: {
                status: "WAITING"
            },
            include: {
                user: true,
                images: true
            }
        })
        res.send(searchWaitApprove)
    } catch (err) {
        console.log(err)
        res.status(500), json({ message: "Admin Search Post Approval done" })
    }
}

exports.adminSeachRejectedPost = async (req, res) => {
    try {

        const searchRejectedPost = await prisma.post.findMany({
            where: {
                status: "REJECTED"
            },
            include: {
                user: true,
                images: true
            }
        })
        res.send(searchRejectedPost)
    } catch (err) {
        console.log(err)
        res.status(500), json({ message: "Admin Search Rejected post done" })
    }

}

exports.adminSearchReportUser = async (req, res) => {
    try {
        const { isBan = false, isReport = true } = req.body

        let OR = []

        if (isReport) {
            OR.push( {
                NOT: {
                    UserAsReported: {
                        none: {}
                    }
                }
            })
            
          
        }
        if(isBan){
            OR.push( {
                isBanned: true
            })
           
        }

        const searchReportUser = await prisma.user.findMany({
            where: {
                OR
            }
        })
        
        res.send(searchReportUser)
    } catch (err) {
        console.log(err)
        res.status(500), json({ message: "Admin Search Report Users done" })
    }
}

exports.adminSearchReportPost = async (req, res) => {
    try {
        const searchReportPost = await prisma.post.findMany({
            where: {
                reports: {
                    some: {} // Finds posts with no related ReportPost entries
                }
            },
            include: {
                user: true,
                images: true
            }
        });
        res.send(searchReportPost)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Admin Search Report " })
    }
}

   




