const NAMUS_API_URL =
  "https://www.namus.gov/api/CaseSets/NamUs/MissingPersons/Cases/Search";
const DEFAULT_MAP_CENTER = [-98.5795, 39.8283];
const DEFAULT_MAP_ZOOM = 3;

// Fallback sample data if API is unavailable
const FALLBACK_DATA = [
  {
    id: "MP1001",
    firstName: "Maria",
    lastName: "Rodriguez",
    age: 28,
    dateLastSeen: "2024-11-15",
    cityLastSeen: "Phoenix",
    stateLastSeen: "Arizona",
    circumstances:
      "Last seen leaving work at approximately 6:30 PM. Vehicle found abandoned near highway.",
    gender: "Female",
    race: "Hispanic/Latino",
    height: "5'4\"",
    weight: "130 lbs",
    lat: 33.4484,
    lng: -112.074,
  },
  {
    id: "MP1002",
    firstName: "James",
    lastName: "Chen",
    age: 45,
    dateLastSeen: "2024-10-22",
    cityLastSeen: "Seattle",
    stateLastSeen: "Washington",
    circumstances:
      "Failed to return from hiking trip in North Cascades National Park.",
    gender: "Male",
    race: "Asian",
    height: "5'9\"",
    weight: "165 lbs",
    lat: 47.6062,
    lng: -122.3321,
  },
];

// Application state
let caseData = [...FALLBACK_DATA];
let filteredData = [...caseData];
let selectedPerson = null;
let currentView = "list";
let map = null;
let mapMarkers = [];
let filters = {
  search: "",
  state: "",
  gender: "",
  ageRange: "",
};

function getMapboxToken() {
  const tokenFromWindow = window.MAPBOX_TOKEN;
  const tokenFromStorage = window.localStorage.getItem("mapboxToken");
  return tokenFromWindow || tokenFromStorage || "";
}

function setApiStatus(message, type = "info") {
  const status = document.getElementById("apiStatus");
  status.textContent = message;
  status.dataset.type = type;
}

function normalizeCase(apiCase) {
  const firstName = apiCase.firstName || apiCase.first || "Unknown";
  const lastName = apiCase.lastName || apiCase.last || "Person";
  const dateLastSeenRaw =
    apiCase.dateLastSeen || apiCase.dateMissing || apiCase.missingDate || null;

  return {
    id: String(apiCase.caseNumber || apiCase.id || `${firstName}-${lastName}`),
    firstName,
    lastName,
    age: Number(apiCase.age) || Number(apiCase.ageAtDisappearance) || 0,
    dateLastSeen: dateLastSeenRaw
      ? new Date(dateLastSeenRaw).toISOString().slice(0, 10)
      : "",
    cityLastSeen:
      apiCase.cityLastSeen || apiCase.city || apiCase.lastSeenCity || "Unknown",
    stateLastSeen:
      apiCase.stateLastSeen || apiCase.state || apiCase.lastSeenState || "Unknown",
    circumstances:
      apiCase.circumstances ||
      apiCase.circumstancesOfDisappearance ||
      "No public circumstances provided.",
    gender: apiCase.gender || "Unknown",
    race: apiCase.race || apiCase.ethnicity || "Unknown",
    height:
      apiCase.height ||
      apiCase.heightFrom ||
      (apiCase.heightInInches ? `${apiCase.heightInInches} in` : "Unknown"),
    weight:
      apiCase.weight ||
      (apiCase.weightFrom ? `${apiCase.weightFrom} lbs` : "Unknown"),
    lat: Number(apiCase.latitude || apiCase.lat) || null,
    lng: Number(apiCase.longitude || apiCase.lon || apiCase.lng) || null,
  };
}

async function fetchNamUsData() {
  const body = {
    page: 1,
    pageSize: 250,
    sortField: "dateLastSeen",
    sortOrder: "desc",
    filters: {},
  };

  try {
    setApiStatus("Loading live NamUs cases...", "info");

    const response = await fetch(NAMUS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`NamUs API request failed (${response.status})`);
    }

    const payload = await response.json();
    const rawCases = payload.cases || payload.results || payload.items || [];
    const normalizedCases = rawCases.map(normalizeCase);

    if (normalizedCases.length) {
      caseData = normalizedCases;
      filteredData = [...caseData];
      setApiStatus(`Showing ${normalizedCases.length} live NamUs cases.`, "success");
      return;
    }

    throw new Error("NamUs API returned no cases.");
  } catch (error) {
    console.error("Failed to load NamUs API data:", error);
    caseData = [...FALLBACK_DATA];
    filteredData = [...caseData];
    setApiStatus(
      "Live NamUs API unavailable right now. Showing fallback demo cases.",
      "warning",
    );
  }
}

// Initialize the application
async function init() {
  await fetchNamUsData();
  populateStateFilter();
  setFeaturedCase();
  applyFilters();
  setupEventListeners();
}

function clearStateFilterOptions() {
  const stateFilter = document.getElementById("stateFilter");
  stateFilter.innerHTML = '<option value="">All States</option>';
}

// Populate the state filter dropdown with unique states from data
function populateStateFilter() {
  clearStateFilterOptions();
  const states = [...new Set(caseData.map((p) => p.stateLastSeen))].sort();
  const stateFilter = document.getElementById("stateFilter");

  states.forEach((state) => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateFilter.appendChild(option);
  });
}

// Set a random featured case
function setFeaturedCase() {
  const featured = caseData[Math.floor(Math.random() * caseData.length)] || caseData[0];
  if (!featured) return;

  document.getElementById("featuredName").textContent =
    `${featured.firstName} ${featured.lastName}`;

  const date = featured.dateLastSeen
    ? new Date(featured.dateLastSeen).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "an unknown date";

  document.getElementById("featuredDetails").textContent =
    `Missing since ${date} from ${featured.cityLastSeen}, ${featured.stateLastSeen}`;

  document.getElementById("featuredButton").onclick = () => showModal(featured);
}

// Set up all event listeners
function setupEventListeners() {
  // Search input
  document.getElementById("searchInput").addEventListener("input", (e) => {
    filters.search = e.target.value;
    applyFilters();
  });

  // Filter button toggle
  document.getElementById("filterButton").addEventListener("click", () => {
    const panel = document.getElementById("filtersPanel");
    const button = document.getElementById("filterButton");
    panel.classList.toggle("hidden");
    button.classList.toggle("active");
  });

  // Filter dropdowns
  document.getElementById("stateFilter").addEventListener("change", (e) => {
    filters.state = e.target.value;
    applyFilters();
  });

  document.getElementById("genderFilter").addEventListener("change", (e) => {
    filters.gender = e.target.value;
    applyFilters();
  });

  document.getElementById("ageFilter").addEventListener("change", (e) => {
    filters.ageRange = e.target.value;
    applyFilters();
  });

  // Reset filters button
  document.getElementById("resetFilters").addEventListener("click", () => {
    filters = { search: "", state: "", gender: "", ageRange: "" };
    document.getElementById("searchInput").value = "";
    document.getElementById("stateFilter").value = "";
    document.getElementById("genderFilter").value = "";
    document.getElementById("ageFilter").value = "";
    applyFilters();
  });

  // View toggle buttons
  document.getElementById("listViewButton").addEventListener("click", () => {
    currentView = "list";
    updateView();
  });

  document.getElementById("mapViewButton").addEventListener("click", () => {
    currentView = "map";
    updateView();
  });

  // Modal close
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal();
  });

  // Save mapbox token
  document.getElementById("saveMapboxToken").addEventListener("click", () => {
    const tokenInput = document.getElementById("mapboxTokenInput");
    const token = tokenInput.value.trim();
    if (!token) return;

    window.localStorage.setItem("mapboxToken", token);
    renderMap();
  });
}

function initMap() {
  const token = getMapboxToken();
  if (!token) return;
  if (!window.mapboxgl) return;

  if (!map) {
    mapboxgl.accessToken = token;
    map = new mapboxgl.Map({
      container: "mapCanvas",
      style: "mapbox://styles/mapbox/dark-v11",
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
  }
}

function clearMapMarkers() {
  mapMarkers.forEach((marker) => marker.remove());
  mapMarkers = [];
}

function renderMap() {
  const helper = document.getElementById("mapSetupHelper");
  const mapCanvas = document.getElementById("mapCanvas");
  const tokenInput = document.getElementById("mapboxTokenInput");

  tokenInput.value = getMapboxToken();

  if (!getMapboxToken()) {
    helper.classList.remove("hidden");
    mapCanvas.classList.add("hidden");
    return;
  }

  helper.classList.add("hidden");
  mapCanvas.classList.remove("hidden");
  initMap();

  if (!map) return;

  clearMapMarkers();

  const locations = filteredData.filter((person) => person.lat && person.lng);

  locations.forEach((person) => {
    const popup = new mapboxgl.Popup({ offset: 18 }).setHTML(`
      <strong>${person.firstName} ${person.lastName}</strong><br>
      Case #${person.id}<br>
      ${person.cityLastSeen}, ${person.stateLastSeen}
    `);

    const marker = new mapboxgl.Marker({ color: "#c41e3a" })
      .setLngLat([person.lng, person.lat])
      .setPopup(popup)
      .addTo(map);

    mapMarkers.push(marker);
  });

  if (locations.length) {
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((person) => bounds.extend([person.lng, person.lat]));
    map.fitBounds(bounds, { padding: 40, maxZoom: 9 });
  } else {
    map.flyTo({ center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM });
  }
}

// Apply all active filters to the data
function applyFilters() {
  filteredData = caseData.filter((person) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matches =
        `${person.firstName} ${person.lastName}`
          .toLowerCase()
          .includes(searchLower) ||
        person.cityLastSeen.toLowerCase().includes(searchLower) ||
        person.stateLastSeen.toLowerCase().includes(searchLower) ||
        person.id.toLowerCase().includes(searchLower);
      if (!matches) return false;
    }

    // State filter
    if (filters.state && person.stateLastSeen !== filters.state) {
      return false;
    }

    // Gender filter
    if (filters.gender && person.gender !== filters.gender) {
      return false;
    }

    // Age range filter
    if (filters.ageRange) {
      if (filters.ageRange === "0-17" && person.age >= 18) return false;
      if (filters.ageRange === "18-30" && (person.age < 18 || person.age > 30))
        return false;
      if (filters.ageRange === "31-50" && (person.age < 31 || person.age > 50))
        return false;
      if (filters.ageRange === "51+" && person.age <= 50) return false;
    }

    return true;
  });

  updateView();
}

// Update the view based on current mode (list or map)
function updateView() {
  document.getElementById("resultsCount").textContent =
    `Showing ${filteredData.length} of ${caseData.length} cases`;

  if (currentView === "list") {
    document.getElementById("gridView").classList.remove("hidden");
    document.getElementById("mapView").classList.add("hidden");
    document.getElementById("listViewButton").classList.add("active");
    document.getElementById("mapViewButton").classList.remove("active");
    renderGrid();
  } else {
    document.getElementById("gridView").classList.add("hidden");
    document.getElementById("mapView").classList.remove("hidden");
    document.getElementById("listViewButton").classList.remove("active");
    document.getElementById("mapViewButton").classList.add("active");
    document.getElementById("mapCount").textContent =
      `📍 ${filteredData.filter((p) => p.lat && p.lng).length} locations currently mapped`;
    renderMap();
  }
}

// Render the grid of case cards
function renderGrid() {
  const grid = document.getElementById("gridView");
  grid.innerHTML = "";

  filteredData.forEach((person) => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => showModal(person);

    const date = person.dateLastSeen
      ? new Date(person.dateLastSeen).toLocaleDateString()
      : "Unknown";

    card.innerHTML = `
            <h3>${person.firstName} ${person.lastName}</h3>
            <div class="case-id">Case #${person.id}</div>
            <div class="card-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Missing since ${date}</span>
            </div>
            <div class="card-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${person.cityLastSeen}, ${person.stateLastSeen}</span>
            </div>
            <div class="card-footer">
                <span>${person.gender}, ${person.age || "Unknown"} years old</span>
                <button class="share-button" onclick="event.stopPropagation(); shareCase('${person.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
            </div>
        `;

    grid.appendChild(card);
  });
}

// Show the modal with person details
function showModal(person) {
  selectedPerson = person;
  document.getElementById("modalName").textContent =
    `${person.firstName} ${person.lastName}`;
  document.getElementById("modalCaseId").textContent = `Case #${person.id}`;

  const date = person.dateLastSeen
    ? new Date(person.dateLastSeen).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";
  document.getElementById("modalDate").textContent = date;
  document.getElementById("modalLocation").textContent =
    `${person.cityLastSeen}, ${person.stateLastSeen}`;
  document.getElementById("modalAge").textContent = `${person.age || "Unknown"} years old`;
  document.getElementById("modalGender").textContent = person.gender;
  document.getElementById("modalRace").textContent = person.race;
  document.getElementById("modalPhysical").textContent =
    `${person.height}, ${person.weight}`;
  document.getElementById("modalCircumstances").textContent =
    person.circumstances;

  document.getElementById("shareButton").onclick = () => shareCase(person.id);
  document.getElementById("namusButton").onclick = () => {
    window.open(
      `https://namus.gov/MissingPersons/Case#/${person.id}`,
      "_blank",
    );
  };

  document.getElementById("modal").classList.remove("hidden");
}

// Close the modal
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  selectedPerson = null;
}

// Share a case using native share or clipboard
function shareCase(caseId) {
  const person = caseData.find((p) => p.id === caseId);
  if (!person) return;

  const date = person.dateLastSeen
    ? new Date(person.dateLastSeen).toLocaleDateString()
    : "Unknown";
  const text = `Help find ${person.firstName} ${person.lastName}, missing since ${date}. Last seen in ${person.cityLastSeen}, ${person.stateLastSeen}. More info: https://namus.gov/MissingPersons/Case#/${person.id}`;

  if (navigator.share) {
    navigator
      .share({
        title: `Missing: ${person.firstName} ${person.lastName}`,
        text: text,
        url: `https://namus.gov/MissingPersons/Case#/${person.id}`,
      })
      .catch((err) => {
        console.log("Share cancelled or failed:", err);
      });
  } else {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Case information copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        alert("Failed to copy to clipboard. Please try again.");
      });
  }
}

// Initialize the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
