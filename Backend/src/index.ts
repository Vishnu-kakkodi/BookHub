import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from './routes/routes'
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();
const app = express();
const server = http.createServer(app);



app.use(cors({
origin: [ 'http://localhost:3000'],
methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'role'],
exposedHeaders: ['Content-Range', 'X-Content-Range'],
credentials: true,
maxAge: 86400
}));


app.use(express.json());

app.use('/api/users', userRoutes);


mongoose.connect('mongodb://localhost:27017/bookhub')
.then(()=>console.log("Connected to MongoDB"))
.catch((err) => console.error('MongoDB connection:',err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

export default app;