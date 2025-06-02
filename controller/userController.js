const User = require('../model/User');
const jwt = require('jsonwebtoken');
const streamUpload = require('../utils/profilePic')


const userRegister = async (req, res) => {
    const { name, email, password  } = req.body;
    const file = req.file;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        let profilePicture = 'https://i.stack.imgur.com/l60Hf.png';
        if (file) {
            profilePicture = await streamUpload(file.buffer, 'profile-pictures');
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const user = await User.create({ name, email, password, profilePicture });
        const token = user.createJWT();
        res.status(201).json({ user: 
            { 
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
            , token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Login function
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    try {
        const user = await User.findOne({ email });
        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        } 
        const token = user.createJWT();
        res.status(200).json({ user: 
            { 
                name: user.name,
                email: user.email
            }, token });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    const userId = req.user.userId; 
    try {
        const user = await User.findById(userId).select('-password -__v'); 
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
  const { name, profilePicture } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
const userLogout = async (req, res) => {
    try {
        // Clear the cookie named 'token' or whatever you use
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Server error during logout' });
    }
};

module.exports = {
    userRegister,
    userLogin,
    getUserProfile,
    updateProfile,
    userLogout
};