require("dotenv").config();

const { Router } = require("express");
const express = require("express");

const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { sendPasswordReportEmail } = require("../sendPassword");
const SuperAdmin = require("../models/SuperAdmin");
const SUPERADMINA_JWT_SECRET = "superadmin123456@admin123456";

// One time setup to store and create user in Database
// http://localhost:5000/api/auth/setup
router.post("/setup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the admin already exists
    const existingAdmin = await SuperAdmin.findOne({
      $or: [{ username }, { email }],
    });
    if (existingAdmin) {
      return res
        .status(400)
        .json({
          message: "Admin with the same username or email already exists",
        });
    }

    // Hash the plain password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin with the hashed password
    const newAdmin = new SuperAdmin({
      username,
      email,
      password: hashedPassword,
    });

    // Save the admin to the database
    await newAdmin.save();

    return res.status(201).json({ message: "Admin setup successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// login Admin
// http://localhost:5000/api/auth/login
router.post(
  "/login",
  [
    body("username", "Enter a valid username").exists(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;

    try {
      // Retrieve the hashed password for the admin based on username
      const admin = await SuperAdmin.findOne({ username });

      if (!admin) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      // Compare the entered plain password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (passwordMatch) {
        const token = jwt.sign(
          { username: admin.username, role: "superAdmin" },
          SUPERADMINA_JWT_SECRET
        );

        return res
          .status(200)
          .json({ message: "Authentication successful", token });
      } else {
        // Passwords don't match, authentication failed
        return res.status(401).json({ message: "Authentication failed" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

//  Route to change the password
// http://localhost:5000/api/auth/changePassword
router.post(
  "/changePassword",
  [
    body("username", "Enter a valid username").exists(),
    body("currentPassword", "Current password cannot be blank").exists(),
    body(
      "newPassword",
      "New password must be at least 6 characters long"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, currentPassword, newPassword } = req.body;

    try {
      // Find the user based on username in any of the three collections
      const admin = await SuperAdmin.findOne({ username });

      if (!admin) {
        return res.status(404).json({ message: "User not found" });
      }

      let user;
      if (admin) {
        user = admin;
      }

      // Compare the current password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (passwordMatch) {
        // Hash the new password using bcryptjs
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedNewPassword;
        await user.save();

        return res
          .status(200)
          .json({ message: "Password updated successfully" });
      } else {
        // Current password does not match, authentication failed
        return res.status(401).json({ message: "Authentication failed" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route to Forgot Password
// http://localhost:5000/api/auth/forgotPassword
router.post(
  "/forgotPassword",
  [body("username", "Enter a valid username").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username } = req.body;

    const generateUniqueToken = () => {
      return uuidv4();
    };

    try {
      // Retrieve the admin based on username
      const admin = await SuperAdmin.findOne({ username });

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Generate a unique token for password reset (you can use a library like `uuid`)
      const resetToken = generateUniqueToken(); // Implement this function

      // Store the reset token and its expiration date in the database
      admin.resetToken = resetToken;
      admin.resetTokenExpires = Date.now() + 900000; // Token expires in 1 hour
      await admin.save();

      // Send a password reset email to the user
      sendPasswordReportEmail(admin.email, resetToken); // Implement this function
      return res
        .status(200)
        .json({ message: "Password reset email sent successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route to Reset Password
// http://localhost:5000/api/auth/resetPassword/:resetToken
router.post(
  "/resetReport/:resetToken",
  [
    body(
      "newPassword",
      "New password must be at least 6 characters long"
    ).isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { newPassword } = req.body;
    const { resetToken } = req.params;

    try {
      // Find the admin by the reset token and ensure it has not expired
      const admin = await SuperAdmin.findOne({
        resetToken,
        resetTokenExpires: { $gt: Date.now() },
      });

      if (!admin) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset token" });
      }

      // Hash the new password using bcryptjs
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the admin's password and clear the reset token
      admin.password = hashedNewPassword;
      admin.resetToken = undefined;
      admin.resetTokenExpires = undefined;
      await admin.save();

      return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;