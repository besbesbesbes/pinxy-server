const prisma = require("../models/index")

exports.adminSearchPost = async (req, res, query) => {
    try {
        const { query} = req.body
        console.log(query)
        const posts = await prisma.post.findMany({
            where: {
                content: {
                    contains: query,
                }
            },
        

            
        })
        res.send(posts)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Search Post Error" })
    }
}

exports.adminSearchUser = async (req,res,query) => {
    try {
        const {query} = req.body
        console.log(req.body.query)
        const users = await prisma.user.findMany({
            where : {
                name : {
                    contains : query
                }
            },
        })
        // console.log(users)
        res.send(users)
    }catch(err) {
        //err
        console.log(err)
        res.status(500).json({message : "Search User Error"})
    }
}

exports.adminBanUser = async (req,res) => {
    try {
        const {id} = req.params
        
        console.log(id)
            const banUser = await prisma.user.update({
                where : {
                   id : +id 
                } , data : {isBanned : true}
             
    })
    res.send(banUser)
    }catch(err) {
        console.log(err)
        res.status(500).json ({message : " Admin Ban can't proceed"})
    }

}

exports.adminUnbanUser = async (req,res) => {
    try {
        const {id} = req.params
        
        console.log(id)
        const unBanUser = await prisma.user.update({
            where : {
                id : +id
            } ,data : {isBanned : false}
        })
        res.send(unBanUser)
    }catch(err) {
        console.log(err)
        res.status(500).json ({message : "Admin UnBan can't proceed"})
    }
}

exports.adminBanPost = async (req,res) => {
    try {
        const {id} = req.params
        console.log(id)
        const banPost = await prisma.post.update({
            where : {
                id : +id
            } , data : {status : "BANNED"}
        })
        res.send(banPost)
    }catch(err) {
        console.log(err)
        res.status(500).json ({message : "Admin Ban Post can't be done"})
    }
}

exports.adminUnbanPost = async (req,res) => {
    try {
        const {id} = req.params
        console.log(id)
        const unBanPost = await prisma.post.update({
            where : {
                id : +id
            },data : {status : "READY"}
        })
        res.send(unBanPost)
    } catch(err) {
        console.log(err)
        res.status(500).json ({ message : "Admin Unban Post Can't be done"})
    }
}





