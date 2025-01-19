const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = '123456'; // Secret Key

// Register a new User 
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exist
    try {
        const existing = await User.findOne({email});
        if (existing) return res.status(400).json({message: 'User Already Exist'});

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json( {message: 'User Successfully Registered'} );
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Login a User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the User exist 
        const existing = await User.findOne({ email });
        if(!existing) return res.status(400).json({message: 'User does not exist - Need to sign Up'});

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, existing.password);
        if(!isMatch) res.status(400).json({message: 'Password is Incorrect'});

        // Generate a JSON we b token
        const token = jwt.sign({ id: User._id }, JWT_SECRET, { expiresIn: '1hr' });

        res.json({ token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;