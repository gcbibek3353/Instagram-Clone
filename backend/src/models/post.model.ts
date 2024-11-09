import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default : ''
    },
    images: [{
        type: String,
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comments'
        }
    ]
}, {
    timestamps: true
})

export const PostModel = mongoose.model('Post', postSchema);