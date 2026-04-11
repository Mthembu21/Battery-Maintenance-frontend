import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Frontend is running' });
});

// Handle favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(404).send('Not found');
});

// SPA routing - serve index.html for all non-static routes
app.get('*', (req, res) => {
  console.log(`SPA route requested: ${req.path}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Serving SPA from: ${path.join(__dirname, 'dist')}`);
});
