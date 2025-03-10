import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' })
import { createClient } from '@supabase/supabase-js'
import { error } from 'console';

const app = express();
const PORT = 8000;
const MONDODB_URI = process.env.MONDODB_URI || dotenv?.parsed?.MONGODB_URI

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Connect to MongoDB
const dbName = process.env.NODE_ENV === 'production' ? 'production' : 'test';
mongoose.connect(MONDODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: dbName,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

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

app.get('/health_check', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Create a new item
app.post('/api/items', async (req, res) => {
  try {
    const { name, purchaseLink, description, proofOfOrigin, imageURL } = req.body;
    
    const newItem = new Item({
      name,
      purchaseLink,
      imagePath: imageURL,
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
app.put('/api/items/:id', async (req, res) => {
  try {
    const { name, purchaseLink, description, proofOfOrigin, imageURL } = req.body;
    console.log("Image URL: " + imageURL);
    
    const updateData = {
      name,
      purchaseLink,
      description,
      proofOfOrigin
    };

    // Update image if a new one was uploaded
    if (imageURL) {
      updateData.imagePath = imageURL;
      
      // Delete old image
      const oldItem = await Item.findById(req.params.id);
      if (oldItem && oldItem.imagePath) {
        deleteImage(oldItem.imagePath);
      }

      if (error) {
        console.error('Error deleting image:', error);
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
      deleteImage(item.imagePath);
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

async function deleteImage(imagePath) {
    try {
      const filePathStart = imagePath.indexOf('object') + 7;
      const { data, error } = await supabase
        .storage
        .from('product_images')
        .remove([filePathStart]);

      if (error) {
        console.error('Error deleting image:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteImage function:', error);
      return false;
    }
  }