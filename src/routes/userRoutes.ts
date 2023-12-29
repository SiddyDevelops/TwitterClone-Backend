import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const router = Router();
const prisma = new PrismaClient();

// Create User
router.post('/', async (req,res)=>{
    const { email,name,username } = req.body; 
    try{
        const response = await prisma.user.create({
            data: {
                email,
                name,
                username,
                bio: "Hello, I am new to twitter."
            }
        });
        res.status(201).json({
            status: 201,
            message: 'User created successfully.',
            data: response
        });
    } catch(err) {
        res.status(400).json({
            status: 400,
            message: 'Username/Email already exists.',
            data: err
        });
    }
});

// List Users
router.get('/', async (req,res)=>{
    const allUsers = await prisma.user.findMany({
        //select: { id:true, name: true, image:true}
    });
    res.status(200).json({
        status: 200,
        message: 'User list retrieved successfully.',
        data: allUsers
    });
});

// Get one user
router.get('/:id', async (req,res)=>{
    const { id } = req.params;
    try{
        const user = await prisma.user.findUniqueOrThrow({ 
            where: { id: Number(id)}, 
            include: {tweets:true}
        });
        res.status(200).json({
            status: 200,
            message: 'User retrieved successfully.',
            data: user
        });
    } catch(err) {
        res.status(404).json({
            status: 404,
            message: 'User does not exists.',
            data: err
        });
    }
});

// Update user
router.put('/:id', async (req,res)=>{
    const { id } = req.params;
    const { bio,name,image } = req.body;
    try{
        const response = await prisma.user.update({
            where: { id: Number(id) },
            data: { bio,name,image }
        });
        res.status(200).json({
            status: 200,
            message: 'User data updated successfully.',
            data: response
        });
    } catch(err) {
        res.status(400).json({
            status: 400,
            message: 'Failed to update the user.',
            data: err
        });
    }
});

// Delete User
router.delete('/:id', async (req,res)=>{
    const { id } = req.params;
    try{
        const response = await prisma.user.delete({ where: { id: Number(id) }});
        res.status(200).json({
            status: 200,
            message: 'User deleted successfully.',
            data: response
        });
    } catch(err) {
        res.status(404).json({
            status: 404,
            message: 'User does not exists.',
            data: err
        });
    }
});

export default router;