
const Image = require('../../model/images')

const AddPost = async (req, res) => {
    try {
      const buffer = req.file.filename;
      const email = req.session.email;
      const user_id = req.session.userId;
      const password = req.session.password;    
      console.log(buffer);
      console.log(user_id);
  
      if (!buffer || !user_id) {
        return res.status(400).json({ error: 'Both image and user_id are required.' });
      }
  
      await Image.addImage(buffer, user_id);
  
      res.redirect(`/profile?email=${email}&password=${password}`);
    } catch (error) {
      console.error('Error adding post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports = {
 AddPost: AddPost,
   
};