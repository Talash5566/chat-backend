// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';

import dbConnect from './DB/dbConnect.js';
import Authroutes from './Routes/Authroutes.js';
import messageRoutes from './Routes/messageRoutes.js';
import userroutes from './Routes/userroutes.js';
import { setupSocket } from './Socket/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup CORS
const allowedOrigins = [
  'https://chat-frontend-pied-eight.vercel.app',
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use('/auth', Authroutes);
app.use('/message', messageRoutes);
app.use('/user', userroutes);

// Setup socket
setupSocket(server);

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  dbConnect();
  console.log(`🚀 Server running on port ${PORT}`);
});
