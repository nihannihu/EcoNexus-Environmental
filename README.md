# EcoNexus - 3D Environmental Mapping Platform

EcoNexus is an interactive 3D environmental mapping platform that helps communities visualize and address environmental challenges in real-time. Built for the hackathon, it combines 3D mapping, real-time environmental data, and AI-powered suggestions to create an engaging sustainability platform.

## Features

### Core Features
- **Interactive 3D Neighborhood Hub**: Fast, interactive 3D map of Bengaluru neighborhoods using MapTiler Cloud
- **Live Environmental Dashboard**: Real-time air quality and solar potential data overlays
- **AI-Powered Action Suggester**: Intelligent suggestions for environmental improvements
- **Community Engagement**: Upvote system for popular suggestions

### Technical Features
- Real-time air quality monitoring using OpenWeatherMap API
- Solar potential mapping for rooftop installations
- Geocoding and reverse geocoding using Geoapify API
- 3D building visualization with MapTiler Cloud
- WebSocket integration for live data updates
- Responsive design with modern UI/UX

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with:
   ```
   PORT=3000
   MAPTILER_KEY=WBYIyUNJnkBEtqMzfMOK
   GEOAPIFY_KEY=f9fc4de949a14c169c5b721995c17b54
   OPENWEATHER_KEY=465c63cc77ee43d692f4e8c7a0dc430a
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open the application**
   Navigate to `http://localhost:5000` in your browser

### Development Mode
For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Backend Endpoints
- `GET /api/air-quality` - Get current air quality data
- `GET /api/solar-potential` - Get solar potential data
- `GET /api/maptiler-key` - Get MapTiler API key
- `GET /api/geoapify-key` - Get Geoapify API key
- `POST /api/suggestions` - Generate AI suggestions for a location
- `POST /api/upvote` - Upvote a suggestion
- `GET /api/geocode` - Geocode an address
- `GET /api/reverse-geocode` - Reverse geocode coordinates

## Project Structure

```
project/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── public/                # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styles
│   └── app.js             # Frontend JavaScript
└── README.md              # This file
```

## Technologies Used

### Backend
- Node.js with Express.js
- Socket.io for real-time communication
- Axios for API calls
- TensorFlow.js for AI suggestions
- node-cron for scheduled tasks

### Frontend
- MapTiler Cloud SDK for 3D mapping
- Vanilla JavaScript (ES6+)
- CSS3 with modern features
- Font Awesome icons
- Google Fonts (Inter)

### APIs
- MapTiler Cloud (3D mapping)
- OpenWeatherMap (air quality data)
- Geoapify (geocoding services)

## Usage

1. **Explore the 3D Map**: Use mouse to pan, zoom, and rotate the 3D view
2. **Toggle Data Layers**: Use the sidebar to show/hide air quality and solar potential
3. **Get AI Suggestions**: Click on any location to see AI-powered suggestions
4. **Search Locations**: Use the search bar to navigate to specific addresses
5. **Community Engagement**: Upvote suggestions you find valuable

## Customization

### Changing the Default Location
Edit the `currentLocation` in `public/app.js`:
```javascript
this.currentLocation = { lat: 12.9716, lon: 77.5946 }; // Change to your city
```

### Running on Different Ports
```bash
# Default port 5000
npm start

# Custom ports
PORT=5001 npm start
PORT=6000 npm start
PORT=7000 npm start
PORT=8000 npm start
PORT=9000 npm start
```

### Adding New Data Layers
1. Add new toggle in the HTML
2. Create corresponding layer in the JavaScript
3. Add data source in the backend

### Styling
Modify `public/styles.css` to customize the appearance.

## Troubleshooting

### Common Issues

1. **Map not loading**: Check if MapTiler API key is correct
2. **Air quality data not updating**: Verify OpenWeatherMap API key
3. **Search not working**: Check Geoapify API key
4. **Port already in use**: Try different ports (5001, 6000, 7000, 8000, 9000)

### Debug Mode
Enable debug logging by adding to server.js:
```javascript
console.log('Debug mode enabled');
```

## Future Enhancements

- Database integration for persistent data
- User authentication and profiles
- Advanced AI models for better suggestions
- Mobile app development
- Integration with IoT sensors
- Community forums and discussions

## License

MIT License - feel free to use this project for your own hackathon or development purposes.

## Support

For issues or questions, please check the troubleshooting section or create an issue in the project repository.
