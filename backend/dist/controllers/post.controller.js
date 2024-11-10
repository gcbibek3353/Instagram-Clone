import { PostModel } from "../models/post.model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { UserModel } from "../models/user.model.js";
import { CommentModel } from "../models/comment.model.js";
export const addPost = async (req, res) => {
    try {
        const authorId = req.id;
        const { caption } = req.body;
        console.log(caption);
        const images = req.files;
        if (!caption && !images)
            return res.status(401).json({
                message: "Provide image or caption to upload",
                success: false
            });
        const imageURLS = [];
        for (const image of images) {
            const optimizedImageBuffer = await sharp(image.buffer)
                .resize({ width: 800, height: 800, fit: 'inside' })
                .toFormat('jpeg', { quality: 80 })
                .toBuffer();
            const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            imageURLS.push(cloudResponse.secure_url);
        }
        const newPost = await PostModel.create({
            caption,
            images: imageURLS,
            author: authorId,
        });
        const user = await UserModel.findById(authorId);
        if (user) {
            user.posts.push(newPost._id);
            await user.save();
        }
        await newPost.populate({ path: "author", select: "-password" });
        return res.status(201).json({
            message: "Post created successfully",
            success: true,
            post: newPost
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to Add Post",
            error: error.message,
            success: false
        });
    }
};
// correction required
export const getAllPost = async (req, res) => {
    // console.log('controller here');
    const posts = await PostModel.find().sort({ createdAt: -1 }).populate({ path: "author", select: "userName profilePic_Url" });
    res.json(posts);
    // try {
    //     const posts = await PostModel.find().sort({ createdAt: -1 }).populate({ path: "author", select: "userName profilePic_Url" })
    //         .populate({
    //             path: "comments",
    //             // options: { sort: { createdAt: -1 } },
    //             //  sort: { createdAt: -1 } ,
    //             populate: { path: "author", select: "userName profilePic_Url" }
    //         })
    //     return res.status(201).json({
    //         message: "All posts fetched and populated successfully",
    //         success: true,
    //         posts
    //     })
    // } catch (error: any) {
    //     console.log(error.message);
    //     return res.status(401).json({
    //         message: "Unable to Get all the Posts",
    //         error: error.message,
    //         success: false
    //     })
    // }
};
export const getUserPost = async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await PostModel.find({ author: id }).sort({ createdAt: -1 }).populate({ path: 'author', select: "userName profilePic_Url" })
            .populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: { path: 'author', select: "userName profilePic_Url" }
        });
        return res.status(201).json({
            message: "successfully got all the posts of given user",
            success: true,
            posts
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to get Posts of given user",
            error: error.message,
            success: false
        });
    }
};
export const likePost = async (req, res) => {
    // This is a bad method because single user can like same post multiple times
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await PostModel.findById(postId);
        if (!post)
            return res.status(401).json({
                message: "The post you are trying to like doesn't exists",
                success: false
            });
        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();
        // implement socket.io for real-time notification
        return res.status(201).json({
            message: "Post liked successfully",
            success: true,
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to Like the post",
            error: error.message,
            success: false
        });
    }
};
export const disLikePost = async (req, res) => {
    //  Bad approach because any person can dislike any post even if s/he hadn't liked it
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await PostModel.findById(postId);
        if (!post)
            return res.status(401).json({
                message: "The post you are trying to like doesn't exists",
                success: false
            });
        await post.updateOne({ $pull: { likes: userId } });
        await post.save();
        // implement socket.io for real-time notification
        return res.status(201).json({
            message: "Post disLiked successfully",
            success: true,
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to Like the post",
            error: error.message,
            success: false
        });
    }
};
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.id;
        const postId = req.params.id;
        if (!text || text == '')
            return res.status(401).json({
                message: "Comment cannot be empty",
                success: false
            });
        const post = await PostModel.findById(postId);
        if (!post)
            return res.status(401).json({
                success: false,
                message: "Post you are trying to comment not found"
            });
        const comment = await CommentModel.create({
            text,
            author: userId,
            post: postId
        });
        await comment.populate({
            path: 'author',
            select: "userName profilePic_Url"
        });
        post.comments.push(comment._id);
        await post.save();
        return res.status(201).json({
            message: "comment added successfully",
            comment,
            success: true
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to comment to the post",
            error: error.message,
            success: false
        });
    }
};
export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await CommentModel.find({ post: postId }).populate('author', 'username profilePicture');
        if (!comments)
            return res.status(404).json({ message: 'No comments found for this post', success: false });
        return res.status(200).json({ success: true, comments });
    }
    catch (error) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to Get all the comments",
            error: error.message,
            success: false
        });
    }
};
export const deletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.id;
    const post = await PostModel.findById(postId);
    if (!post)
        return res.status(201).json({
            message: "Post you are trying to delete is not found",
            success: false,
        });
    if (post.author.toString() !== userId)
        return res.status(201).json({
            message: "You cannot delete other User's post",
            success: false,
        });
    await PostModel.findOneAndDelete({ _id: postId });
    const user = await UserModel.findById(userId);
    if (!user)
        return;
    user.posts = user.posts.filter(post => post.toString() != postId);
    await user.save();
    await CommentModel.deleteMany({ post: postId });
    return res.status(201).json({
        success: true,
        message: 'Post deleted'
    });
};
export const bookMarkPost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await PostModel.findById(postId);
        if (!post)
            return res.status(404).json({ message: 'Post which you want to bookmark doesnt exists', success: false });
        const user = await UserModel.findById(userId);
        if (!user)
            return;
        // user?.bookmarks.push(postId);
        if (user?.bookmarks.includes(postId)) {
            //logic to unbookmark
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(201).json({ type: 'unsaved', message: 'Post removed from bookmark', success: true, action: 'unbookmark' });
        }
        else {
            //logic to bookmark
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(201).json({ type: 'saved', message: 'Post bookmarked', success: true, action: 'bookmark' });
        }
    }
    catch (error) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to bookmark the Posts",
            error: error.message,
            success: false
        });
    }
};
