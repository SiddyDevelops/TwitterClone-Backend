import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const router = Router();
const prisma = new PrismaClient();

// Create Tweet
router.post('/', async (req,res)=>{
    const { content,image } = req.body; 
    // @ts-ignore
    const user = req.user;
    try{
        const response = await prisma.tweet.create({
            data: {
                content,
                image,
                userId: user.id   
            }
        });
        res.status(201).json({
            status: 201,
            message: 'Tweet posted successfully.',
            data: response
        });
    } catch(err) {
        res.status(400).json({
            status: 400,
            message: err,
            data: null
        });
    }
});

// List Tweet
router.get('/', async (req,res)=>{
    const allTweets = await prisma.tweet.findMany({
        include: {user: {
            select: { 
                id: true,
                name: true,
                image: true,
                bio:true
            }
        }} 
    });
    res.status(200).json({
        status: 200,
        message: 'Tweet list retrieved successfully.',
        data: allTweets
    });
});

// Get one Tweet
router.get('/:id', async (req,res)=>{
    const { id } = req.params;
    try{
        const tweet = await prisma.tweet.findUniqueOrThrow({ where: { id: Number(id)}, include: {user:true}});
        res.status(200).json({
            status: 200,
            message: 'Tweet retrieved successfully.',
            data: tweet
        });
    } catch(err) {
        res.status(404).json({
            status: 404,
            message: 'Tweet does not exists.',
            data: err
        });
    }
});

// Update Tweet
router.put('/:id', async (req,res)=>{
    const { id } = req.params;
    const { content,image } = req.body;
    try{
        const response = await prisma.tweet.update({
            where: { id: Number(id) },
            data: { content,image }
        });
        res.status(200).json({
            status: 200,
            message: 'Tweet updated successfully.',
            data: response
        });
    } catch(err) {
        res.status(400).json({
            status: 400,
            message: 'Failed to update the Tweet.',
            data: err
        });
    }
});

// Delete Tweet
router.delete('/:id', async (req,res)=>{
    const { id } = req.params;
    try{
        const response = await prisma.tweet.delete({ where: { id: Number(id) }});
        res.status(200).json({
            status: 200,
            message: 'Tweet deleted successfully.',
            data: response
        });
    } catch(err) {
        res.status(404).json({
            status: 404,
            message: 'Tweet does not exists.',
            data: err
        });
    }
});

export default router;