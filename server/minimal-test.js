console.log('Starting minimal test...');

const express = require('express');
console.log('Express imported');

const app = express();
console.log('Express app created');

app.get('/test', (req, res) => {
  res.json({ message: 'Hello' });
});
console.log('Route added');

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});
