const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const PORT = process.env.PORT;
const mongoDBUri = process.env.db_url;

app.use(express.json()); // Middleware to Parse JSON requests 

mongoose.connect(mongoDBUri, {})
.then(() => console.log('Successfully Connected to Database'))
.catch((err) => console.error('Problem with Establishing Connection', err)); 


// ROUTES 

// Uses the router for all routes starting with /users
app.use('/users', usersRouter); // Protected Routes
app.use('/auth', authRouter); // Public Router for Authentication 

// Middleware for error handling 
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!')
// })

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`);
})