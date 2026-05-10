const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Setup = require('./models/Setup');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection (using local for development if process.env.MONGO_URI is not set)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ar-aquarium';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Routes ---

// Get all saved setups
app.get('/api/setups', async (req, res) => {
  try {
    const setups = await Setup.find().sort({ createdAt: -1 });
    res.status(200).json(setups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch setups' });
  }
});

// Save a new setup
app.post('/api/setups', async (req, res) => {
  try {
    const { title, dimensions, tankVolume, lighting, filtration, substrate, plants, fishCapacity } = req.body;
    
    const newSetup = new Setup({
      title,
      dimensions,
      tankVolume,
      lighting,
      filtration,
      substrate,
      plants,
      fishCapacity
    });

    const savedSetup = await newSetup.save();
    res.status(201).json(savedSetup);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save setup' });
  }
});

// Delete a setup
app.delete('/api/setups/:id', async (req, res) => {
  try {
    await Setup.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Setup deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete setup' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
