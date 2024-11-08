const router = require("express").Router();
const { follow, unfollow } = require("../controllers/follow-controller");

router.post("/", follow);
router.post("/unfollow", unfollow);

module.exports = router;
