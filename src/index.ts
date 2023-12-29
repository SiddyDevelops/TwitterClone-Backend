import express from 'express';
import userRoutes from './routes/userRoutes'
import tweetRoutes from './routes/tweetRoutes'

const app = express();
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Hello World!');
});

// USER CRUD
app.use('/user',userRoutes);
// TWEET CRUD
app.use('/tweet',tweetRoutes);

app.listen(3000, ()=>{
    console.log("Server listening at localhost:3000");
});