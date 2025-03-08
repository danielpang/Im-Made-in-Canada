const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
let dotenv = require('dotenv').config({ path: '../.env' })

const app = express();
const PORT = 8000;
const MONDODB_URI = dotenv.parsed.MONGODB_URI || process.env.MONDODB_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname + '/public'));

// Connect to MongoDB
mongoose.connect(MONDODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Schema for items
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  purchaseLink: { type: String, required: true },
  imagePath: { type: String, required: true },
  description: { type: String, required: true },
  proofOfOrigin: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create text index for search
itemSchema.index({ name: 'text', description: 'text' });

const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/', function(req, res){
    res.render('index.ejs');
  });

// Create a new item
app.post('/api/items', upload.single('image'), async (req, res) => {
  try {
    const { name, purchaseLink, description, proofOfOrigin } = req.body;
    
    const newItem = new Item({
      name,
      purchaseLink,
      imagePath: `/uploads/${req.file.filename}`,
      description,
      proofOfOrigin
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search items
app.get('/api/items/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const items = await Item.find({ 
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update item
app.put('/api/items/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, purchaseLink, description, proofOfOrigin } = req.body;
    
    const updateData = {
      name,
      purchaseLink,
      description,
      proofOfOrigin
    };

    // Update image if a new one was uploaded
    if (req.file) {
      updateData.imagePath = `/uploads/${req.file.filename}`;
      
      // Delete old image
      const oldItem = await Item.findById(req.params.id);
      if (oldItem && oldItem.imagePath) {
        const oldImagePath = path.join(__dirname, oldItem.imagePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Delete image file
    if (item.imagePath) {
      const imagePath = path.join(__dirname, item.imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});