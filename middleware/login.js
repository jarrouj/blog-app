const connect = require("../model/DBConnection");


const checkLogin = (req, res, next) => {
    connect.connection.query(
      'SELECT * FROM user WHERE email = ? AND password = ?',
      [req.body.email, req.body.password],
      (error, results) => {
        if (error) {
          console.error('Error checking login status:', error);
          res.status(500).send('Internal Server Error');
        } else {
          const user = results[0];
          if (user) {
            // User is logged in, proceed to the next middleware or route
            next();
          } else {
            // User is not logged in, display an alert and stay on the same page
            res.send('<script>alert("Wrong credentials. Please try again."); window.history.back();</script>');
          }
        }
      }
    );
  };

  module.exports = checkLogin;
