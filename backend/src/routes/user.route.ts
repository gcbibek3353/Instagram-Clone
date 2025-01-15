import { Router } from "express";
import { editProfile, followORUnfollow, getProfile, getSuggestedUser, isAuthenticated, login, logout, register,getAllUsers } from "../controllers/user.controller.js";
import { isUserAuthenticated } from "../middlewares/isUserAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = Router();

router.post('/register',register as any);
router.post('/login',login as any);
router.get('/auth',isUserAuthenticated as any,isAuthenticated as any);
router.get('/logout',isUserAuthenticated as any,logout as any);
router.get('/profile/:id',isUserAuthenticated as any,getProfile as any);
router.post('/profile/edit',isUserAuthenticated as any,upload.single('profilePic'),editProfile as any); //add multer middleware 
router.get('/suggestedUser',isUserAuthenticated as any,getSuggestedUser as any);
router.post('/followorunfollow/:id',isUserAuthenticated as any,followORUnfollow as any)
router.get('/getalluser',getAllUsers as any);

export default router;
