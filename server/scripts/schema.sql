
-- CREATE TABLE users(
--     id SERIAL PRIMARY KEY, 
--     username TEXT NOT NULL UNIQUE, 
--     first_name TEXT,
--     last_name TEXT,
--     email TEXT NOT NULL UNIQUE, 
--     pass_hash TEXT NOT NULL, 
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
-- );

-- CREATE TABLE messages(

--     id SERIAL PRIMARY KEY, 
--     sender_id INT REFERENCES users(id), 
--     message_type VARCHAR(30) DEFAULT 'text',
--     message_text TEXT, 
--     is_read BOOLEAN DEFAULT FAlSE, 
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE

-- );

-- CREATE TABLE conversations (
--     id SERIAL PRIMARY KEY,
--     is_group BOOLEAN DEFAULT FALSE,
--     name VARCHAR(100), -- Optional: for group chats
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE conversation_participants (
--     id SERIAL PRIMARY KEY,
--     conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
--     user_id INT REFERENCES users(id) ON DELETE CASCADE,
--     joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- ); 


-- --  GRANT ALL ON ALL TABLES IN SCHEMA public TO app_user;


-- -- Alter table messages: add conversation id;
-- -- ALTER TABLE messages
-- -- ADD COLUMN conversation_id INT NOT NULL REFERENCES conversations(id);


-- --  Create Indexing for messages: 
-- CREATE INDEX idx_convers_id ON messages(conversation_id, created_at);


-- SELECT  c.id AS conversation_id, 
--         cp2.user_id AS other_user,
--         u.username AS other_username, 
--         m.message_text AS last_message,
--         m.created_at AS created_at
-- FROM conversations c 
-- JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = 1
-- JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id <> 1
-- JOIN users u ON u.id = cp2.user_id
-- LEFT JOIN LATERAL (
--     SELECT m.id, m.message_text, m.created_at
--     FROM messages m
--     WHERE m.conversation_id = c.id
--     ORDER BY m.created_at DESC
--     LIMIT 1
-- ) m ON TRUE
-- WHERE c.is_group = FAlSE;