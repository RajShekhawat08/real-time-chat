const { findUserByUsername, findUsers } = require("../Models/user.model");
const {getAllConversations} = require("../Models/conversation.model");

const userInfo = async (req, res, next) => {
    const username = req.user.username;
    try {
        const user = await findUserByUsername(username);

        return res.status(201).json({ User: user });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const loadConversations = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        const allConversations = await getAllConversations(user_id);

        return res.status(201).json({allConversations});

    } catch (error) {
        console.error(error);
        next(error);
    }
};


const searchUsers  = async (req, res, next) => {

    try {
        const {username} = req.query;
        const users = await findUsers(username);

        return res.status(201).json({users});

    } catch (error) {
        console.error(error);
        next(error);
    }

}

module.exports = { userInfo, loadConversations, searchUsers };
