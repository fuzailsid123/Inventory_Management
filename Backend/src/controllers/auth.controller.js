const { runCpp } = require('../utils/runCpp');
const { createToken } = require('../helper/tokenHelper');

const fakeUserDB = {};

const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).send({ error: 'All fields are required' });
    }

    const output = await runCpp('register_user', [email, password, name]);

    if (output.includes(email)) {
      fakeUserDB[email] = { email, name };
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

    if (output.startsWith('Login Success')) {
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