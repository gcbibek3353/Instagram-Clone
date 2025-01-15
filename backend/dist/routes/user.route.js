import { Router } from "express";
import { editProfile, followORUnfollow, getProfile, getSuggestedUser, isAuthenticated, login, logout, register, getAllUsers } from "../controllers/user.controller.js";
import { isUserAuthenticated } from "../middlewares/isUserAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/auth', isUserAuthenticated, isAuthenticated);
router.get('/logout', isUserAuthenticated, logout);
router.get('/profile/:id', isUserAuthenticated, getProfile);
router.post('/profile/edit', isUserAuthenticated, upload.single('profilePic'), editProfile); //add multer middleware 
router.get('/suggestedUser', isUserAuthenticated, getSuggestedUser);
router.post('/followorunfollow/:id', isUserAuthenticated, followORUnfollow);
router.get('/getalluser', getAllUsers);
export default router;
