const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

// Simple route without any imports
app.get('/test', (req, res) => {
  res.json({ message: 'Simple test works!' });
});

app.listen(5000, () => {
  console.log('🚀 Simple test server running on port 5000');
});
