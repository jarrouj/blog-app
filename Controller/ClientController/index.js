const express = require('express');
const path = require('path');
const app = express();
const connect=require('../../model/DBConnection')
const {User} = require('../../model/User')



const ViewsPath = path.join(__dirname, '../../views');
app.use(express.static(ViewsPath));




//profile page
const profile = async (req, res) => {
      res.sendFile(path.join(ViewsPath, 'Client', 'profile.html'));
  };
  

//edit bio page

const bioEdit= (req, res) => {
    res.sendFile(path.join(ViewsPath, 'Client', 'bio-edit.html'));
};


//get logged user name

const logged_name=(req, res) => {
    const pass = req.query.password;
  
    // Fetch the user's name from the database
    connect.connection.query(
        'SELECT name FROM user WHERE password = ?',
        [pass],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.json(result);
  
            }
        }
    );
  };

  const show_bio=(req,res)=>{
    const userId=req.session.userId;

    connect.connection.query(
        'SELECT * FROM user WHERE user_id = ?',
        [userId],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.json(result);
  
            }
        }
    );
  }



  module.exports = {
    bioEdit: bioEdit,
    loggedName: logged_name,
    profile : profile,
    show_bio : show_bio,
   
};
