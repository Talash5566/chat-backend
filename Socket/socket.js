import { Server } from 'socket.io';

const userSocketMap = {}; // { userId: socketId }

export const getReciverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        'https://chat-frontend-pied-eight.vercel.app',
        'http://localhost:5173'
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== 'undefined') {
      userSocketMap[userId] = socket.id;
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    }

    socket.on('disconnect', () => {
      if (userId && userId !== 'undefined') {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
      }
    });
  });

  return io;
};
