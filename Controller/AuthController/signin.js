const express = require('express');
const path = require('path');
const app = express();
var connect=require('../../model/DBConnection')
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));


//Views Folder
const ViewsPath = path.join(__dirname, '../../views');
app.use(express.static(ViewsPath));

const signin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    connect.connection.query(
      "SELECT id FROM user WHERE email = ? AND password = ?",
      [email, password],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          res.send("<h1>Internal Server Error</h1>");
        } else {
          console.log("Query result:", result);
  
          // Set user ID in the session, regardless of the query result
          req.session.userId = result.id;
          console.log("session",req.session.userId);
  
          res.sendFile(path.join(ViewsPath, 'Client', 'profile.html'));
        }
      }
    );
  };
  
  
  
module.exports = signin ;