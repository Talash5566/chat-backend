import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from './DB/dbConnect.js';
import Authroutes from './Routes/Authroutes.js';
import messageRoutes from './Routes/messageRoutes.js';
import userroutes from './Routes/userroutes.js';
import { app, server } from './Socket/socket.js';



dotenv.config();

const PORT = process.env.PORT;

const allowedOrigins = [
  'http://localhost:5173',
  'https://chat-frontend-pied-eight.vercel.app'
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




server.listen(PORT, () => {
  dbConnect();
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
