const express = require("express");
const {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
} = require("../controllers/blogs");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");
const upload = require("../middleware/multer");

router.route("/").get(getAllBlogs);
router.route("/:id").get(getBlog);

router.route("/my-blog/:id").get(getUserBlogs);
router.use(authMiddleware);
router.post("/create", upload.single("image"), createBlog);
router.route("/:id").patch(upload.single("image"), updateBlog);
//  .delete(deleteBlog);
router.route("/delete/:id").delete(deleteBlog);

module.exports = router;
