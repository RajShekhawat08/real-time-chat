const pool = require('../config/db-config');


// Create new user in DB
async function createUser({username, firstname = null, lastname = null, email, pass_hash}) {

    const user = await pool.query(
        `INSERT INTO users (username, first_name, last_name, email, pass_hash)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`, 
      [username, firstname, lastname, email, pass_hash]
    );
    
    return user.rows[0];
       
}

// Find user by email 
async function findUserByEmail({email}){

    const user = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return user.rows[0];

}

// Find user by username
async function findUserByUsername(username){
  
    const user = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    return user.rows[0];
}


// Find users with matching username
async function findUsers(username){

  const users = await pool.query(
    `SELECT id, username
    FROM users WHERE username ILIKE $1`,
    ['%' + username + '%']
  );
  return users?.rows;
}


module.exports = {createUser, findUserByEmail, findUserByUsername, findUsers};