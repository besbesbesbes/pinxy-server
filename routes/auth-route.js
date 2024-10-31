const express = require("express")
const router = express.Router()
const authController = require("../controllers/Auth-controller")

router.post("/auth/register", authController.register)
router.post("/auth/login", authController.register)

router.post("/auth/register",)