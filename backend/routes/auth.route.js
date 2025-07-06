// // routes/user.js
// const express = require('express');
// const router = express.Router();
// // const { getUserProfile } = require('../controllers/user');
// const verifyToken = require('../middlewares/auth');

// // Fix: Proper named parameter
// router.get('/:userId', verifyToken, getUserProfile); // Changed from potentially '/:'

// module.exports = router;