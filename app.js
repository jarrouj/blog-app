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


//Authentication
app.post('/signup', signup);
app.post('/signin',signin);


app.get('/bio-edit', ClientController.bioEdit);//open edit page
app.get('/showBio', ClientController.show_bio);//show bio and image in public.html and in bio-edit.html
app.post('/update-bio', upload2.single('profilePicture'), ClientController.updateBio);//configure the update query for the bio and image
app.get('/delete-bio', ClientController.deleteBio); //remove bio
app.get('/delete-profilepic',ClientController.delete_image);//remove profile picture
app.get('/delete-account', ClientController.deleteAccount);//delete user



//profile route
app.get('/profile', ClientController.profile);

//show the looged in name in the public.html (username of the user)
app.get('/api/getUserName', ClientController.loggedName);



const Image = require('./model/images'); // Import the Image model

app.post('/add-post', upload2.single('postImage'), async (req, res) => {
  try {
    const user_id = req.session.userId; // Get the user ID from the session
    const image = req.file.buffer; // Get the image data from the request
    const email = req.body.email;
    const password = req.body.password;

    // Create a new Image object
    const newImage = new Image(null, image, user_id);

    // Save the image to the database
    await Image.create({ image: newImage.image, user_id: newImage.user_id });


    // Redirect or send a success response
    res.redirect(`/profile?email=${email}&password=${password}`);
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).send('Internal server error');
  }
});