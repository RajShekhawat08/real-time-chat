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

// find related users
async function getRelatedUsers(userId) {

    const result = await pool.query(
      `SELECT cp2.user_id AS related_user
      FROM conversations c
      JOIN conversation_participants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = $1
      JOIN conversation_participants cp2 on c.id = cp2.conversation_id AND cp2.user_id <> $1`, 
      [userId]
    );
    return result?.rows;
}

//update last seen status 
async function updateLastSeen(last_seen, userId) {
    await pool.query(
      `UPDATE users SET last_seen = $1 WHERE id = $2`, 
      [last_seen, userId]
    );
}

module.exports = {createUser, findUserByEmail, findUserByUsername, findUsers, getRelatedUsers, updateLastSeen};