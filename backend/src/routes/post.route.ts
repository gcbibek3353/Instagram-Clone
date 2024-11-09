import { Router } from "express";
import upload from "../middlewares/multer.js";
import { isUserAuthenticated } from "../middlewares/isUserAuthenticated.js";
import { addComment, addPost, bookMarkPost, deletePost, disLikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from "../controllers/post.controller.js";
const router = Router();

router.post('/addpost',isUserAuthenticated as any,upload.array('images',10),addPost as any);
router.get('/getallposts',isUserAuthenticated as any,getAllPost as any);
router.get('/getUserPost/:id',getUserPost as any);
router.post('/likePost/:id',isUserAuthenticated as any,likePost as any);
router.post('/dislikePost/:id',isUserAuthenticated as any,disLikePost as any);
router.post('/comment/:id',isUserAuthenticated as any,addComment as any);
router.get('/getcomment/:id',isUserAuthenticated as any, getCommentsOfPost as any);
router.delete('/:id',isUserAuthenticated as any, deletePost as any);
router.put('/bookmark/:id',isUserAuthenticated as any, bookMarkPost as any );

export default router;