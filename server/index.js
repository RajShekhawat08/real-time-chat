const express = require('express');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const socketEventHandlers  = require('./socketEvents');

require('dotenv').config();  // load environment variables from .env

const db = require('./config/db-config');
// Set port to listen for requests: 
const PORT = process.env.PORT || 8080;
// Import route handlers 
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
// Global error handlers
const {postgresErrorHandler, globalErrorHandler} = require('./middlewares/errorHandler');

// --------- Main ----------------------------------------------

const app = express();

// Create HTTP server (wrap express in it)
const httpServer = createServer(app);

// Attach Socket.IO to server
const io = new Server(httpServer, {
    cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});
httpServer.listen(PORT);

// Socket error handler --------------------------
io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});


const corsOptions = {
  origin : 'http://localhost:5173',
  credentials: true    
};
app.use(cors(corsOptions)); // Cross Origin Resource Sharing: Allows all origins 

// Setting up middlewares to parse request body and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());


// Socket events----------------------------

socketEventHandlers(io);



// Routes---------------------------------------------------------------

app.get('/', (req, res) => {
  res.send('Real time chat App in Making!')
});

//  authentication routes
app.use("/api/auth", authRoutes);

// user routes
app.use("/api/users", userRoutes);


// Global error handlers--------------
app.use(postgresErrorHandler);
app.use(globalErrorHandler);



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

