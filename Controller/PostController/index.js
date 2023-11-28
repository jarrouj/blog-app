
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

  const ShowPost = async (req, res) => {
    try {
  
      const userId = req.session.userId;
      const images = await Image.getImagesByUserId(userId);
  
      res.json({ images });
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const deletePost = (req, res) => {
    const id = req.params.id; 
  
    // Execute the delete query
    connect.connection.query('DELETE FROM images WHERE id = ?', [id], (error, result) => {
      if (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      // Check if any rows were affected
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Assuming you have the user's email and password in the session
      const email = req.session.email;
      const password = req.session.password;
  
      // Redirect to the user's profile page
      res.redirect(`/profile?email=${email}&password=${password}`);
    });
  };


  module.exports = {
 AddPost: AddPost,
 ShowPost : ShowPost,
 deletePost : deletePost,
   
};