const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');  // Assuming User model is already defined
const router = express.Router();

// Route for user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Step 1: Validate that both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Step 2: Check if the user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 3: Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Step 4: Send success response (you can send a token here for a real-world app)
    res.status(200).json({ message: 'Login successful', user: { username: user.username, email: user.email } });
    
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
