const express = require('express');
const { getUsers, deleteUser } = require('./userController'); // Make sure the path and function names are correct
const { sendOtp, verifyOtp, registerUser, loginUser, sendReport } = require('./userController');
const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-report', sendReport);

module.exports = router;



