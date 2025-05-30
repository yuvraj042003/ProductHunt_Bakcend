const express = require("express");
const router = express.Router();
const { userRegister, userLogin, updateProfile, getUserProfile, userLogout } = require("../controller/userController");
const auth = require("../middleware/authentication");
const  upload = require('../utils/upload');

// Add Middeware for authentication or authorization if needed

router.post("/register", upload.single('profilePicture'), userRegister);
router.post("/login", userLogin);
router.post("/logout", auth, userLogout);
router.get("/profile", auth, getUserProfile);
router.patch("/update-profile", auth, updateProfile);

module.exports = router;
