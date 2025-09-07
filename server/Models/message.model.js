const pool = require('../config/db-config');


// Save message to db func.
async function saveMessage(message, sender_id, conversation_id) {

    const result = await pool.query(
        `INSERT INTO messages (message_text, sender_id, conversation_id)
        VALUES ($1, $2, $3)
        RETURNING *`, 
        [message, sender_id, conversation_id]
    )

    return result.rows[0];
}



// Update message read status




module.exports = {saveMessage}