import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from './DB/dbConnect.js';
import Authroutes from './Routes/Authroutes.js';
import messageRoutes from './Routes/messageRoutes.js';
import userroutes from './Routes/userroutes.js';
import { setupSocket } from './Socket/socket.js'; // ⬅️ import setupSocket

dotenv.config();

const app = express();
const server = http.createServer(app); // ⬅️ create server from app

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

// Routes
app.use('/auth', Authroutes);
app.use('/message', messageRoutes);
app.use('/user', userroutes);

// Start server
server.listen(process.env.PORT || 5050, () => {
  dbConnect();
  setupSocket(server); // ⬅️ initialize socket
  console.log(`🚀 Server running at ${process.env.PORT}`);
});
