const router = require("express").Router();
const {
    follow,
    unfollow,
    getUserInfo,
} = require("../controllers/follow-controller");

router.post("/", follow);
router.post("/unfollow", unfollow);
router.post("/userinfo", getUserInfo);

module.exports = router;
