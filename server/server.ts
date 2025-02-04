import { server, app, startServer } from './app';
import multer from 'multer';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import express from 'express';

const upload = multer(); // Multer configuration for handling file uploads

// AWS S3 Client Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Add an endpoint for image uploads
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.file;

  // Generate a unique file name
  const uniqueFileName = `${Date.now()}-${file.originalname}`;

  // S3 upload parameters
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: uniqueFileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    // Upload file to S3
    await s3Client.send(new PutObjectCommand(uploadParams));
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
    res.status(200).json({ imageUrl }); // Return the uploaded image URL
  } catch (err) {
    console.error('Error uploading to S3:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Start the server
startServer();
export { app, server };
