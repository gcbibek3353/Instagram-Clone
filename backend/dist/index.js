import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rootRouter from './routes/index.js';
import connectDB from './utils/db.js';
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
// app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/', rootRouter);
app.listen(PORT, () => {
    connectDB();
    console.log(`server is listining on port ${PORT}`);
});
