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
- **Live NamUs Fetch**: Attempts a real-time NamUs API request and falls back to demo records if unavailable
- **Featured Cases**: Random featured case to highlight different individuals
- **Detailed Views**: Click any case for comprehensive information
- **Social Sharing**: Share cases via native share or clipboard
- **Mapbox Map View**: Interactive pin map once a Mapbox public token is entered
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🔧 Customization

### NamUs API Endpoint

The app now requests live data from:

```
https://www.namus.gov/api/CaseSets/NamUs/MissingPersons/Cases/Search
```

If NamUs is down or blocks the browser request, the UI automatically falls back to demo records and shows a status message at the top of the results.

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

## 🗺️ Mapbox Setup

1. Create a public token in your Mapbox account (`pk...`).
2. Open the app and switch to **Map** view.
3. Paste the token and click **Save Token**.

The token is stored in local browser storage only (`localStorage.mapboxToken`).

You can also inject it globally before `index.js` loads:

```html
<script>window.MAPBOX_TOKEN = "pk.eyJ...";</script>
```

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

The app attempts to load live NamUs records first. If that fails, it uses a small fallback sample dataset for demonstration. Each case includes:
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
