const express = require("express");
const router = express.Router();

const auth = require("../middleware/authentication");
const { 
    createComment,
    replyToComment, 
    editComment,
    deleteComment,
    getComments } = require("../controller/commentController");

router.post("/create-comment", auth, createComment);
router.post("/reply-comment/:commentId", auth, replyToComment);
router.get("/get-comment/:productId", getComments);
router.patch("/edit-comment/:commentId", auth, editComment);
router.delete("/delete-comment/:commentId", auth, deleteComment);

module.exports = router;