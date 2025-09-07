const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {createUser, findUserByEmail} = require('../Models/user.model');


// Register route controller function-----------------------
const register = async (req, res, next) => {

    try {

        // Get request body 
        let {username, email, password} = req.body;

        // salt and hash password
        const salt = await bcrypt.genSalt();
        const hassed_pass = await bcrypt.hash(password,salt);
        

        // create a new user in DB
        const user = await createUser({
            username: username,
            email: email,
            pass_hash: hassed_pass});

        // console.log(user);

        // generate access and refresh tokens;
        const tokens = generateTokens(user);

        res.cookie("refreshtoken", tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'None', 
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        // send access token
        return res
        .status(201)
        .json({
            "New user created": user, 
            "accessToken" : tokens.accessToken
        });

        
    } catch (error) {
        console.error(error.message);
        next(error);
        
    }

}

// Login route controller function-----------------------------------------------------------

const login = async (req, res, next) => {

    try {

        //take credentails from req body
        const {email, password} = req.body;

        //Check if the user exists in DB 
        const user = await findUserByEmail({email: email});
        if(!user){
            return res.status(404).json({"message": "user doesn't exist!"})
        }

        //Check password 
        const passwordMatch = await bcrypt.compare(password, user.pass_hash);
        if(!passwordMatch){
            return res.status(400).json({"message": "Invalid credentials"})
        }

        // generate access and refresh tokens;
        const tokens = generateTokens(user);


        // Assigning refresh token in http-only cookie 
        res.cookie('refreshtoken', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'None', 
            secure: false,     // todo: Should be set true in production (when sending https req.) 
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        // return access token
        return res.status(201).json({accesstoken: tokens.accessToken, message: "Login successful"});


    } catch (error) {
        console.error(error.message);
        next(error);
        
    }

}


// Logout route--------------------------------------------------------------
const logout = async (req, res, next) => {

    try {
    // revoke refresh token:
    res.clearCookie("refreshtoken", {path: '/'});
    return res.status(201).json({message: "refresh token cleared"});

    
    } catch (error) {
        console.error(error.message);
        next(error);
    }
}

// Refresh route to renew tokens --------------------------------------------------

const refresh = async (req, res, next) => {
    try {
        // if token exists in header 
        if (req.cookies?.refreshtoken) {

            const refreshToken = req.cookies.refreshtoken;

            // verify the refresh token and renew if valid
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {

                if(err){
                    // Wrong Refesh Token
                     res.status(406).json({ message: 'Invalid refresh token!' });
                }
                else{
                    const newTokens = generateTokens(decoded);
            
                    // reset new refresh token 
                    res.cookie('refreshtoken', newTokens.refreshToken, {
                        httpOnly: true,
                        sameSite: 'None', 
                        secure: false,
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    });
                    // return access token
                    return res.status(201).json({accesstoken: newTokens.accessToken, message: "Token renewed!"});

                }

            })
         
        } else {
            return res.status(401).json({ message: "Unauthorized, no token provided" });
        }

        
    } catch (error) {
        console.error(error.message);
        next(error);
    }
}



// Returns access and refresh tokens
const generateTokens = (user) => {

        //Generate access token
        const accessToken = jwt.sign(
            {userId: user.id, 
            username: user.username
            }, 
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '15m'}
        )   

        // refresh token for longer session
        const refreshToken = jwt.sign(
            {userId: user.id, 
            username: user.username
            }, 
            process.env.REFRESH_TOKEN_SECRET, 
            {expiresIn: '1w'}
        )

    return {accessToken, refreshToken};

};


module.exports = {register, login, logout, refresh};