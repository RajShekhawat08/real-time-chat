const express = require('express');
const router = express.Router();

const {checkDuplicateEmailOrUsername, handleValidation } = require('../middlewares/verifySignUp');
const {registerValidator, loginValidator} = require('../middlewares/authValidator');
const {register, login, logout, refresh} = require('../controllers/auth.controller');


// Register route:
router.post("/register", 
    [registerValidator, handleValidation, checkDuplicateEmailOrUsername], 
    register
);

// Login route:
router.post("/login", [loginValidator, handleValidation], login);


// Logout route:
router.post("/logout",  logout);


// refreshtoken route: 
router.post("/refresh", refresh);



module.exports = router;