const express = require('express');
const cors = require('cors');
const path = require('path');
const anglesRoutes = require('./routes/angles');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/', anglesRoutes);

// Fallback: always serve index.html for root ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
