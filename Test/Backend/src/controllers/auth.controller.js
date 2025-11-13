const { runCpp } = require('../utils/runCpp');
const { createToken } = require('../helper/tokenHelper');

// Simple in-memory user validation for token generation
// In a real app, the C++ would return the user ID or data to be put in the token
const fakeUserDB = {};

const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).send({ error: 'All fields are required' });
    }

    // Args: email, password, name
    const output = await runCpp('register_user', [email, password, name]);

    // C++ script prints the new user's email on success
    if (output.includes(email)) {
      fakeUserDB[email] = { email, name }; // Store for login
      res.status(201).send({ message: 'User registered successfully', email: output });
    } else {
      throw new Error(output || 'Failed to register user');
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required' });
    }

    // Args: email, password
    const output = await runCpp('login_user', [email, password]);

    // C++ script prints "Login Success: <email>"
    if (output.startsWith('Login Success')) {
      // We need user data for the token.
      // The C++ script should return user data, but for simplicity, we use the fake DB
      const userEmail = output.split(': ')[1];
      const userData = fakeUserDB[userEmail] || { email: userEmail, name: "User" }; 

      const token = createToken(userData);
      res.status(200).send({ message: 'Login successful', token, user: userData });
    } else {
      throw new Error(output || 'Invalid credentials');
    }
  } catch (error) {
    next(new Error(error.message || 'Login failed'));
  }
};

module.exports = { registerUser, loginUser };