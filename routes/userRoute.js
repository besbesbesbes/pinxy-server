const express = require("express")
const router = express.Router()
const UserController = require("../controllers/UserController")
const upload = require("../middlewares/upload")
const { authenticate } = require("../middlewares/authenticate")


router.get("/:id", authenticate, UserController.getProfileData)
router.patch("/update-info", authenticate, UserController.changeProfileData)
router.patch("/update-password", authenticate, UserController.changePassword)
router.patch("/update-profile-pic", authenticate, upload.single("image"), UserController.changeProfilePicture)
router.post("/send-reset", UserController.checkResetPasswordData)
router.patch("/reset-password", UserController.resetPassword)


module.exports = router