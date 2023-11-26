
const express = require('express');
const path = require('path');
const app = express();
const {User} = require('../../model/User');
// var connect = require('../../model/DBConnection');

// Views Folder
const ViewsPath = path.join(__dirname, '../../views');
app.use(express.static(ViewsPath));

const signup = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        // Check if the user with the given email already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).send('Email already in use');
        }

        // Create a new user using the User model
        const newUser = new User(null, name, email, password);
        await User.create(newUser);

        // Redirect or send a success response
        res.redirect(`/profile?email=${(email)}&password=${(password)}`);
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = signup;
