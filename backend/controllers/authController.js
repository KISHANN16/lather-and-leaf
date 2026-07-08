import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { fallbackDB } from '../config/fallbackDb.js';

const generateToken = (id) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'latherleafsecretkey12345';
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const userExists = fallbackDB.users.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const adminEmail = 'rekhavishwakarma400212@gmail.com';
      const role = email.toLowerCase() === adminEmail.toLowerCase() ? 'admin' : 'user';

      const user = fallbackDB.users.create({
        name,
        email,
        password,
        role,
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const adminEmail = 'rekhavishwakarma400212@gmail.com';
    const role = email.toLowerCase() === adminEmail.toLowerCase() ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const user = fallbackDB.users.findOne({ email });

      if (user && bcrypt.compareSync(password, user.password)) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address,
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const user = fallbackDB.users.findById(req.user._id);

      if (user) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address,
        });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile / address
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const updatedUser = fallbackDB.users.update(req.user._id, {
        name: req.body.name,
        password: req.body.password,
        address: req.body.address,
      });

      if (updatedUser) {
        return res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          address: updatedUser.address,
          token: generateToken(updatedUser._id),
        });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      if (req.body.address) {
        user.address = {
          fullName: req.body.address.fullName || user.address?.fullName,
          address1: req.body.address.address1 || user.address?.address1,
          address2: req.body.address.address2 || user.address?.address2,
          street: req.body.address.street || user.address?.street,
          city: req.body.address.city || user.address?.city,
          state: req.body.address.state || user.address?.state,
          pincode: req.body.address.pincode || user.address?.pincode,
          phone: req.body.address.phone || user.address?.phone,
        };
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request password reset code
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide an email address' });
  }

  // Generate a random 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const user = fallbackDB.users.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      fallbackDB.users.update(user._id, {
        resetPasswordCode: code,
        resetPasswordExpire: expire.toISOString(),
      });

      console.log('\n==================================================');
      console.log(`[EMAIL SIMULATION] Forgot Password Verification Code`);
      console.log(`To: ${email}`);
      console.log(`Code: ${code}`);
      console.log('==================================================\n');

      return res.json({ message: 'Verification code sent successfully (simulated)' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.resetPasswordCode = code;
    user.resetPasswordExpire = expire;
    await user.save();

    console.log('\n==================================================');
    console.log(`[EMAIL SIMULATION] Forgot Password Verification Code`);
    console.log(`To: ${email}`);
    console.log(`Code: ${code}`);
    console.log('==================================================\n');

    res.json({ message: 'Verification code sent successfully (simulated)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password using verification code
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, code, password } = req.body;

  if (!email || !code || !password) {
    return res.status(400).json({ message: 'Please provide email, code, and new password' });
  }

  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const user = fallbackDB.users.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (
        user.resetPasswordCode !== code ||
        !user.resetPasswordExpire ||
        new Date(user.resetPasswordExpire).getTime() < Date.now()
      ) {
        return res.status(400).json({ message: 'Invalid or expired verification code' });
      }

      fallbackDB.users.update(user._id, {
        password: password,
        resetPasswordCode: null,
        resetPasswordExpire: null,
      });

      return res.json({ message: 'Password reset successful' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (
      user.resetPasswordCode !== code ||
      !user.resetPasswordExpire ||
      user.resetPasswordExpire.getTime() < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    user.password = password;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword };
