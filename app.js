const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const connect=require('./model/DBConnection')
const multer = require('multer'); // For handling file uploads
const session = require('express-session');
const {User} = require('./model/User')
const {Bio} = require('./model/Bio')


app.use(
  session({
    secret: 'jorj',
    resave: false,
    saveUninitialized: true,
  })
);



// const isAuthenticated = async (req, res, next) => {
//   try {
//     const userEmail = req.query.email; // Assuming the email is in the query parameters
//     const user = await User.findByEmail(userEmail);

//     if (user) {
//       // User is authenticated, proceed to the next middleware or route handler
//       next();
//     }
//   } catch (error) {
//     console.error('Authentication error:', error);
//     res.status(500).send('Internal server error');
//   }
// };


const storage2 = multer.diskStorage({
  destination: 'public/images',
  filename: function (req, file, cb) {
    // Use the original name of the file
    cb(null, file.originalname);
  },
});
const upload2 = multer({ storage: storage2 });


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
app.post('/signin',signin);
app.get('/bio-edit', ClientController.bioEdit);
app.get('/show_bio',ClientController.show_bio)

// Example profile route
app.get('/profile', ClientController.profile);


app.get('/api/getUserName', ClientController.loggedName);





app.post('/update-bio', upload2.single('profilePicture'), async (req, res) => {
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
});

app.get('/showBio', (req, res) => {
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
});
