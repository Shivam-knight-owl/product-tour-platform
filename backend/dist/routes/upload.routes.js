import { Router } from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
const router = Router();
/**
 * @route POST /api/uploads
 * @desc Upload media file (image or video)
 * @access Private
 */
router.post('/', authenticateToken, upload.single('media'), async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        // Determine resource type based on mimetype
        const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
        // Return success response with file details
        res.status(201).json({
            success: true,
            url: req.file.path, // Cloudinary secure URL
            filename: req.file.filename,
            resourceType: resourceType
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
export default router;
