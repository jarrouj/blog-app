const connect = require('./DBConnection'); // Import your database connection module

class ImageModel {
  static addImage(image, user_id) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO images (image, user_id) VALUES (?, ?)';
      connect.connection.query(query, [image, user_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = ImageModel;