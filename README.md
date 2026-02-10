# Every Missing Person Matters - NamUs Database Viewer

A web application designed to bring visibility to missing persons who don't receive media coverage. Built to display data from the National Missing and Unidentified Persons System (NamUs).

## 🚀 Quick Start

### Option 1: Open Directly (Simplest)
1. Download all files to the same folder
2. Double-click `index.html`
3. The app will open in your default browser

### Option 2: Use a Local Server (Recommended)
This is better for testing and development:

**Using Python (if installed):**
```bash
# Navigate to the folder containing the files
cd path/to/namus-app

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser to: `http://localhost:8000`

**Using VS Code:**
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

**Using Node.js:**
```bash
# Install http-server globally
npm install -g http-server

# Run in the project folder
http-server
```

## 📁 File Structure

```
namus-app/
├── index.html      # Main HTML structure
├── styles.css      # All styling
├── index.js        # Application logic and data
└── README.md       # This file
```

## ✨ Features

- **Search & Filter**: Search by name, location, or case ID. Filter by state, gender, and age range
- **Featured Cases**: Random daily featured case to highlight different individuals
- **Detailed Views**: Click any case for comprehensive information
- **Social Sharing**: Share cases via native share or clipboard
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Two View Modes**: List view (active) and Map view (placeholder)

## 🔧 Customization

### Adding Real NamUs Data

To connect to the real NamUs API, modify `index.js`:

1. Find the `SAMPLE_DATA` array (around line 1)
2. Replace it with an API call:

```javascript
// At the top of index.js
let SAMPLE_DATA = [];

// Add this function
async function fetchNamUsData() {
    try {
        const response = await fetch('https://www.namus.gov/api/CaseSets/NamUs/MissingPersons/Cases');
        const data = await response.json();
        SAMPLE_DATA = data.results; // Adjust based on actual API response structure
        init();
    } catch (error) {
        console.error('Failed to fetch NamUs data:', error);
        // Fallback to sample data or show error message
    }
}

// Call it when the page loads
fetchNamUsData();
```

### Changing Colors

Edit `styles.css` to change the color scheme:

```css
/* Main accent color (currently red) */
background: linear-gradient(90deg, #c41e3a 0%, #8b1a2d 100%);

/* Change to blue, for example: */
background: linear-gradient(90deg, #1e3ac4 0%, #1a2d8b 100%);
```

### Adding More Filters

In `index.html`, add new filter dropdowns in the filters panel.
In `index.js`, add corresponding logic in the `applyFilters()` function.

## 🗺️ Adding Map Functionality

To implement the real map view:

1. Get a Google Maps API key or Mapbox token
2. Add the library to `index.html`:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

3. Replace the map placeholder in `index.js` with actual map rendering code

## 🌐 Deployment

### Deploy to GitHub Pages (Free)
1. Create a GitHub repository
2. Upload all files
3. Go to Settings > Pages
4. Select main branch as source
5. Your site will be live at `https://yourusername.github.io/repo-name`

### Deploy to Netlify (Free)
1. Create account at netlify.com
2. Drag and drop your folder
3. Site will be live instantly

### Deploy to Vercel (Free)
1. Create account at vercel.com
2. Import your GitHub repository or upload files
3. Deploy with one click

## 📊 Current Data

The app currently displays **8 sample cases** for demonstration purposes. Each case includes:
- Name, age, gender, race
- Date and location last seen
- Physical description
- Circumstances of disappearance
- Case ID

## 🤝 Contributing

To add more features or improve the app:
1. Edit the relevant files
2. Test locally
3. Deploy your changes

## ⚠️ Important Notes

- This is a **demonstration interface**
- For official information, always refer to [NamUs.gov](https://namus.gov)
- To report tips, call 1-855-626-7600
- Respect the privacy and dignity of missing persons and their families

## 📝 License

This project is created for educational and awareness purposes. Always comply with NamUs terms of service when using their API.

## 🔗 Resources

- [NamUs Official Site](https://namus.gov)
- [NamUs API Documentation](https://www.namus.gov/api)
- [Missing Persons Support](https://www.missingkids.org)

---

**Remember**: Every person matters. Every story deserves to be told.
