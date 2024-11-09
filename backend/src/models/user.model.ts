import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    profilePic_Url : {
        type : String,
    },
    bio : {
        type : String
    },
    gender : {
        type : String,
        enum : ['male','female','other'],
        required : true
    },
    followers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User' 
    }],
    following : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User' 
    }],
    posts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    }],
    bookmarks : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    }],
},{
    timestamps : true
})

export const UserModel = mongoose.model('User',userSchema);