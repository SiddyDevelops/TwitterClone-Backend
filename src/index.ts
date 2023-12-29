import express from 'express';
import userRoutes from './routes/userRoutes'
import tweetRoutes from './routes/tweetRoutes'
import authRoutes from './routes/authRoutes';

const app = express();
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Hello World!');
});

// USER CRUD
app.use('/user',userRoutes);
// TWEET CRUD
app.use('/tweet',tweetRoutes);
// AUTH Endpoints
app.use('/auth',authRoutes);

app.listen(3000, ()=>{
    console.log("Server listening at localhost:3000");
});