const express = require('express');
const path = require('path');
const app = express();
var connect=require('../../model/DBConnection')

//Views Folder
const ViewsPath = path.join(__dirname, '../../views');
app.use(express.static(ViewsPath));


const signup = (req, res) => {
    const name = req.body.name; 
    const email = req.body.email;
    const password = req.body.password;

    // DB insert
    connect.connection.query(
        "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect(`/signin?email=${email}&password=${password}`);
                
            }
        }
    );
};

module.exports = signup;
