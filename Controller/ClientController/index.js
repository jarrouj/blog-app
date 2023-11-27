const express = require('express');
const path = require('path');
const app = express();
const connect=require('../../model/DBConnection')
const {User} = require('../../model/User');
const {Bio}=require('../../model/Bio')
const session = require('express-session');


app.use(
  session({
    secret: 'jorj',
    resave: false,
    saveUninitialized: true,
  })
);



const ViewsPath = path.join(__dirname, '../../views');
app.use(express.static(ViewsPath));




//profile page
const profile = async (req, res) => {
  const email= req.query.email;
  const password=req.query.password;
  connect.connection.query(
    "SELECT id FROM user WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        res.send("<h1>Internal Server Error</h1>");
      } else {
        req.session.email = email;
        req.session.password = password;


        const userId = results[0].id;
        req.session.userId = userId;

       
      
      }
    }
  );  

      res.sendFile(path.join(ViewsPath, 'Client', 'profile.html'));
  };
  

//edit bio page

const bioEdit= (req, res) => {
    res.sendFile(path.join(ViewsPath, 'Client', 'bio-edit.html'));
};

// Update bio
const updateBio=async (req, res) => {
  const email = req.session.email;
  const userId = req.session.userId;
  const password = req.session.password;
  const description = req.body.bio;
  const profilePic = req.file ? req.file.filename : null;

  try {
    // Check if bio exists for the user
    const existingBio = await Bio.findByUserId(userId);
console.log(existingBio);
    if (existingBio) {
      // Bio exists, update it
      await Bio.update(description, profilePic, userId);

    } else {
      // Bio does not exist, create a new one
      const newBio = new Bio(null, description, profilePic, userId);
      await Bio.create(newBio);
    }

    res.redirect(`/profile?email=${email}&password=${password}`);
  } catch (error) {
    console.error('Update bio error:', error);
    res.status(500).send('Internal server error');
  }
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

  const show_bio=(req, res) => {
    const userId = req.session.userId;
  
    connect.connection.query(
      'SELECT * FROM bio,user WHERE bio.user_id = user.id AND bio.user_id = ?',
      [userId],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          if (results.length > 0) {
            // Set session variables
            req.session.description = results[0].description;
            req.session.profilePic = results[0].profilepic;
  
            // Send the bio data as JSON
            res.json({ description: req.session.description, profilePic: req.session.profilePic });
          } else {
            res.status(404).json({ error: 'Bio not found' });
          }
        }
      }
    );
  };


  const deleteBio =  async (req, res) => {

    const email = req.session.email;
    const userId = req.session.userId;
    const password = req.session.password;  
  
    try {
      // Check if bio exists for the user
      const existingBio = await Bio.deleteDescriptionByUserId(userId);
  
      if (existingBio) {
        // Bio exists, delete it
        await Bio.deleteByUserId(userId);
  
        // Redirect to a success page or back to the profile
      res.redirect(`/profile?email=${email}&password=${password}`);
      } else {
        // Bio does not exist, redirect or handle accordingly
        res.redirect(`/profile?email=${email}&password=${password}`);
      }
    } catch (error) {
      console.error('Delete bio error:', error);
      res.status(500).send('Internal server error');
    }
  };

  const delete_image =  async (req, res) => {
    const email = req.session.email;
    const userId = req.session.userId;
    const password = req.session.password;    
    try {
      // Delete the profile picture for the user
      await Bio.deleteProfilePicByUserId(userId);
  
      // Redirect to a success page or back to the profile
      res.redirect(`/profile?email=${email}&password=${password}`);
    } catch (error) {
      console.error('Delete profile picture from bio error:', error);
      res.status(500).send('Internal server error');
    }
  };


  const deleteAccount = async (req, res) => {
    const userId = req.session.userId;
  
    try {
      // Delete the user account
      await User.deleteById(userId);
  
      // Redirect to a success page or wherever appropriate
      res.redirect('/');
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).send('Internal server error');
    }
  };

  module.exports = {
    bioEdit: bioEdit,
    loggedName: logged_name,
    profile : profile,
    show_bio : show_bio,
    updateBio : updateBio,
    deleteBio : deleteBio,
    delete_image:delete_image,
    deleteAccount : deleteAccount,
   
};
