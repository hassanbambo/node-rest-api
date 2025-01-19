const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required!'], 
        minlength: [3, 'Name must be atleast 3 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        trim: true,
        validate: {
            validator: function (value) {
                return !/\d/.test(value);
            },
            message: 'Name cannot contain a number'
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [
            /^\S+@\S+\.\S+$/,
            'Please Provide a valid email address'
        ],
    },
    password: {
        type: String, 
        required: true,
        minlength: 6,
    },
    age: {
        type: Number,
        min: [18, 'Minors are not allowed'],
        max: [100, 'Go back, Oldie'],
        validate: {
            validator: function(value) {
                return value % 2 === 0;
            }, 
            message: 'Only Even numbers are allowed!',
        },
    },
    phone: {
        type: String,
        validate: {
            validator: function(value) {
                return /^\d{10}$/.test(value);
            },
            message: 'Phone Number must be exactly 10 digits',
        }
    }, 
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the current date as the default
    }
})

// HAsh the password before saving
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return save();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;