const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const DONATIONS_FILE = path.join(DATA_DIR, 'donations.json');

app.use(cors());
app.use(express.json());

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize donations file if it doesn't exist
if (!fs.existsSync(DONATIONS_FILE)) {
  fs.writeFileSync(DONATIONS_FILE, '[]');
}

const CHARITIES = [
  {
    id: 0,
    name: 'Clean Water Foundation',
    description: 'Providing clean water access to communities worldwide',
    address: '0x742d35Cc6635C0532925a3b8D6Ac6E4a03a3BBD9',
    image: '/placeholder.svg',
    mission:
      "Our mission is to ensure every person has access to clean, safe drinking water. We build wells, water treatment facilities, and educate communities about water conservation.",
  },
  {
    id: 1,
    name: 'Education for All',
    description: 'Supporting education initiatives in underserved areas',
    address: '0x8a0A5CCa7B7C6EC3EC7093E6Eb8A4C3F6D4E5fA2',
    image: '/placeholder.svg',
    mission:
      'We believe education is the key to breaking the cycle of poverty. Our programs provide schools, teachers, and educational materials to children in need.',
  },
  {
    id: 2,
    name: 'Medical Relief International',
    description: 'Emergency medical aid and healthcare infrastructure',
    address: '0x9B1E2C3D4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D',
    image: '/placeholder.svg',
    mission:
      'Delivering critical medical care to areas affected by natural disasters, conflicts, and health crises while building sustainable healthcare systems.',
  },
  {
    id: 3,
    name: 'Environmental Conservation',
    description: 'Protecting forests and wildlife habitats',
    address: '0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0',
    image: '/placeholder.svg',
    mission:
      "Preserving our planet's biodiversity through forest conservation, wildlife protection, and sustainable development initiatives.",
  },
];

app.get('/api/charities', (req, res) => {
  res.json(CHARITIES);
});

app.get('/api/donations', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DONATIONS_FILE, 'utf8'));
  res.json(data);
});

app.post('/api/donations', (req, res) => {
  const apiKey = process.env.API_KEY;
  if (apiKey && req.headers['x-api-key'] !== apiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  const { charityId, amount, name, message } = req.body;
  if (typeof charityId !== 'number' || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const donations = JSON.parse(fs.readFileSync(DONATIONS_FILE, 'utf8'));
  const newDonation = {
    id: donations.length + 1,
    charityId,
    amount,
    name: name || 'Anonymous',
    message: message || '',
    date: new Date().toISOString(),
  };
  donations.push(newDonation);
  fs.writeFileSync(DONATIONS_FILE, JSON.stringify(donations, null, 2));
  res.json(newDonation);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

