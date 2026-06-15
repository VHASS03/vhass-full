import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const register = TryCatch(async (req, res) => {
  console.log("Registration request received:", { ...req.body, password: req.body.password ? 'exists' : 'undefined' });
  const { email, name, password } = req.body;

  let user = await User.findOne({ email });
  console.log("User search result:", user ? { ...user.toObject(), password: user.password ? 'exists' : 'undefined' } : 'No user found');

  if (user) {
    console.log("User already exists");
    return res.status(400).json({
      message: "User Already exists",
    });
  }

  // Create user directly with User model instead of plain object
  try {
    user = await User.create({
      name,
      email,
      password, // This will be hashed by the pre-save hook
      isVerified: true // Temporarily set to true for testing
    });
    console.log("New user created:", { ...user.toObject(), password: user.password ? 'exists' : 'undefined' });

    const otp = Math.floor(Math.random() * 1000000);
    console.log("Generated OTP:", otp);

    const activationToken = jwt.sign(
      {
        user: {
          name: user.name,
          email: user.email,
          password: user.password,
          _id: user._id
        },
        otp,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );
    console.log("Activation token generated");

    const data = {
      name,
      otp,
    };

    try {
      console.log("Attempting to send email to:", email);
      await sendMail(email, "E learning", data);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        message: "Error sending verification email",
      });
    }

    res.status(200).json({
      message: "Otp send to your mail",
      activationToken,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "Error creating user",
      error: error.message
    });
  }
});

export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  const verify = jwt.verify(activationToken, process.env.JWT_SECRET);

  if (!verify)
    return res.status(400).json({
      message: "Otp Expired",
    });

  if (verify.otp !== otp)
    return res.status(400).json({
      message: "Wrong Otp",
    });

  // await User.create({
  //   name: verify.user.name,
  //   email: verify.user.email,
  //   password: verify.user.password,
  // });
  await User.findOneAndUpdate(
    { email: verify.user.email }, // Find by unique field (e.g., email)
    {
      $set: {
        name: verify.user.name,
        password: verify.user.password
        // Add other fields as needed
      }
    },
    {
      upsert: true,      // Create if not found
      new: true,         // Return the updated/created document
      runValidators: true // Run schema validators
    }
  );

  res.json({
    message: "User Registered",
  });
});

export const loginUser = TryCatch(async (req, res) => {
  console.log('=== LOGIN ATTEMPT ===');
  console.log('Login request body:', { email: req.body.email, password: req.body.password ? 'exists' : 'undefined' });
  console.log('Login request headers:', req.headers);
  console.log('Login request cookies:', req.cookies);
  console.log('Login request session:', req.session);
  
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Login failed: Missing credentials');
    return res.status(400).json({
      message: "Please enter email and password",
      code: "MISSING_CREDENTIALS"
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      code: "USER_NOT_FOUND"
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
      code: "INVALID_CREDENTIALS"
    });
  }

  console.log('Login successful, generating token...');
  
  // Generate JWT token
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Set user in session for backward compatibility
  req.session.user = {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  };

  console.log('Token generated and session set');

  // Save session explicitly
  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).json({
        success: false,
        message: 'Session error',
        code: 'SESSION_ERROR'
      });
    }

    console.log('Session saved successfully');
    
    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.name}`,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token: token // ✅ Return JWT token
    });
  });
});

export const myProfile = TryCatch(async (req, res) => {
  console.log('Session:', req.session);
  console.log('Session user:', req.session && req.session.user);
  console.log('Passport user:', req.user);
  const user = await User.findById(req.user._id);

  res.json({ user });
});

export const updateProfile = TryCatch(async (req, res) => {
  const { name, phone } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  // Update user fields
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    }
  });
});

export const googleLogin = TryCatch(async (req, res) => {
  const { name, email, picture, googleId, email_verified } = req.body;

  if (!email || !googleId) {
    return res.status(400).json({
      success: false,
      message: "Email and Google ID are required"
    });
  }

  try {
    // Check if user already exists (include password to validate presence)
    let user = await User.findOne({ email }).select('+password');

    if (user) {
      // User exists, update Google ID if not set
      let shouldSave = false;
      if (!user.googleId) {
        user.googleId = googleId;
        user.isGoogleUser = true;
        shouldSave = true;
      }
      // Some legacy users may not have a password stored; ensure it exists to satisfy schema
      if (!user.password) {
        const fallbackPassword = Math.random().toString(36).slice(-12) + Date.now().toString(36);
        user.password = fallbackPassword;
        shouldSave = true;
      }
      if (shouldSave) {
        await user.save();
      }
    } else {
      // Create new user
      // NOTE: Password is required by the schema; generate a random one for Google users.
      // It will be hashed by the pre-save hook.
      const randomPassword = Math.random().toString(36).slice(-12) + Date.now().toString(36);
      user = await User.create({
        name,
        email,
        googleId,
        password: randomPassword,
        isGoogleUser: true,
        isVerified: email_verified || true, // Google accounts are pre-verified
        avatar: picture
      });
    }

    // Set user in session
    req.session.user = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    // Ensure session is saved so cookie is sent before responding
    return req.session.save((err) => {
      if (err) {
        console.error('Session save error (Google login):', err);
        return res.status(500).json({
          success: false,
          message: 'Session error',
          code: 'SESSION_ERROR'
        });
      }

      return res.status(200).json({
        success: true,
        message: `Welcome ${user.name}`,
        user: req.session.user
      });
    });

  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({
      success: false,
      message: "Error during Google login",
      error: error.message
    });
  }
});

export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({
      message: "No User with this email",
    });

  const token = jwt.sign({ email }, process.env.JWT_SECRET);

  const data = { email, token };

  await sendForgotMail("E learning", data);

  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

  await user.save();

  res.json({
    message: "Reset Password Link is send to you mail",
  });
});

export const resetPassword = TryCatch(async (req, res) => {
  const decodedData = jwt.verify(req.query.token, process.env.JWT_SECRET);

  const user = await User.findOne({ email: decodedData.email });

  if (!user)
    return res.status(404).json({
      message: "No user with this email",
    });

  if (user.resetPasswordExpire === null)
    return res.status(400).json({
      message: "Token Expired",
    });

  if (user.resetPasswordExpire < Date.now()) {
    return res.status(400).json({
      message: "Token Expired",
    });
  }

  // const password = await bcrypt.hash(req.body.password, 10);
  const password = req.body.password;
  
  user.password = password;

  user.resetPasswordExpire = null;

  await user.save();

  res.json({ message: "Password Reset" });
});

export const logoutUser = TryCatch(async (req, res) => {
  // Clear the authentication cookie
  res.clearCookie('token', {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    secure: true,
    sameSite: 'none'
  });

  // Clear session if it exists
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });
  }

  res.status(200).json({
    message: "Logged out successfully"
  });
});
