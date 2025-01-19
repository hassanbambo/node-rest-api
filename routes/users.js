const express = require('express');
const router = express.Router(); // Create a router instance 
const User = require('../models/User'); // Import the User model
const authenticationToken = require('../middleware/auth');

// const users = [];

// Get All Users / Protected by the authenticationToken
router.get('/', authenticationToken, async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get a single user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Create a new user
router.post('/', async (req, res) => {
    const user = new User(req.body); // Use the body directly
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// Update an existing User
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).send('User not found');

        // Update the User fields
        user.name = req.body.name;
        user.email = req.body.email;
        user.age = req.body.age;

        const updateUser = await user.save();
        res.json(updateUser);
    } catch (error) {
        if( error.name === ValidationError) {
            const errors = Object.values(error.errors).map((e) => e.message);
            res.status(400).json({ errors });
        }
        res.status(500).json({ message: error.message })
    }
})

// Delete a user 
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).send('User not found');
        await user.deleteOne();
        res.send('User Deleted ');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;