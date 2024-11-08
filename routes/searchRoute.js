const router = require("express").Router();
const {
  search,
  searchValue,
  searchCategory,
  searchPostByUserId,
  searchUser,
  searchFollowing,
} = require("../controllers/searchController");

router.post("/", search);
router.post("/val", searchValue);
router.post("/category", searchCategory);
router.post("/user", searchPostByUserId);
router.post("/following", searchUser);
router.post("/following-list", searchFollowing);

module.exports = router;
