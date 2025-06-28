import mongoose from "mongoose";


const messageschema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    message: {
        type: String,
        required: true
      },
    conversationId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        default:[]
    }
}, { timestamps: true })

const message =  mongoose.model("Message" , messageschema);

export default message ;