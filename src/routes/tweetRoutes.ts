import { Router } from "express";
const router = Router();

// Create Tweet
router.post('/', (req,res)=>{
    res.status(501).json({
        error: 'Not Implemented'
    });
});

// List Tweet
router.get('/', (req,res)=>{
    res.status(501).json({
        error: 'Not Implemented'
    });
});

// Get one Tweet
router.get('/:id', (req,res)=>{
    const { id } = req.params;
    res.status(501).json({
        error: `Not Implemented: ${id}`
    });
});

// Update Tweet
router.put('/:id',(req,res)=>{
    const { id } = req.params;
    res.status(501).json({
        error: `Not Implemented: ${id}`
    });
});

// Delete Tweet
router.delete('/:id', (req,res)=>{
    const { id } = req.params;
    res.status(501).json({
        error: `Not Implemented: ${id}`
    });
});

export default router;