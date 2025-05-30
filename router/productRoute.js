const express = require("express");
const router = express.Router();

const auth = require("../middleware/authentication");
const { createProduct, getProducts, getSingleProduct, upVote, downVote, deleteProduct, editProduct } = require("../controller/productController");
const upload = require('../utils/upload');
// Add Middeware for authentication or authorization if needed

router.post("/create-product", auth, upload.single('logo'), createProduct);
router.get("/products", getProducts);
router.get("/:id", getSingleProduct);
router.post("/:id/upvote", auth, upVote);
router.post("/:id/downvote", auth, downVote);
router.patch("/:id/edit-product", auth, editProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
