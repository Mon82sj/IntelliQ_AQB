const express = require('express');
const router = express.Router();
const User = require('./User'); // Assuming User is a mongoose model
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Nodemailer configuration using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email service
  auth: {
    user: 'sujamoni824@gmail.com',
    pass: 'vmsl wwmf ocol mhjd',
  },
});

// POST route for sending OTP
/*router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: 'sujamoni824@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    };

    // Save OTP and its expiry to the database
    const newUser = new User({
      email,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
    });

    await newUser.save();
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});



// POST route for verifying OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Incorrect OTP' });
    }

    // If OTP is correct, mark user as verified (remove OTP fields)
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'OTP verified successfully. You can now complete registration.' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});
*/
// POST route for registration
router.post('/register', async (req, res) => {
  const { email, username, password, userType } = req.body;

  if (!email || !username || !password || !userType) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found. Please verify OTP first.' });
    }

    // Complete registration by updating user info
    user.username = username;
    user.password = password; // Assuming password will be hashed in pre-save hook
    user.userType = userType;

    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// POST route for login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password (assuming a method to compare hashed passwords exists)
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, username: user.username, userType: user.userType },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;

