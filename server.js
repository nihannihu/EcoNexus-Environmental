const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Keys
const MAPTILER_KEY = 'WBYIyUNJnkBEtqMzfMOK';
const GEOAPIFY_KEY = 'f9fc4de949a14c169c5b721995c17b54';
const OPENWEATHER_KEY = '465c63cc77ee43d692f4e8c7a0dc430a';

// Data storage
let airQualityData = {};
let solarPotentialData = {};
let suggestions = [];

// AI suggestion system (simplified without TensorFlow.js)

// AI Model for generating suggestions (simplified)
class EcoSuggestionModel {
  constructor() {
    console.log('EcoSuggestionModel initialized');
  }

  generateSuggestion(context) {
    const suggestions = [
      {
        id: 1,
        title: "Plant Air-Purifying Trees",
        description: "Plant native trees like Neem, Peepal, or Banyan along this street to improve air quality",
        impact: "High",
        effort: "Medium",
        category: "Air Quality",
        upvotes: Math.floor(Math.random() * 50)
      },
      {
        id: 2,
        title: "Promote Public Transport",
        description: "Organize community awareness campaigns to encourage public transport usage",
        impact: "High",
        effort: "Low",
        category: "Transportation",
        upvotes: Math.floor(Math.random() * 30)
      },
      {
        id: 3,
        title: "Install Solar Panels",
        description: "This rooftop has excellent solar potential. Consider installing solar panels",
        impact: "High",
        effort: "High",
        category: "Renewable Energy",
        upvotes: Math.floor(Math.random() * 40)
      },
      {
        id: 4,
        title: "Create Green Corridor",
        description: "Develop a walking/cycling path with green cover to reduce vehicle emissions",
        impact: "Medium",
        effort: "High",
        category: "Urban Planning",
        upvotes: Math.floor(Math.random() * 25)
      },
      {
        id: 5,
        title: "Waste Management Initiative",
        description: "Set up community composting and recycling programs",
        impact: "Medium",
        effort: "Medium",
        category: "Waste Management",
        upvotes: Math.floor(Math.random() * 35)
      }
    ];

    // Filter suggestions based on context
    let relevantSuggestions = suggestions;
    
    if (context.airQuality < 50) {
      relevantSuggestions = suggestions.filter(s => s.category === "Air Quality" || s.category === "Transportation");
    } else if (context.solarPotential > 0.7) {
      relevantSuggestions = suggestions.filter(s => s.category === "Renewable Energy");
    }

    return relevantSuggestions.slice(0, 3);
  }
}

const suggestionModel = new EcoSuggestionModel();

// Fetch air quality data from OpenWeatherMap
async function fetchAirQualityData() {
  try {
    const bengaluruCoords = { lat: 12.9716, lon: 77.5946 };
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${bengaluruCoords.lat}&lon=${bengaluruCoords.lon}&appid=${OPENWEATHER_KEY}`
    );
    
    airQualityData = {
      aqi: response.data.list[0].main.aqi,
      components: response.data.list[0].components,
      timestamp: new Date().toISOString()
    };
    
    console.log('Air quality data updated:', airQualityData);
  } catch (error) {
    console.error('Error fetching air quality data:', error.message);
  }
}

// Generate solar potential data (simulated)
function generateSolarPotentialData() {
  const bengaluruBounds = {
    north: 13.0225,
    south: 12.8342,
    east: 77.8423,
    west: 77.3467
  };

  solarPotentialData = {};
  
  // Generate random solar potential for different areas
  for (let lat = bengaluruBounds.south; lat <= bengaluruBounds.north; lat += 0.01) {
    for (let lon = bengaluruBounds.west; lon <= bengaluruBounds.east; lon += 0.01) {
      const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
      solarPotentialData[key] = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
    }
  }
  
  console.log('Solar potential data generated');
}

// Routes
app.get('/api/air-quality', (req, res) => {
  res.json(airQualityData);
});

app.get('/api/solar-potential', (req, res) => {
  res.json(solarPotentialData);
});

app.get('/api/maptiler-key', (req, res) => {
  res.json({ key: MAPTILER_KEY });
});

app.get('/api/geoapify-key', (req, res) => {
  res.json({ key: GEOAPIFY_KEY });
});

app.post('/api/suggestions', async (req, res) => {
  try {
    const { lat, lon, airQuality, solarPotential } = req.body;
    
    const context = {
      airQuality: airQuality || 50,
      solarPotential: solarPotential || 0.5,
      location: { lat, lon }
    };
    
    const suggestions = suggestionModel.generateSuggestion(context);
    res.json(suggestions);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

app.post('/api/upvote', (req, res) => {
  const { suggestionId } = req.body;
  // In a real app, this would update a database
  res.json({ success: true, upvotes: Math.floor(Math.random() * 100) });
});

// Geocoding endpoint
app.get('/api/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEOAPIFY_KEY}`
    );
    
    if (response.data.features && response.data.features.length > 0) {
      const result = response.data.features[0];
      res.json({
        lat: result.geometry.coordinates[1],
        lon: result.geometry.coordinates[0],
        address: result.properties.formatted
      });
    } else {
      res.status(404).json({ error: 'Address not found' });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

// Reverse geocoding endpoint
app.get('/api/reverse-geocode', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_KEY}`
    );
    
    if (response.data.features && response.data.features.length > 0) {
      const result = response.data.features[0];
      res.json({
        address: result.properties.formatted,
        placeType: result.properties.type,
        details: result.properties
      });
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({ error: 'Reverse geocoding failed' });
  }
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Schedule data updates
cron.schedule('*/5 * * * *', () => {
  fetchAirQualityData();
  io.emit('dataUpdate', { airQuality: airQualityData });
});

// Initialize data
fetchAirQualityData();
generateSolarPotentialData();

// Start server
server.listen(PORT, () => {
  console.log(`EcoNexus server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to view the application`);
  console.log(`Alternative ports available: 5001, 5002, 5003, 6000, 7000, 8000, 9000`);
});
