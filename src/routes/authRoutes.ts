import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { sendMail } from '../services/emailService';
import emailTemplete from '../services/emailTemplate';
import jwt from 'jsonwebtoken';
const router = Router();
const prisma = new PrismaClient();

const EMAIL_TOKEN_EXPIRATION_IN_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "SUPER SCERET";

// Generate a random 8 digit number as the email token
function generateEmailToken(): string {
    return Math.floor (10000000 + Math.random() * 90000000).toString();
}

function generateAuthToken(tokenId: number): string {
    const jwtPayload = { tokenId };
    return jwt.sign(jwtPayload,JWT_SECRET, {
        algorithm: "HS256",
        noTimestamp: true
    });
}

// Create a user if it doesnt exists,
// generate a emailToken and send it to their email
router.post('/login', async (req,res)=>{
    const { email } = req.body;
    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_IN_MINUTES * 60 * 1000);

    try {
        const createdToken = await prisma.token.create({
            data: {
                type: "EMAIL",
                emailToken,
                expiration,
                user: {
                    connectOrCreate: {
                        where:  { email },
                        create: { email }
                    }
                }
            }
        });
        
        // res.status(200).json({
        //     status: 200,
        //     message: 'Token generated successfully.',
        //     data: createdToken
        // });

        // Send token to user's email
        sendMail({
            from: 'twitterclone@siddydevelops.com',
            to: email,
            subject: 'Twitter Clone By SiddyDevelops',
            text: `twitterclone@siddydevelops.com shared a token with you`,
            html: emailTemplete({
                verificationToken: emailToken
            })
        });
        return res.status(200).send({
            status: 200,
            message: 'Token sent via email successfully.',
            data: createdToken
        });
    } catch(err) {
        res.status(400).json({
            status: 400,
            message: 'Failed to create token. Please try again.',
            data: err
        });
    }
});

// Validate the emailToken
// Generate a long lived JWT token
router.post('/authenticate', async (req,res)=>{
    const { email, emailToken } = req.body;
    try{
        const dbEmailToken = await prisma.token.findUnique({
            where: { emailToken },
            include: { user:true }
        });

        if(!dbEmailToken || !dbEmailToken.valid) {
            return res.status(401).json({
                status: 401,
                message: 'User is unauthenticated from client panel.',
                data: dbEmailToken
            });
        } 
        if(dbEmailToken.expiration < new Date()) {
            return res.status(401).json({
                status: 401,
                message: 'Token has expired.',
                data: `Validity till time: ${dbEmailToken.expiration}`
            });
        }
        if(dbEmailToken.user?.email !== email) {
            return res.status(401).json({
                status: 401,
                message: 'This token is incorrect.',
                data: null
            });
        }

        // Here we have validated that the user is the owner of the email

        // Generate an API token
        const expiration = new Date(new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000);
        const apiToken = await prisma.token.create({
            data: {
                type: "API",
                expiration,
                user: {
                    connect: {
                        email
                    }
                }
            }
        });

        // Invalidate the emailToken
        await prisma.token.update({
            where: { id: dbEmailToken.id},
            data: { valid: false }
        });

        // Generate the JWT token
        const authToken = generateAuthToken(apiToken.id);

        res.status(200).json({
            status: 200,
            message: 'Auth token created successfully.',
            data: authToken
        });
    } catch(err) {
        res.status(400).json({
            status: 400,
            message: 'Failed to retrieve token.',
            data: err
        });
    }
});

export default router;