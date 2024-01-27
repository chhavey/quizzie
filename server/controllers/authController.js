const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const handleResponse = require('../middlewares/responseHandler');
const errorHandler = require('../middlewares/errorHandler');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Checking if required fields are present
        if (!name || !email || !password) {
            return handleResponse(res, 400, 'All fields are required.');
        }

        // Checking if the user with the given email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return handleResponse(res, 400, 'User with this email already exists.');
        }

        //Hash password
        const encodedPassword = await bcrypt.hash(password, 10)

        // Creating new user
        const newUser = new User({ name, email, password: encodedPassword });
        await newUser.save();

        // Success response
        return handleResponse(res, 201, 'User registered successfully.', { loggedUser: name });
    } catch (error) {
        errorHandler(res, error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Checking if email and password are provided
        if (!email || !password) {
            return handleResponse(res, 400, 'Email and password are required.');
        }

        // Checking if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return handleResponse(res, 401, 'Invalid credentials.');
        }

        // Checking if the password matches
        let isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return handleResponse(res, 401, 'Invalid credentials.');
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        // Sending token as a response
        return handleResponse(res, 200, "You've logged in successfully", { loggedUser: user.name, token });

    } catch (error) {
        errorHandler(res, error);
    }
};

module.exports = { register, login };
