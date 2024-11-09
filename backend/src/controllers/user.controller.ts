import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserModel } from "../models/user.model.js";
import { userRegisterSchema } from "../zodtypes/user.type.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose, { ObjectId } from "mongoose";
import { CustomRequest } from "../zodtypes/customRequest.type.js";
import { promise } from "zod";
import { PostModel } from "../models/post.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userName, email, password, gender } = req.body;
        const existingUser = await UserModel.findOne({ email })
        // console.log(existingUser);

        if (existingUser) return res.status(401).json({
            message: "User with this email already exists",
            success: false
        })

        const zodResponse = userRegisterSchema.safeParse(req.body);
        const {success} = zodResponse;
        // console.log(zodResponse);
        
        if (!success) return res.status(401).json({
            message: zodResponse.error.errors,
            success: false
        })

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.create({
            userName,
            email,
            gender,
            password: hashedPassword
        })

        return res.status(201).json({
            message: "User registered successfully",
            success: true
        })
    } catch (error: any) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to register User",
            error: error.message,
            success: false
        })
    }
}

export const login = async (req: Request, res: Response): Promise<Response> => {    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) return res.status(401).json({
            message: "email and password field is mandetory",
            success: false
        })

        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) return res.status(401).json({
            message: "Invalid Credentials",
            success: false
        })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(401).json({
            message: "Either email or Password is Incorrect! Please Check your credentials and try again",
            success: false
        })

        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET as string);

        const populated_posts = await Promise.all(
            existingUser.posts.map(async postId=>{
                const post = await PostModel.findById(postId);
                // if(post?.author.equals(user._id)) return post
                // else return null
                return (post?.author.equals(existingUser._id)) ? post : null
            })
        )

        const new_user = {
            id: existingUser._id,
            userName: existingUser.userName,
            email: existingUser.email,
            profilePic_Url : existingUser.profilePic_Url,
            bio : existingUser.bio,
            gender : existingUser.gender,
            followers : existingUser.followers,
            following : existingUser.following,
            posts : populated_posts,
        }

        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: "user logged in successfully",
            success: true,
            user : new_user
        })

    } catch (error: any) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to Login",
            error: error.message,
            success: false
        })
    }

}

export const isAuthenticated = async (req : Request, res : Response): Promise<Response> =>{
    return res.json({ authenticated: true });
}

export const logout = async (req: CustomRequest, res: Response): Promise<Response> => {

    // This check is useless because /logout is a protected route and whenever this function is invoked middleware will surely add req.id
    const userId = req.id;
    if(!userId) return res.status(401).json({
        message : "User is not logged In",
        success : false
    });

    try {
        return res.cookie('token', '', { maxAge: 0 }).json({
            message: "user logged Out successfully",
            success: true,
        })

    } catch (error: any) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to Logout",
            error: error.message,
            success: false
        })
    }
}

export const getProfile = async (req: Request, res: Response): Promise<Response> => {    
    const { id } = req.params;
    try {
        const user = await UserModel.findOne({ _id: id }).select('-password').populate('posts').populate('bookmarks');

        if (!user) return res.status(401).json({
            message: "User with this Id doesn't exists",
            success: false
        })
        return res.status(201).json({
            message: "User Profile found",
            success: true,
            user
        })

    } catch (error: any) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to get Profile",
            error: error.message,
            success: false
        })
    }
}

export const editProfile = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        const id = req.id;
        const { bio, gender } = req.body;
        const profilePic = req.file;
        let cloudResponse: { secure_url: string } | undefined;

        const user = await UserModel.findById(id).select('-password')
        if (!user) return res.status(401).json({
            success: false
        })
        if (bio) user.bio = bio
        if (gender) user.gender = gender
        if (profilePic) {
            const fileUri = getDataUri(profilePic);
            if (!fileUri) {
                throw new Error('File URI is undefined');
            }
            cloudResponse = await cloudinary.uploader.upload(fileUri);
            user.profilePic_Url = cloudResponse.secure_url;
        }

        await user.save();

        return res.status(201).json({
            message: "user Updated successfully",
            success: true,
            user
        })

    } catch (error: any) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to edit user Profile",
            error: error.message,
            success: false
        })
    }
}

export const getSuggestedUser = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        const {id} = req;
        // In real instagram they will apply different logic to recommend Users but we are randomly suggesting users
        const suggestedUsers = await UserModel.find({ _id: { $ne: id } }).select('-password').limit(5);
        // const suggestedUsers = await UserModel.find({ _id: id }).select('-password'); // not the exact query find users where _id != id
        return res.status(201).json({
            message: "suggested Users",
            success: true,
            suggestedUsers
        })
    } catch (error: any) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to fetch suggested users",
            error: error.message,
            success: false
        })
    }
}

export const followORUnfollow = async (req: CustomRequest, res: Response): Promise<Response> => {
    const userId = req.id;
    const idToFollow = req.params.id;
    const objectIdToFollow = new mongoose.Types.ObjectId(idToFollow);

    if(userId === idToFollow) return res.status(401).json({
        message : "you cannot follow/Unfollow yourself",
        success : false
    })

    try {
        const user = await UserModel.findOne({ _id: userId });
        const userToFollow = await UserModel.findOne({ _id: idToFollow });
        if (!userToFollow || !user) return res.status(401).json({
            message: "Account which you want to follow doesn't exists",
            success: false
        })

        const isFollowing = user.following.includes(objectIdToFollow);

        if(!isFollowing){
            //logic to follow
            await Promise.all([
                UserModel.updateOne({ _id: userId }, { $push: { following: idToFollow } }),
                UserModel.updateOne({ _id: idToFollow }, { $push: { followers: userId } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
        else{
            // logic to unfollow
            await Promise.all([
                UserModel.updateOne({ _id: userId }, { $pull: { following: idToFollow } }),
                UserModel.updateOne({ _id: idToFollow }, { $pull: { followers: userId } }),
            ])
            return res.status(200).json({ message: 'UnFollowed successfully', success: true });
        }
    } catch (error: any) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to follow the user",
            error: error.message,
            success: false
        })
    }
}
