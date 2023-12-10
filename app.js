const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
// const connect=require('./model/DBConnection')
const multer = require('multer'); // For handling file uploads
const session = require('express-session');
const connect = require('./model/DBConnection')


app.use(
  session({
    secret: 'jorj',
    resave: false,
    saveUninitialized: true,
  })
);




//path to the public folder to store the images
const storage2 = multer.diskStorage({
  destination: 'public/images',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload2 = multer({ storage: storage2 });


// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//sign up and sign in controllers
const signup=require('./Controller/AuthController/signup');
const signin =require('./Controller/AuthController/signin');

//client controllers
const ClientController=require('./Controller/ClientController/index');

//post controllers
const PostController = require('./Controller/PostController/index');


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

// {{ Middleware }}
const requireLogin = require("./middleware/login");


// {{ Authentication }}
app.post('/signup', signup);
app.post('/signin', requireLogin,signin);


                            // {{ Client Controller }}

//profile route
app.get('/profile', ClientController.profile);

//show the looged in name in the public.html (username of the user)
app.get('/api/getUserName', ClientController.loggedName);

//Bio CRUD
app.get('/bio-edit', ClientController.bioEdit);//open edit page
app.get('/showBio', ClientController.show_bio);//show bio and image in public.html and in bio-edit.html
app.post('/update-bio', upload2.single('profilePicture'), ClientController.updateBio);//configure the update query for the bio and image
app.get('/delete-bio', ClientController.deleteBio); //remove bio
app.get('/delete-profilepic',ClientController.delete_image);//remove profile picture
app.get('/delete-account', ClientController.deleteAccount);//delete user


                              //{{ Post Controller}}

//Posts Apis
app.post('/add-post', upload2.single('postImage'),PostController.AddPost);// Add post api
app.get('/show-images', PostController.ShowPost);   // get all Posts api
app.get('/delete-post/:id', PostController.deletePost);  // delete a specific post api

