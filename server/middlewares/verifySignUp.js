const {findUserByEmail, findUserByUsername} = require('../Models/user.model');
const {validationResult} = require('express-validator');


// Checks if the given email or username already exist in the database:
const checkDuplicateEmailOrUsername = async (req, res, next) => {

    try {
//      checks if the email already exists 
        let user = await findUserByEmail({email: req.body.email});
        if (user){
            return res.status(400).json({ message: "Failed! Email is already in use!" });
        }
//      checks if the username already exists
        user = await findUserByUsername({username: req.body.username});
        if(user){
            return res.status(400).json({ message: "Failed! Username is already in use!" });
        }
        
        next();

    } catch (error) {
        console.log("errror: ", error.message);
        next(error);
    }
    
}


// To handle express-validation result: 
const handleValidation = async (req, res, next) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
    }

    next();
}


module.exports = {checkDuplicateEmailOrUsername, handleValidation};