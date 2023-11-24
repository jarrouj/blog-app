const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const connect=require('./model/DBConnection')
const multer = require('multer'); // For handling file uploads



const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page or handle accordingly
    res.redirect('/login');
  }
};


// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//sign up and sign in controllers
const signup=require('./Controller/AuthController/signup');
const signin = require('./Controller/AuthController/signin');

//client controllers
const ClientController=require('./Controller/ClientController/index');



//Public Folder Path
app.use(express.json());

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Use bodyParser middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Views Folder Path
const ViewsPath = path.join(__dirname, 'views');
app.use(express.static(ViewsPath));

//Port
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Auth page
app.get('/', (req, res) => {
  res.sendFile(path.join(ViewsPath, 'Auth', 'auth.html'));
});



app.post('/signup', signup);
app.get('/signin',isAuthenticated,signin);
app.get('/bio-edit', ClientController.bioEdit);


app.get('/api/getUserName', ClientController.loggedName);




// Route to display the form with the current user's data
app.get('/edit-bio', (req, res) => {
  const userId = req.session.userId || req.query.userId;

  if (!userId) {
    return res.status(400).send('User ID not provided');
  }

  const query = `
    SELECT u.name, b.description, b.profilepic
    FROM user u
    LEFT JOIN bio b ON u.id = b.userid
    WHERE u.id = ?
  `;

  connect.connection.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('User not found');
    }

    const userData = result[0];
    res.sendFile(path.join(__dirname, 'public', 'bio-edit.html'));
  });
});

// Route to handle the form submission for updating the bio
app.post('/update-bio', upload.single('profilePicture'), (req, res) => {
  const userId = req.session.userId || req.body.userId;

  if (!userId) {
    return res.status(400).send('User ID not provided');
  }

  const { bio } = req.body;

  const updateBioQuery = `
    INSERT INTO bio (userid, description, profilepic)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE description = VALUES(description), profilepic = VALUES(profilepic)
  `;

  connect.connection.query(updateBioQuery, [userId, bio, req.file.buffer], (err) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }

    res.redirect('/profile');
  });
});

