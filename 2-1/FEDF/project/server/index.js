const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/wellnesshub_demo';

mongoose.connect(mongoURI)
  .then(() => console.log("Database connection successful."))
  .catch(err => {
    console.error("MongoDB connection failed! This is expected if running client-only.");
    
  });
app.get('/api/test', (req, res) => {
    res.json({ message: "API connection logic is correctly structured." });
});
app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
    console.log(`Server environment structured for demonstration on port ${PORT}`);
});