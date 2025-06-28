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

app.use(cors({
  origin: 'http://localhost:5173',
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
