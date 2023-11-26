const connect = require('./DBConnection'); // Adjust the path as needed

const BioSchema = {
  id: { type: 'string', required: true, unique: true },
  description: { type: 'string', required: true },
  profilepic: { type: 'string', required: false }, 
  user_id: { type: 'string', required: true },
};

class Bio {
  constructor(id, description, profilepic, user_id) {
    this.id = id;
    this.description = description;
    this.profilepic = profilepic;
    this.user_id = user_id;
  }

  static async create(bio) {
    const query = `INSERT INTO bio (id, description, profilepic, user_id) VALUES (?, ?, ?, ?)`;
    const values = [bio.id, bio.description, bio.profilepic, bio.user_id];

    try {
      await connect.connection.query(query, values);
      console.log('Bio created successfully', bio);
    } catch (err) {
      console.error('Error creating bio:', err);
    }
  }

  static findByUserId(user_id) {
    return new Promise((resolve, reject) => {
      if (!user_id) {
        reject('<h1>user id error </h1>');
      }
  
      connect.connection.query('SELECT * FROM bio WHERE user_id = ?', [user_id], (err, results) => {
        if (err) {
          console.error('Error finding bio:', err);
          reject(null);
        } else {
          if (results.length > 0) {
            resolve(
              new Bio(
                results[0].id,
                results[0].description,
                results[0].profilepic,
                results[0].user_id
              )
            );
          } else {
            resolve(null);
          }
        }
      });
    });
  }
  static async update(description, profilepic, user_id) {
    let query;
    let values;
  
    if (profilepic) {
      query = 'UPDATE bio SET description = ?, profilepic = ? WHERE user_id = ?';
      values = [description, profilepic, user_id];
    } else {
      query = 'UPDATE bio SET description = ? WHERE user_id = ?';
      values = [description, user_id];
    }
  
    try {
      await connect.connection.query(query, values);
      console.log('Bio updated successfully');
    } catch (err) {
      console.error('Error updating bio:', err);
      throw err;
    }
  }


  static async deleteDescriptionByUserId(user_id) {
    try {
      await connect.connection.query('UPDATE bio SET description = NULL WHERE user_id = ?', [user_id]);
    } catch (err) {
      console.error('Error deleting description from bio:', err);
      throw err;
    }
  }
  
  static async deleteProfilePicByUserId(user_id) {
    try {
      await connect.connection.query('UPDATE bio SET profilepic = null WHERE user_id = ?', [user_id]);
    } catch (err) {
      console.error('Error deleting profile picture:', err);
      throw err;
    }
  }

}





module.exports = {Bio};