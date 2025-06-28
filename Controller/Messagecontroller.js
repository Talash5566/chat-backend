import Conversation from "../Models/conversationschema.js";
import Message from '../Models/messageSchema.js';
import { getReciverSocketId, io } from '../Socket/socket.js';

import User from '../Models/userschema.js';
export const messagesender = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: reciverId } = req.params;
        const senderId = req.user.id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, reciverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, reciverId],
            });
        }

        const newMessage = new Message({
            senderId,
            reciverId,
            message,
            conversationId: conversation._id,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
            await Promise.all([conversation.save(), newMessage.save()]);
        }

        const receiverSocketId = getReciverSocketId(reciverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage);
    } catch (error) {
        console.error("Error in sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getmessge = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { id: reciverId } = req.params;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, reciverId] }
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        res.status(200).json(conversation.messages);
    } catch (error) {
        console.error("Error in getting messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const startConversation = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Cannot start a conversation with yourself" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
      const receiverSocketId = getReciverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newConversation", {
          from: senderId,
        });
      }
    }

    
    const receiverUser = await User.findById(receiverId).select('-password -email');

    if (!receiverUser) {
      return res.status(404).json({ message: 'User not found' });

    }

    
    const result = {
      _id: conversation._id,
      ...receiverUser.toObject(),
      createdAt: receiverUser.createdAt,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in startConversation:', error);
    
  }
};
