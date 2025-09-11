const pool = require("../config/db-config");

// Create new convers. b/w two users and returns conversation id
async function createConversation(sender_id, receiver_id) {
    const result = await pool.query(
        `INSERT INTO conversations (is_group) VALUES (false) RETURNING *`
    );

    let conversation_id = result.rows[0].id;

    await pool.query(
        `INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES ($1, $2), ($1, $3)`,
        [conversation_id, sender_id, receiver_id]
    );

    return conversation_id;
}

// Is conversation : checks if a conversation already exists b/w sender & receiver
async function isConversation(sender_id, receiver_id) {
    const result = await pool.query(
        `SELECT c.id
        FROM conversations c
        JOIN conversation_participants cp1 
        ON cp1.conversation_id = c.id AND cp1.user_id = $1
        JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = $2
        WHERE c.is_group = false`, 
        [sender_id, receiver_id]
    );

    const conversation_id = result.rows[0]?.id ;
    return conversation_id;
}


// Get conversation history func.  todo: add pagination support
async function getConversationHistory(conversation_id) {
    const result = await pool.query(
        `SELECT * FROM messages WHERE conversation_id = $1
        ORDER BY created_at ASC
        LIMIT 50
        `,
        [conversation_id]
    );

    return result?.rows;
}

// Get all user convers. -> with their latest message

async function getAllConversations(user_id) {
    
    const result = await pool.query(
        `SELECT c.id AS conversation_id,
                cp2.user_id AS receiver_id,
                u.username AS receiver_username,
                u.last_seen AS last_seen,
                m.id AS message_id,
                m.message_text AS last_message,
                m.created_at AS created_at
        FROM conversations c
        JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = $1
        JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id <> $1
        JOIN users u ON u.id = cp2.user_id 
        LEFT JOIN LATERAL (
            SELECT m.message_text, m.created_at, m.id
            FROM  messages m 
            WHERE m.conversation_id = c.id
            ORDER BY m.created_at DESC
            LIMIT 1
        ) m ON TRUE
        WHERE c.is_group = FALSE
        ORDER BY m.created_at DESC NULLS LAST;
        `, 
        [user_id]
    );

    return result?.rows;
}

module.exports = { getConversationHistory, createConversation, isConversation, getAllConversations};
