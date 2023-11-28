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

  static getImagesByUserId(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM images WHERE user_id = ?';
        connect.connection.query(query, [userId], (error, results) => {
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