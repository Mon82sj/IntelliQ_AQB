// userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('./User');
//		router.delete('/users/:id', deleteUser);

// Send OTP via email
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  // Store OTP and expiry in memory (you could use Redis for better scaling)
  req.app.locals.otp = otp;
  req.app.locals.otpExpiry = otpExpiry;

  // Setup nodemailer
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP for Registration',
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP:', error); // Log the error
      return res.status(500).json({ message: 'Failed to send OTP.' });
    }
    console.log('OTP sent:', info.response); // Log the response
    res.status(200).json({ message: 'OTP sent successfully.' });
  });
};

// Verify OTP
exports.verifyOtp = (req, res) => {
  const { otp } = req.body;
  
  // Check if OTP exists and hasn't expired
  const storedOtp = req.app.locals.otp;
  const otpExpiry = req.app.locals.otpExpiry;

  if (!storedOtp || !otpExpiry) {
    return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
  }

  if (Date.now() > otpExpiry) {
    // OTP expired, clear OTP from memory
    req.app.locals.otp = null;
    req.app.locals.otpExpiry = null;
    return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
  }

  if (otp === storedOtp.toString()) {
    // OTP is correct, clear OTP from memory
    req.app.locals.otp = null;
    req.app.locals.otpExpiry = null;
    res.status(200).json({ message: 'OTP verified successfully.' });
  } else {
    res.status(400).json({ message: 'Invalid OTP. Please try again.' });
  }
};

// Register new user
exports.registerUser = async (req, res) => {
  const { email, username, password, userType } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    username,
    password: hashedPassword,
    userType,
  });

  try {
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user.' });
  }
};





// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId); // Adjust according to your DB model
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user.' });
  }
};
exports.getData = async (req, res) => {
  try {
    const users = await User.find();
    const feedback = await Feedback.find();
    res.status(200).json({ users, feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// Delete user or feedback by id
exports.deleteData = async (req, res) => {
  const { id, type } = req.params;
  try {
    if (type === 'user') {
      await User.findByIdAndDelete(id);
    } else if (type === 'feedback') {
      await Feedback.findByIdAndDelete(id);
    }
    res.status(200).json({ message: `${type} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete data' });
  }
};



// userController.js
exports.loginUser = async (req, res) => {
  console.log('Login attempt received with data:', req.body); // Log incoming request

  const { emailOrUsername, password, userType } = req.body;

  // Check if all fields are provided
  if (!emailOrUsername || !password || !userType) {
    console.log('Missing required fields:', req.body); // Log the missing data
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    userType,
  });

  if (!user) {
    console.log('User not found or user type mismatch:', req.body); // Log failure
    return res.status(400).json({ message: 'User not found or user type mismatch.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log('Invalid password attempt for user:', emailOrUsername); // Log failure
    return res.status(400).json({ message: 'Invalid password.' });
  }

  const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('User logged in successfully:', emailOrUsername); // Log success
  res.status(200).json({ token, username: user.username, userType: user.userType, message: 'Logged in successfully.' });
};





// Send generated report
exports.sendReport = (req, res) => {
  const { email, reportContent } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your Report',
    text: reportContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Failed to send report.' });
    }
    res.status(200).json({ message: 'Report sent successfully.' });
  });
};

