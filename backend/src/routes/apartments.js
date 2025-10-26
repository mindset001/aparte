import express from 'express';
import Apartment from '../models/Apartment.js';
import User from '../models/User.js';

import multer from 'multer';
import cloudinary from '../../utils/cloudinary.js';
import { v2 as cloudinaryV2 } from 'cloudinary';
import streamifier from 'streamifier';

const upload = multer();

const router = express.Router();

console.log('Cloudinary ENV:', process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);

// GET /apartments - list all apartments
router.get('/', async (req, res) => {
  try {
  const apartments = await Apartment.find().populate('owner', 'fullName email uuid');
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching apartments' });
  }
});

// POST /apartments - create new apartment
// POST /apartments - create new apartment with images
router.post('/', upload.array('images'), async (req, res) => {
  try {
    const { title, description, price, location, ownerUuid } = req.body;
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!price) missingFields.push('price');
    if (!location) missingFields.push('location');
    if (!ownerUuid) missingFields.push('ownerUuid');
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const stream = streamifier.createReadStream(file.buffer);
        const uploadResult = await new Promise((resolve, reject) => {
          const cldStream = cloudinaryV2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
          stream.pipe(cldStream);
        });
        imageUrls.push(uploadResult.secure_url);
      }
    }
    // Find user by uuid
    const user = await User.findOne({ uuid: ownerUuid });
    if (!user) {
      return res.status(400).json({ message: 'Owner user not found' });
    }
    const apt = new Apartment({
      title,
      description,
      price,
      location,
      images: imageUrls,
      owner: user._id,
    });
    await apt.save();
    res.status(201).json(apt);
  } catch (err) {
    res.status(400).json({ message: 'Error creating apartment', error: err.message });
  }
});

export default router;
