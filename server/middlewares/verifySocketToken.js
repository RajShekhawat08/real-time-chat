const jwt = require('jsonwebtoken');


const verifySocketToken = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token; // client sends in { auth: { token } }

    if (!token) {
      return next(new Error("Unauthorized: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach user info to socket object
    socket.user = decoded;
    next();

  } catch (error) {
    next(new Error("Unauthorized: Invalid or expired token"));
  }
};

module.exports = verifySocketToken;