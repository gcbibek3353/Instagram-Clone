import { Router } from "express";
import userRouter from "./user.route.js";
import postRouter from "./post.route.js";
const router = Router();
router.use('/api/v1/user', userRouter);
router.use('/api/v1/post', postRouter);
router.get('/test', (req, res) => {
    res.json({
        messagee: "hello /test"
    });
});
export default router;
