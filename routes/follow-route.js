const router = require("express").Router();
const { follow, unfollow } = require("../controllers/follow-controller");
const { authenticate } = require('../middlewares/authenticate')

router.post("/", authenticate, follow);
router.post("/unfollow", authenticate, unfollow);

module.exports = router;
