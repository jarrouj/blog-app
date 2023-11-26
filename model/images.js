const connect = require('./DBConnection'); // Import your database connection module

class Image {
  constructor(id, image, user_id) {
    this.id = id;
    this.image = image;
    this.user_id = user_id;
  }

  static create(imageData) {
    const query = 'INSERT INTO images (image, user_id) VALUES (?, ?)';
    const values = [imageData.image, imageData.user_id];

    return connect.connection.query(query, values);
  }
}

module.exports = Image;