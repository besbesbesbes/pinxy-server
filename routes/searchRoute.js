const router = require("express").Router();
const { authenticate } = require("../middlewares/authenticate");
const {
  search,
  searchValue,
  searchCategory,
  searchPostByUserId,
  searchUser,
  searchFollowing,
} = require("../controllers/searchController");

router.post("/", authenticate, search);
router.post("/val", authenticate, searchValue);
router.post("/category", authenticate, searchCategory);
router.post("/user", authenticate, searchPostByUserId);
router.post("/following", authenticate, searchUser);
router.post("/following-list", authenticate, searchFollowing);

module.exports = router;
