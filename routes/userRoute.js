const express = require("express")
const router = express.Router()
const UserController = require("../controllers/UserController")
const upload = require("../middlewares/upload")
const { authenticate } = require("../middlewares/authenticate")


router.get("/:id", UserController.getProfileData)
router.patch("/update-info", UserController.changeProfileData)
router.patch("/update-password", UserController.changePassword)
router.patch("/update-profile-pic", authenticate, upload.single("image"), UserController.changeProfilePicture)


module.exports = router