import mongoose from "mongoose";

const userschema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    profilepic: {
        type: String,
        default: ""
    }
}, { timestamps: true }); 

const User = mongoose.model('User', userschema);

export default User;
