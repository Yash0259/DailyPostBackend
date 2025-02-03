const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware")
const {
    createPost,
    getAllPosts,
    updatePost,
    deletePost,
  } = require("../controllers/postController");


  router.post("/posts", upload.single("image"), createPost); // Use multer to handle image

  router.get("/posts", getAllPosts);
  router.put("/posts/:id", upload.single("image"), updatePost); // Use multer for update as well
  router.delete("/posts/:id", deletePost);
  
// router.post("/posts",upload.single("image"),createPost);

module.exports = router