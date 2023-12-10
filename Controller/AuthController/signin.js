const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
var connect = require('../../model/DBConnection');




// Views Folder
const ViewsPath = path.join(__dirname, '../../views');
app.use(express.static(ViewsPath));

const signin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  connect.connection.query(
    "SELECT id FROM user WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        res.send("<h1>Internal Server Error</h1>");
      } else {
        req.session.email = email;

        const userId = results[0].id;
        req.session.userId = userId;
        req.session.password=password;

        res.redirect(`/profile?email=${(email)}&password=${(password)}`);
      
      }
    }
  );
};

module.exports = signin;
