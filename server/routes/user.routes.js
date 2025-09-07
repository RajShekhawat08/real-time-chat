const express = require('express')
const router = express.Router();

const verifyAccessToken = require('../middlewares/verifyToken');
const {userInfo, loadConversations, searchUsers} = require('../controllers/user.controller');


// Get all conversations route
router.get("/:id/conversations", verifyAccessToken, loadConversations);


// Search user route
router.get("/search", verifyAccessToken, searchUsers);

// get user details route
router.get("/me", verifyAccessToken, userInfo);



module.exports = router;