## Real time chat with socket.io
A full-stack real-time chat app built with Socket.io Express.js, PostgreSQL, React.js, and Vite. It has JWT based authentication with refresh-tokens, one-to-one private chat, real-time updates like: online/last-seen status, typing indicators.



## Project structure
```
server/
├───config/    #DB connection config
├───controllers/    # route handler functions
├───middlewares/    #middlewares: verify token, validate auth, global error handler 
├───Models/  # model functions to interact with DB
├───routes/  # Auth routes, user routes
└───scripts/  # Database schema and initialization script
```

```
frontend/
├── src/
│   ├── components/   # Reusable UI components: Sidebar, Chatwindow etc.
│   ├── context/      # Auth state manag. via React Context API
│   ├── hooks/        # Custom hooks: usePresence, useChat, useFetchUser etc.
│   ├── pages/        # Pages
│   ├── services/     # API calls to backend and socket connection setup
│   ├── App.jsx       # Root component
│   └── main.jsx      # Frontend entry point
├── index.html
├── tailwind.config.js
├── vite.config.js
├── package.json

```

## Installation guide

Clone the Repository
``` 
git clone https://github.com/RajShekhawat08/real-time-chat.git
cd real-time-chat
```


### Database Setup (PostgreSQL)
Ensure PostgreSQL is installed and running.

Configure your .env with connection information. The init_db.sh sources .env, which should contain:

```
DB_HOST=127.0.0.1
DB_PORT=5432
DB_PASSWORD=password
```
Run the initialisation script:

```
cd backend/scripts
chmod +x init_db.sh
./init_db.sh
```

Apply the schema:
```
psql -h localhost -p 5432 -U app_user -d realtimechat_db -f schema.sql
```

#### Backend Setup
```
cd server
npm install
```


### PostgreSQL
PGHOST=your-db-host
PGPORT=5432
PGUSER=auth_app_user
PGPASSWORD=your-password
PGDATABASE=auth_db

Run the backend:
npm start

#### Frontend 
```
cd ../frontend
npm install
```

Run the frontend:
```
npm run dev
```

The frontend will start at http://localhost:5173.



## Tech-stack
#### Backend:
    - Auth: jsonwebtoken, bcryptjs
    - App: Node.js, Express, Socket.io, pg
    - DB: PostgreSQL

#### Frontend: 
    - React + Vite, TailwindCSS, Daisy-ui
    - Axios, socket.io-client

## Future improvements
- 

