const connect=require('./DBConnection')


const UserSchema = {
    id: { type: 'string', required: true, unique: true },
    name: { type: 'string', required: true },
    email: { type: 'string', required: true, unique: true },
    password: { type: 'string', required: true },
};

class User {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static async create(user) {
        const query = `INSERT INTO user (id, name, email, password) VALUES (?, ?, ?, ?)`;
        const values = [user.id, user.name, user.email, user.password];

        try {
            await connect.connection.query(query, values);
            console.log('User created successfully', user);
        } catch (err) {
            console.error('Error creating user:', err);
        }
    }

    static async findByEmail(email) {
        const query = `SELECT * FROM user WHERE email = ?`;
        const values = [email];

        try {
            const results = await connect.connection.query(query, values);
            if (results.length > 0) {
                return new User(results[0].id, results[0].name, results[0].email, results[0].password);
            } else {
                return null;
            }
        } catch (err) {
            console.error('Error finding user:', err);
            return null;
        }
    }


    static async findIdByEmail(email) {
     
    
        try {
            const results = await connect.connection.query(`SELECT id FROM user WHERE email = ?`, [email]);
    
            if (results.length > 0 && results[0].id) {
                return results[0].id;
            } else {
                console.log('User ID not found for email:', email);
                return null;
            }
        } catch (err) {
            console.error('Error finding user ID by email:', err);
            return null;
        }
    }

      
      static async deleteById(user_id) {
        try {
          // Delete the user by user_id
          await connect.connection.query('DELETE FROM user WHERE id = ?', [user_id]);
        } catch (err) {
          console.error('Error deleting user:', err);
          throw err;
        }
      }
}


module.exports = { User };
