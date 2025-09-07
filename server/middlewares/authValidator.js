const {body} = require('express-validator');


exports.registerValidator = [
    body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a vaild email!')
    .normalizeEmail(),

    body('password')
    .trim()
    .isLength({min: 8})
    .withMessage('Password must be at least 8 characters!'),

    body('username')
    .trim()
    .notEmpty()
    .withMessage('username cannot be empty!')
]


exports.loginValidator = [

    body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a vaild email!'),

    body('password')
    .trim()
    .isLength({min: 8})
    .withMessage('Password must be at least 8 characters!')
    
]