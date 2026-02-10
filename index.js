// Sample data - In production, this would come from the NamUs API
const SAMPLE_DATA = [
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
  {
    id: "MP1003",
    firstName: "Sarah",
    lastName: "Thompson",
    age: 19,
    dateLastSeen: "2025-01-03",
    cityLastSeen: "Austin",
    stateLastSeen: "Texas",
    circumstances:
      "Last seen at college campus library. Did not return to dormitory.",
    gender: "Female",
    race: "White/Caucasian",
    height: "5'6\"",
    weight: "140 lbs",
    lat: 30.2672,
    lng: -97.7431,
  },
  {
    id: "MP1004",
    firstName: "Michael",
    lastName: "Williams",
    age: 62,
    dateLastSeen: "2024-12-08",
    cityLastSeen: "Miami",
    stateLastSeen: "Florida",
    circumstances:
      "Left home for daily walk and never returned. Has medical conditions requiring medication.",
    gender: "Male",
    race: "Black/African American",
    height: "6'0\"",
    weight: "180 lbs",
    lat: 25.7617,
    lng: -80.1918,
  },
  {
    id: "MP1005",
    firstName: "Emily",
    lastName: "Martinez",
    age: 34,
    dateLastSeen: "2024-09-30",
    cityLastSeen: "Denver",
    stateLastSeen: "Colorado",
    circumstances:
      "Disappeared after leaving a friend's residence. Phone last pinged near downtown area.",
    gender: "Female",
    race: "Hispanic/Latino",
    height: "5'5\"",
    weight: "125 lbs",
    lat: 39.7392,
    lng: -104.9903,
  },
  {
    id: "MP1006",
    firstName: "Robert",
    lastName: "Johnson",
    age: 51,
    dateLastSeen: "2024-11-28",
    cityLastSeen: "Chicago",
    stateLastSeen: "Illinois",
    circumstances:
      "Failed to show up for work. Car found in workplace parking lot.",
    gender: "Male",
    race: "White/Caucasian",
    height: "5'11\"",
    weight: "195 lbs",
    lat: 41.8781,
    lng: -87.6298,
  },
  {
    id: "MP1007",
    firstName: "Jennifer",
    lastName: "Lee",
    age: 23,
    dateLastSeen: "2025-01-20",
    cityLastSeen: "Portland",
    stateLastSeen: "Oregon",
    circumstances:
      "Went missing after evening shift at restaurant. Last seen walking toward public transit station.",
    gender: "Female",
    race: "Asian",
    height: "5'3\"",
    weight: "115 lbs",
    lat: 45.5152,
    lng: -122.6784,
  },
  {
    id: "MP1008",
    firstName: "David",
    lastName: "Garcia",
    age: 37,
    dateLastSeen: "2024-08-12",
    cityLastSeen: "Los Angeles",
    stateLastSeen: "California",
    circumstances:
      "Left for morning jog and never returned home. Phone and wallet found on jogging trail.",
    gender: "Male",
    race: "Hispanic/Latino",
    height: "5'10\"",
    weight: "175 lbs",
    lat: 34.0522,
    lng: -118.2437,
  },
];

// Application state
let filteredData = [...SAMPLE_DATA];
let selectedPerson = null;
let currentView = "list";
let filters = {
  search: "",
  state: "",
  gender: "",
  ageRange: "",
};

// Initialize the application
function init() {
  populateStateFilter();
  setFeaturedCase();
  applyFilters();
  setupEventListeners();
}

// Populate the state filter dropdown with unique states from data
function populateStateFilter() {
  const states = [...new Set(SAMPLE_DATA.map((p) => p.stateLastSeen))].sort();
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
  const featured = SAMPLE_DATA[Math.floor(Math.random() * SAMPLE_DATA.length)];
  document.getElementById("featuredName").textContent =
    `${featured.firstName} ${featured.lastName}`;

  const date = new Date(featured.dateLastSeen).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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
}

// Apply all active filters to the data
function applyFilters() {
  filteredData = SAMPLE_DATA.filter((person) => {
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
    `Showing ${filteredData.length} of ${SAMPLE_DATA.length} cases`;

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
      `📍 ${filteredData.length} locations to display`;
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

    const date = new Date(person.dateLastSeen).toLocaleDateString();

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
                <span>${person.gender}, ${person.age} years old</span>
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

  const date = new Date(person.dateLastSeen).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  document.getElementById("modalDate").textContent = date;
  document.getElementById("modalLocation").textContent =
    `${person.cityLastSeen}, ${person.stateLastSeen}`;
  document.getElementById("modalAge").textContent = `${person.age} years old`;
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
  const person = SAMPLE_DATA.find((p) => p.id === caseId);
  if (!person) return;

  const date = new Date(person.dateLastSeen).toLocaleDateString();
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
