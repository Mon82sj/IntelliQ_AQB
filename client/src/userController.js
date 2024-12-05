/*const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('./User');

// Send OTP via email
/*exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  // Store OTP in memory (or use Redis for better scaling)
  req.app.locals.otp = otp;

  // Setup nodemailer
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:'sujamoni824@gmail.com',
      pass: 'vmsl wwmf ocol mhjd',
    },
  });

  let mailOptions = {
    from: 'sujamoni824@gmail.com',
    to: email,
    subject: 'Your OTP for Registration',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Failed to send OTP.' });
    }
    res.status(200).json({ message: 'OTP sent successfully.' });
  });
};

// Verify OTP
exports.verifyOtp = (req, res) => {
  const { otp } = req.body;
  if (otp === req.app.locals.otp) {
    res.status(200).json({ message: 'OTP verified successfully.' });
  } else {
    res.status(400).json({ message: 'Invalid or expired OTP.' });
  }
};

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
      user: 'sujamoni824@gmail.com',
      pass: 'vmsl wwmf ocol mhjd',
    },
  });

  let mailOptions = {
    from: 'sujamoni824@gmail.com',
    to: email,
    subject: 'Your OTP for Registrationmnbvgh',
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

// Refined Verify OTP
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

  if (otp === storedOtp) {
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

// Login user
exports.loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
  if (!user) return res.status(400).json({ message: 'User not found.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid password.' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token, message: 'Logged in successfully.' });
};

// Send generated report
exports.sendReport = (req, res) => {
  const { email, reportContent } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sujamoni824@gmail.com',
      pass: 'vmsl wwmf ocol mhjd',
    },
  });

  let mailOptions = {
    from: 'sujamoni824@gmail.com',
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
*/
