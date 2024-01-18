const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/userModel');
const errorHandler = require('../middlewares/errorHandler');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Checking if required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'All fields are required.'
            });
        }

        // Checking if the user with the given email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'User with this email already exists.'
            });
        }

        //Hash password
        const encodedPassword = await bcrypt.hash(password, 10)

        // Creating new user
        const newUser = new User({ name, email, password: encodedPassword });
        await newUser.save();

        // Success response
        return res.status(201).json({
            status: 'SUCCESS',
            message: 'User registered successfully.',
            loggedUser: name
        });
    } catch (error) {
        errorHandler(res, error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Checking if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Email and password are required.'
            });
        }

        // Checking if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: 'FAILED',
                message: 'Invalid credentials.'
            });
        }

        // Checking if the password matches
        let isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 'FAILED',
                message: 'Invalid credentials.'
            });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Sending token as a response
        return res.status(200).json({
            status: 'SUCCESS',
            message: "You've logged in successfully",
            loggedUser: user.name,
            token: token,
        });
    } catch (error) {
        errorHandler(res, error);
    }
});

module.exports = router;
