// CONTENT CREATOR HUB APPLICATION LOGIC

// 1. DATA MODEL
const creators = [
  {
    id: "nadia-aurel",
    name: "Nadia Aurel",
    city: "Jakarta",
    country: "Indonesia",
    category: "lifestyle",
    platforms: ["instagram", "tiktok", "youtube"],
    followers: 532000,
    followersText: "532K",
    engagementRate: 4.21,
    price: 8000000,
    priceText: "Rp 8.000.000",
    verified: true,
    rating: 4.8,
    fastResponse: true,
    topRated: true,
    image: "assets/images/nadia_aurel.png",
    bio: "Lifestyle blogger sharing daily routines, fashion tips, and healthy eating guides. Collaborated with 50+ fashion and cosmetics brands nationwide."
  },
  {
    id: "reza-alvaro",
    name: "Reza Alvaro",
    city: "Bandung",
    country: "Indonesia",
    category: "travel",
    platforms: ["instagram", "tiktok", "youtube"],
    followers: 742000,
    followersText: "742K",
    engagementRate: 5.67,
    price: 12000000,
    priceText: "Rp 12.000.000",
    verified: true,
    rating: 4.9,
    fastResponse: true,
    topRated: true,
    image: "assets/images/reza_alvaro.png",
    bio: "Adventure traveler and outdoor photographer exploring hidden gems around Southeast Asia. Inspiring followers to explore nature sustainably."
  },
  {
    id: "clara-devina",
    name: "Clara Devina",
    city: "Surabaya",
    country: "Indonesia",
    category: "beauty",
    platforms: ["instagram", "tiktok"],
    followers: 318000,
    followersText: "318K",
    engagementRate: 3.12,
    price: 6500000,
    priceText: "Rp 6.500.000",
    verified: true,
    rating: 4.6,
    fastResponse: false,
    topRated: false,
    image: "assets/images/clara_devina.png",
    bio: "Professional makeup artist and beauty influencer. Focused on detailed makeup tutorials, product reviews, and skincare recommendations."
  },
  {
    id: "fahmi-ramadhan",
    name: "Fahmi Ramadhan",
    city: "Yogyakarta",
    country: "Indonesia",
    category: "tech",
    platforms: ["tiktok", "youtube"],
    followers: 410000,
    followersText: "410K",
    engagementRate: 2.89,
    price: 7500000,
    priceText: "Rp 7.500.000",
    verified: true,
    rating: 4.5,
    fastResponse: true,
    topRated: false,
    image: "assets/images/fahmi_ramadhan.png",
    bio: "Tech reviewer and digital creator explaining gadgets, camera setups, and smart home appliances in a fun, accessible way."
  },
  {
    id: "adinda-putri",
    name: "Adinda Putri",
    city: "Jakarta",
    country: "Indonesia",
    category: "food",
    platforms: ["instagram", "tiktok", "youtube"],
    followers: 620000,
    followersText: "620K",
    engagementRate: 4.85,
    price: 9000000,
    priceText: "Rp 9.000.000",
    verified: true,
    rating: 4.7,
    fastResponse: false,
    topRated: true,
    image: "assets/images/adinda_putri.png",
    bio: "Culinary explorer hunting down street food secrets and fine dining experiences in Jakarta. Sharing recipes and honest food ratings."
  },
  {
    id: "kevin-sanjaya",
    name: "Kevin Sanjaya",
    city: "Bandung",
    country: "Indonesia",
    category: "sports",
    platforms: ["instagram", "tiktok"],
    followers: 850000,
    followersText: "850K",
    engagementRate: 6.12,
    price: 15000000,
    priceText: "Rp 15.000.000",
    verified: true,
    rating: 4.9,
    fastResponse: true,
    topRated: true,
    image: "assets/images/kevin_sanjaya.png",
    bio: "Fitness trainer, marathon runner, and athletics content creator. Motivating people to lead active, energetic, and healthy lifestyles."
  },
  {
    id: "larasati-dewi",
    name: "Larasati Dewi",
    city: "Bali",
    country: "Indonesia",
    category: "travel",
    platforms: ["instagram", "tiktok"],
    followers: 490000,
    followersText: "490K",
    engagementRate: 3.98,
    price: 8500000,
    priceText: "Rp 8.500.000",
    verified: true,
    rating: 4.6,
    fastResponse: true,
    topRated: false,
    image: "assets/images/larasati_dewi.png",
    bio: "Bali-based travel guide and luxury hospitality reviewer showcasing exotic beaches, villas, and cultural events across the island."
  },
  {
    id: "andi-pratama",
    name: "Andi Pratama",
    city: "Medan",
    country: "Indonesia",
    category: "tech",
    platforms: ["instagram", "youtube"],
    followers: 280000,
    followersText: "280K",
    engagementRate: 2.45,
    price: 5000000,
    priceText: "Rp 5.000.000",
    verified: false,
    rating: 4.2,
    fastResponse: false,
    topRated: false,
    image: "assets/images/andi_pratama.png",
    bio: "Independent software developer reviewing productivity setups, keyboard builds, and programming workflows for tech enthusiasts."
  }
];

// 1.5 DATA GENERATOR FOR 1000 CREATORS
const citiesWithCoords = [
  { id: "jakarta", name: "Jakarta", lat: -6.2088, lng: 106.8456, status: "red" },
  { id: "bandung", name: "Bandung", lat: -6.9175, lng: 107.6191, status: "orange" },
  { id: "surabaya", name: "Surabaya", lat: -7.2575, lng: 112.7521, status: "green" },
  { id: "yogyakarta", name: "Yogyakarta", lat: -7.7956, lng: 110.3695, status: "green" },
  { id: "bali", name: "Bali", lat: -8.4095, lng: 115.1889, status: "green" },
  { id: "medan", name: "Medan", lat: 3.5952, lng: 98.6722, status: "green" },
  { id: "makassar", name: "Makassar", lat: -5.1477, lng: 119.4327, status: "red" },
  { id: "balikpapan", name: "Balikpapan", lat: -1.2654, lng: 116.8312, status: "green" },
  { id: "semarang", name: "Semarang", lat: -6.9667, lng: 110.4167, status: "orange" },
  { id: "palembang", name: "Palembang", lat: -2.9909, lng: 104.7567, status: "green" },
  { id: "manado", name: "Manado", lat: 1.4748, lng: 124.8428, status: "red" }
];

function generate1000Creators() {
  const maleFirstNames = ["Ahmad", "Budi", "Candra", "Dedi", "Eko", "Fajar", "Hendra", "Indra", "Joko", "Mulyadi", "Prabowo", "Rian", "Wahyu", "Yanto", "Zainal", "Hidayat", "Irfan", "Kurniawan", "Lukman", "Nugroho", "Rizky", "Taufik", "Yusuf"];
  const femaleFirstNames = ["Gita", "Kartika", "Lestari", "Novi", "Oki", "Siti", "Tri", "Utami", "Anisa", "Dewi", "Fitri", "Mega", "Putri", "Sari", "Wulandari"];
  
  const lastNames = ["Saputra", "Wibowo", "Hidayat", "Kurniawan", "Pratama", "Santoso", "Wijaya", "Siregar", "Lubis", "Nasution", "Ginting", "Panjaitan", "Simanjuntak", "Harahap", "Sitorus", "Tanjung", "Manurung", "Pohan", "Sihombing", "Pasaribu", "Setiawan", "Budiman", "Hartono", "Gunawan", "Susanto", "Nugraha", "Raharjo", "Hadi", "Kusuma", "Purnama", "Subagyo", "Prasetyo", "Firmansyah", "Dharmawan"];
  
  const bios = [
    "Creative content creator focusing on modern lifestyle, minimalism, and daily productive routines.",
    "Passionate traveler and food hunter exploring hidden culinary gems and street markets.",
    "Tech reviewer highlighting mechanical keyboards, smart desk setups, and app productivity hacks.",
    "Makeup enthusiast reviewing trending beauty products, skincare routines, and makeup tutorials.",
    "Fitness coach sharing home workout tips, macro diet plans, and weightloss journeys.",
    "Software engineer posting coding tutorials, tech interview tips, and remote work lifestyle vlog.",
    "Fashion stylist creating daily outfit inspiration, thrift haul reviews, and budget-friendly styles.",
    "Photography educator explaining camera gears, Lightroom color grading, and smartphone photo tricks."
  ];

  const categories = ["lifestyle", "travel", "beauty", "tech", "food", "sports"];
  const platformsList = [
    ["instagram"],
    ["tiktok"],
    ["youtube"],
    ["instagram", "tiktok"],
    ["instagram", "youtube"],
    ["tiktok", "youtube"],
    ["instagram", "tiktok", "youtube"]
  ];

  const asianMaleAvatars = [
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581382575275-97901c26b567?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=400&fit=crop&q=80"
  ];

  const asianFemaleAvatars = [
    "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&fit=crop&q=80"
  ];

  let count = creators.length;
  while (creators.length < 1000) {
    const cityInfo = citiesWithCoords[Math.floor(Math.random() * citiesWithCoords.length)];
    const isMale = Math.random() > 0.5;
    const fName = isMale 
      ? maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)]
      : femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
    
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${fName} ${lName}`;
    
    const id = `gen-${count}-${fName.toLowerCase()}-${lName.toLowerCase()}`;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const platforms = platformsList[Math.floor(Math.random() * platformsList.length)];
    
    const followers = Math.floor(Math.random() * 1450000) + 50000;
    const followersText = followers >= 1000000 
      ? (followers / 1000000).toFixed(1) + "M"
      : Math.floor(followers / 1000) + "K";
    
    const engagementRate = parseFloat((Math.random() * 7 + 1.5).toFixed(2));
    
    const basePrice = Math.floor(Math.random() * 19) + 1.5;
    const price = basePrice * 1000000;
    const priceText = `Rp ${basePrice.toFixed(1).replace(".0", "")}.000.000`;
    
    const verified = Math.random() > 0.45;
    const rating = parseFloat((Math.random() * 1 + 4).toFixed(1));
    const fastResponse = Math.random() > 0.4;
    const topRated = rating >= 4.8 && verified;
    
    const avatarList = isMale ? asianMaleAvatars : asianFemaleAvatars;
    const image = avatarList[Math.floor(Math.random() * avatarList.length)];
    const bio = bios[Math.floor(Math.random() * bios.length)];

    creators.push({
      id,
      name: fullName,
      city: cityInfo.name,
      country: "Indonesia",
      category,
      platforms,
      followers,
      followersText,
      engagementRate,
      price,
      priceText,
      verified,
      rating,
      fastResponse,
      topRated,
      image,
      bio
    });
    count++;
  }
}

// Generate the 1,000 creators list
generate1000Creators();

// 2. STATE VARIABLES
let selectedCreatorIds = ["reza-alvaro", "nadia-aurel"]; // Preselected as in screenshot
let currentLayout = "grid"; // grid or list
let activeFilters = {
  search: "",
  category: "all",
  platform: "all",
  location: "all",
  followers: "all",
  engagement: "all",
  price: "all",
  verified: "all",
  quickTopRated: false,
  quickFastResponse: false,
  quickVerifiedOnly: true // Preselected verified only in the screenshot
};
let sortBy = "relevance";
let currentPage = 1;
const itemsPerPage = 50;

// 3. DOM ELEMENTS
const creatorGrid = document.getElementById("creatorGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("creatorSearch");
const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebar");
const sidebarChevron = document.getElementById("sidebarChevron");
const briefBody = document.getElementById("briefBody");
const toggleBriefBtn = document.getElementById("toggleBrief");
const briefChevron = document.getElementById("briefChevron");

// Filter inputs
const filterCategory = document.getElementById("filterCategory");
const filterPlatform = document.getElementById("filterPlatform");
const filterLocation = document.getElementById("filterLocation");
const filterFollowers = document.getElementById("filterFollowers");
const filterEngagement = document.getElementById("filterEngagement");
const filterPrice = document.getElementById("filterPrice");
const filterVerified = document.getElementById("filterVerified");
const btnResetFilters = document.getElementById("btnResetFilters");
const emptyResetBtn = document.getElementById("emptyResetBtn");
const selectSortBy = document.getElementById("sortBy");

// Quick filters
const filterTopRated = document.getElementById("filterTopRated");
const filterFastResponse = document.getElementById("filterFastResponse");
const filterVerifiedOnly = document.getElementById("filterVerifiedOnly");

// Layout triggers
const layoutGrid = document.getElementById("layoutGrid");
const layoutList = document.getElementById("layoutList");

// Campaign summary nodes
const selectedCountNode = document.getElementById("selectedCount");
const actionBtnCountNode = document.getElementById("actionBtnCount");
const estimatedTotalNode = document.getElementById("estimatedTotal");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const selectedListContainer = document.getElementById("selectedListContainer");
const clearAllSelectedBtn = document.getElementById("clearAllSelected");
const btnReviewInvite = document.getElementById("btnReviewInvite");

// Modal nodes
const profileModal = document.getElementById("profileModal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModal");
const toastContainer = document.getElementById("toastContainer");

// 4. FORMATTING UTILITIES
function formatCurrency(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}

// 5. APPLICATION INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  // Sync quick filter visuals on page load
  syncQuickFilterVisuals();
  
  // Render initially
  renderCreators();
  updateCampaignPanel();
  
  // Initialize chat threads list
  renderChatList();
  renderActiveChat();
  
  // Draw map on dashboard tab
  renderCreatorMap();
  
  // Attach events
  initEventListeners();
  
  // Initialize dynamic activity stream logs
  initActivityLog();
  
  // Load icons
  if (window.lucide) {
    lucide.createIcons();
  }
});

// 6. RENDER CREATORS
function renderCreators() {
  const filteredCreators = getFilteredData();
  
  if (!creatorGrid) return;
  creatorGrid.innerHTML = "";
  
  if (filteredCreators.length === 0) {
    creatorGrid.style.display = "none";
    if (emptyState) emptyState.style.display = "flex";
    
    // Remove existing pagination container if any
    const oldPagination = document.getElementById("marketplacePagination");
    if (oldPagination) oldPagination.remove();
    return;
  }
  
  creatorGrid.style.display = "grid";
  if (emptyState) emptyState.style.display = "none";
  
  // Calculate pagination boundaries
  const totalPages = Math.ceil(filteredCreators.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredCreators.length);
  
  const itemsToRender = filteredCreators.slice(startIndex, endIndex);
  
  itemsToRender.forEach(creator => {
    const isSelected = selectedCreatorIds.includes(creator.id);
    const card = document.createElement("div");
    card.className = `creator-card-item ${isSelected ? "selected" : ""}`;
    card.setAttribute("data-id", creator.id);
    
    // Generate social platform icons markup
    const socialIconsMarkup = creator.platforms.map(platform => {
      let iconName = "instagram";
      if (platform === "tiktok") iconName = "music"; // approximation or text
      if (platform === "youtube") iconName = "youtube";
      
      // Let's output beautiful simple svgs or icons
      if (platform === "tiktok") {
        return `<span class="social-icon" title="TikTok"><svg style="width:12px; height:12px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.62 4.2 1.12.01 2.24.01 3.37.01v3.81c-1.25-.01-2.5-.23-3.65-.77-.38.79-.96 1.47-1.68 1.97-.04 4.54.02 9.07-.03 13.6-.14 2.87-2.31 5.31-5.18 5.63-2.92.51-5.96-.92-7.23-3.62-1.63-3.04-.3-7.14 2.92-8.58.74-.35 1.55-.51 2.37-.48v3.96c-.76-.09-1.54.12-2.18.57-1.12.72-1.52 2.24-.92 3.46.54 1.25 2.05 1.96 3.34 1.55 1.05-.3 1.81-1.29 1.84-2.4.03-3.87.01-7.74.02-11.61-1.89-.01-3.78.01-5.67-.01V5.72c1.97.01 3.94-.01 5.92.01.03-1.91.01-3.81.01-5.71z"/></svg></span>`;
      }
      return `<i data-lucide="${iconName}" class="social-icon" title="${platform}"></i>`;
    }).join("");
    
    // Checked indicator for active selection
    const checkedIndicator = isSelected 
      ? `<div class="selected-check-badge"><i data-lucide="check"></i></div>`
      : "";

    // Toggle button style
    const buttonText = isSelected ? "Invite to Campaign" : "View Profile";
    const buttonClass = isSelected ? "btn-card-filled" : "btn-card-outline";
    
    card.innerHTML = `
      <div class="card-image-section">
        <img src="${creator.image}" alt="${creator.name}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80'">
        ${creator.verified ? '<span class="verified-badge">Verified</span>' : ""}
        ${checkedIndicator}
        <button class="favorite-btn" aria-label="Favorite">
          <i data-lucide="heart"></i>
        </button>
      </div>
      
      <div class="card-content-section">
        <div class="card-name-row">
          <h3 class="card-name">${creator.name}</h3>
          ${creator.verified ? '<i data-lucide="check-circle" class="check-icon"></i>' : ""}
        </div>
        
        <div class="card-social-icons">
          ${socialIconsMarkup}
        </div>
        
        <div class="card-details-row">
          <span class="card-location">
            <i data-lucide="map-pin"></i>
            <span>${creator.city}, ${creator.country}</span>
          </span>
          <span class="card-tag ${creator.category}">${creator.category}</span>
        </div>
        
        <div class="card-metrics">
          <div class="metric-item">
            <span class="metric-label">Followers</span>
            <span class="metric-value">${creator.followersText}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Eng. Rate</span>
            <span class="metric-value">${creator.engagementRate}%</span>
          </div>
        </div>
        
        <div class="card-footer-row">
          <div class="price-container">
            <span class="price-label-text">Starting from</span>
            <span class="price-val">${creator.priceText}</span>
          </div>
          <button class="btn-card ${buttonClass} btn-action-trigger">${buttonText}</button>
        </div>
      </div>
    `;
    
    // Add event listeners on card buttons
    const favBtn = card.querySelector(".favorite-btn");
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      favBtn.classList.toggle("active");
      showToast(favBtn.classList.contains("active") ? "Added to favorites" : "Removed from favorites");
    });
    
    // Clicking card opens profile view unless clicking action trigger
    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn-action-trigger") || e.target.closest(".favorite-btn")) {
        return;
      }
      openProfileModal(creator);
    });
    
    const actionBtn = card.querySelector(".btn-action-trigger");
    actionBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isSelected) {
        toggleCreatorSelection(creator.id);
      } else {
        openProfileModal(creator);
      }
    });
    
    creatorGrid.appendChild(card);
  });

  // Render pagination container if totalPages > 1
  let paginationContainer = document.getElementById("marketplacePagination");
  if (!paginationContainer) {
    paginationContainer = document.createElement("div");
    paginationContainer.id = "marketplacePagination";
    paginationContainer.className = "pagination-container";
    creatorGrid.parentNode.insertBefore(paginationContainer, creatorGrid.nextSibling);
  }

  // Set pagination HTML content
  paginationContainer.innerHTML = `
    <button class="pagination-btn" id="paginationPrevBtn" ${currentPage === 1 ? "disabled" : ""}>
      <i data-lucide="chevron-left"></i>
      <span>Previous</span>
    </button>
    <span class="pagination-info" id="paginationInfoText">
      Page ${currentPage} of ${totalPages} • Showing ${startIndex + 1}-${endIndex} of ${filteredCreators.length} KOLs
    </span>
    <button class="pagination-btn" id="paginationNextBtn" ${currentPage === totalPages ? "disabled" : ""}>
      <span>Next</span>
      <i data-lucide="chevron-right"></i>
    </button>
  `;

  // Bind click handlers to pagination buttons
  const prevBtn = document.getElementById("paginationPrevBtn");
  const nextBtn = document.getElementById("paginationNextBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderCreators();
        scrollToFilters();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderCreators();
        scrollToFilters();
      }
    });
  }
  
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Smooth scroll helper
function scrollToFilters() {
  const filterSection = document.querySelector(".filters-section");
  if (filterSection) {
    filterSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}



// 7. GET FILTERED & SORTED DATA
function getFilteredData() {
  let result = [...creators];
  
  // Search filter
  if (activeFilters.search) {
    const q = activeFilters.search.toLowerCase();
    result = result.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.city.toLowerCase().includes(q) || 
      c.category.toLowerCase().includes(q)
    );
  }
  
  // Category dropdown filter
  if (activeFilters.category !== "all") {
    result = result.filter(c => c.category === activeFilters.category);
  }
  
  // Platform dropdown filter
  if (activeFilters.platform !== "all") {
    result = result.filter(c => c.platforms.includes(activeFilters.platform));
  }
  
  // Location dropdown filter
  if (activeFilters.location !== "all") {
    result = result.filter(c => c.city.toLowerCase() === activeFilters.location);
  }
  
  // Followers range dropdown filter
  if (activeFilters.followers !== "all") {
    if (activeFilters.followers === "0-300k") {
      result = result.filter(c => c.followers < 300000);
    } else if (activeFilters.followers === "300k-500k") {
      result = result.filter(c => c.followers >= 300000 && c.followers <= 500000);
    } else if (activeFilters.followers === "500k-700k") {
      result = result.filter(c => c.followers >= 500000 && c.followers <= 700000);
    } else if (activeFilters.followers === "700k+") {
      result = result.filter(c => c.followers > 700000);
    }
  }
  
  // Engagement range dropdown filter
  if (activeFilters.engagement !== "all") {
    if (activeFilters.engagement === "0-3%") {
      result = result.filter(c => c.engagementRate < 3.0);
    } else if (activeFilters.engagement === "3-4%") {
      result = result.filter(c => c.engagementRate >= 3.0 && c.engagementRate <= 4.0);
    } else if (activeFilters.engagement === "4-5%") {
      result = result.filter(c => c.engagementRate >= 4.0 && c.engagementRate <= 5.0);
    } else if (activeFilters.engagement === "5%+") {
      result = result.filter(c => c.engagementRate > 5.0);
    }
  }
  
  // Price range dropdown filter
  if (activeFilters.price !== "all") {
    if (activeFilters.price === "0-7m") {
      result = result.filter(c => c.price < 7000000);
    } else if (activeFilters.price === "7m-10m") {
      result = result.filter(c => c.price >= 7000000 && c.price <= 10000000);
    } else if (activeFilters.price === "10m-13m") {
      result = result.filter(c => c.price >= 10000000 && c.price <= 13000000);
    } else if (activeFilters.price === "13m+") {
      result = result.filter(c => c.price > 13000000);
    }
  }
  
  // Verified dropdown filter
  if (activeFilters.verified !== "all") {
    const wantsVerified = activeFilters.verified === "yes";
    result = result.filter(c => c.verified === wantsVerified);
  }
  
  // Quick top rated badge filter
  if (activeFilters.quickTopRated) {
    result = result.filter(c => c.topRated);
  }
  
  // Quick fast response badge filter
  if (activeFilters.quickFastResponse) {
    result = result.filter(c => c.fastResponse);
  }
  
  // Quick verified only badge filter
  if (activeFilters.quickVerifiedOnly) {
    result = result.filter(c => c.verified);
  }
  
  // SORT LOGIC
  if (sortBy === "followers-desc") {
    result.sort((a, b) => b.followers - a.followers);
  } else if (sortBy === "followers-asc") {
    result.sort((a, b) => a.followers - b.followers);
  } else if (sortBy === "engagement-desc") {
    result.sort((a, b) => b.engagementRate - a.engagementRate);
  } else if (sortBy === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } // 'relevance' maintains base list ordering
  
  return result;
}

// 8. UPDATE CAMPAIGN PANEL (RIGHT SIDEBAR)
function updateCampaignPanel() {
  const selectedCount = selectedCreatorIds.length;
  const maxAllowed = 5;
  
  // Update badges
  selectedCountNode.textContent = selectedCount;
  actionBtnCountNode.textContent = selectedCount;
  
  // Update progress bar
  const progressPercent = Math.min((selectedCount / maxAllowed) * 100, 100);
  progressFill.style.width = `${progressPercent}%`;
  progressText.textContent = `${selectedCount} / ${maxAllowed} creators selected`;
  
  // Sum cost
  let totalCost = 0;
  selectedListContainer.innerHTML = "";
  
  if (selectedCount === 0) {
    selectedListContainer.innerHTML = `
      <div class="empty-selection-msg" style="padding: 20px 0; text-align: center; color: var(--text-light); font-size: 12px;">
        No creators selected yet.
      </div>
    `;
    estimatedTotalNode.textContent = formatCurrency(0);
    return;
  }
  
  // Render selected creators in list
  selectedCreatorIds.forEach(id => {
    const creator = creators.find(c => c.id === id);
    if (!creator) return;
    
    totalCost += creator.price;
    
    const row = document.createElement("div");
    row.className = "selected-row-item";
    row.innerHTML = `
      <div class="selected-row-info">
        <img src="${creator.image}" alt="${creator.name}" class="selected-row-avatar" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80'">
        <div class="selected-row-text">
          <div class="selected-row-name-line">
            <span class="selected-row-name">${creator.name}</span>
            ${creator.verified ? '<i data-lucide="check-circle" style="width: 12px; height: 12px; fill: var(--primary-light); color: var(--primary);"></i>' : ""}
          </div>
          <span class="selected-row-metrics">${creator.followersText} • ${creator.engagementRate}%</span>
          <span class="selected-row-price">${creator.priceText}</span>
        </div>
      </div>
      <button class="btn-remove-selected" data-id="${creator.id}" aria-label="Remove creator">
        <i data-lucide="x"></i>
      </button>
    `;
    
    // Attach remove event
    row.querySelector(".btn-remove-selected").addEventListener("click", () => {
      toggleCreatorSelection(creator.id);
    });
    
    selectedListContainer.appendChild(row);
  });
  
  estimatedTotalNode.textContent = formatCurrency(totalCost);
  
  if (window.lucide) {
    lucide.createIcons();
  }
}

// 9. TOGGLE CREATOR SELECTION
function toggleCreatorSelection(id) {
  const index = selectedCreatorIds.indexOf(id);
  const creator = creators.find(c => c.id === id);
  
  if (index > -1) {
    selectedCreatorIds.splice(index, 1);
    showToast(`Removed ${creator?.name} from campaign`);
    addActivityLog(`Removed <strong>${creator?.name}</strong> from selection list.`, "danger");
  } else {
    if (selectedCreatorIds.length >= 5) {
      showToast("Maximum of 5 creators can be selected for this campaign brief", "warning");
      return;
    }
    selectedCreatorIds.push(id);
    showToast(`Added ${creator?.name} to campaign`, "success");
    addActivityLog(`Added <strong>${creator?.name}</strong> (${creator?.followersText} followers) to campaign selection.`, "success");
  }
  
  // Update views
  renderCreators();
  updateCampaignPanel();
}

// 10. MODAL PROFILE DIALOGUE
function openProfileModal(creator) {
  const isSelected = selectedCreatorIds.includes(creator.id);
  const actionBtnText = isSelected ? "Remove from Brief" : "Invite to Campaign";
  const actionBtnClass = isSelected ? "btn-outline-orange" : "btn-primary";
  
  const socialBadges = creator.platforms.map(p => {
    return `<span class="modal-platform-badge"><i data-lucide="${p === 'tiktok' ? 'music' : p}"></i> ${p.charAt(0).toUpperCase() + p.slice(1)}</span>`;
  }).join("");
  
  modalBody.innerHTML = `
    <div class="modal-profile-header">
      <img src="${creator.image}" alt="${creator.name}" class="modal-profile-avatar" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80'">
      <div class="modal-profile-info">
        <h2 class="modal-profile-name">
          ${creator.name}
          ${creator.verified ? '<i data-lucide="check-circle" style="fill: var(--primary-light); color: var(--primary);"></i>' : ""}
        </h2>
        <span class="modal-profile-title">${creator.city}, ${creator.country} • ${creator.category.charAt(0).toUpperCase() + creator.category.slice(1)}</span>
      </div>
    </div>
    
    <div class="modal-stats-grid">
      <div class="modal-stat-item">
        <span class="modal-stat-label">Followers</span>
        <span class="modal-stat-value">${creator.followersText}</span>
      </div>
      <div class="modal-stat-item">
        <span class="modal-stat-label">Engagement</span>
        <span class="modal-stat-value">${creator.engagementRate}%</span>
      </div>
      <div class="modal-stat-item">
        <span class="modal-stat-label">Rating</span>
        <span class="modal-stat-value">⭐ ${creator.rating}</span>
      </div>
    </div>
    
    <h3 class="modal-section-title">About Creator</h3>
    <p class="modal-bio">${creator.bio}</p>
    
    <h3 class="modal-section-title">Active Platforms</h3>
    <div class="modal-platforms-row">
      ${socialBadges}
    </div>
    
    <div class="modal-footer">
      <div class="price-container" style="margin-right: auto;">
        <span class="price-label-text">Starting Price</span>
        <span class="price-val" style="font-size: 16px;">${creator.priceText}</span>
      </div>
      <button class="btn btn-outline-blue" id="modalMessageBtn" style="display: flex; align-items: center; gap: 4px;">
        <i data-lucide="message-square" style="width: 14px; height: 14px;"></i>
        <span>Chat</span>
      </button>
      <button class="btn btn-outline-blue" id="modalCloseBtn">Close</button>
      <button class="btn ${actionBtnClass}" id="modalActionBtn">${actionBtnText}</button>
    </div>
  `;
  
  profileModal.style.display = "flex";
  
  // Bind actions inside modal
  document.getElementById("modalCloseBtn").addEventListener("click", closeProfileModal);
  
  document.getElementById("modalMessageBtn").addEventListener("click", () => {
    closeProfileModal();
    // Switch to Messages Tab
    const messagesTabItem = Array.from(document.querySelectorAll(".nav-item")).find(item => {
      const span = item.querySelector("span");
      return span && span.textContent.trim() === "Messages";
    });
    if (messagesTabItem) {
      messagesTabItem.click();
    }
    // Select this creator's chat thread
    getOrCreateChatThread(creator.id);
    selectChat(creator.id);
  });
  
  const modalActionBtn = document.getElementById("modalActionBtn");
  modalActionBtn.addEventListener("click", () => {
    toggleCreatorSelection(creator.id);
    closeProfileModal();
  });
  
  if (window.lucide) {
    lucide.createIcons();
  }
}

function closeProfileModal() {
  profileModal.style.display = "none";
}

// 11. TOAST NOTIFICATION ENGINE
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let iconName = "check-circle";
  if (type === "warning") iconName = "alert-triangle";
  if (type === "info") iconName = "info";
  
  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  if (window.lucide) {
    lucide.createIcons();
  }
  
  // Auto remove
  setTimeout(() => {
    toast.style.animation = "fadeIn 0.2s reverse ease-out";
    setTimeout(() => {
      toast.remove();
    }, 200);
  }, 3000);
}

// 12. EVENT LISTENERS INITIALIZATION
function initEventListeners() {
  // Search bar input filter
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeFilters.search = e.target.value;
      currentPage = 1;
      renderCreators();
    });
    searchInput.addEventListener("change", (e) => {
      const val = e.target.value.trim();
      if (val) {
        addActivityLog(`Search query executed: "<strong>${val}</strong>".`, "info");
      }
    });
  }
  
  // Shortcut key '/' focusing search bar
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

  // Dropdown filter events
  if (filterCategory) {
    filterCategory.addEventListener("change", (e) => {
      activeFilters.category = e.target.value;
      currentPage = 1;
      renderCreators();
      addActivityLog(`Category filter updated to: <strong>${e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)}</strong>.`, "info");
    });
  }
  
  if (filterPlatform) {
    filterPlatform.addEventListener("change", (e) => {
      activeFilters.platform = e.target.value;
      currentPage = 1;
      renderCreators();
      addActivityLog(`Platform filter updated to: <strong>${e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)}</strong>.`, "info");
    });
  }
  
  if (filterLocation) {
    filterLocation.addEventListener("change", (e) => {
      activeFilters.location = e.target.value;
      currentPage = 1;
      renderCreators();
      addActivityLog(`Location filter updated to: <strong>${e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)}</strong>.`, "info");
    });
  }
  
  if (filterFollowers) {
    filterFollowers.addEventListener("change", (e) => {
      activeFilters.followers = e.target.value;
      currentPage = 1;
      renderCreators();
    });
  }
  
  if (filterEngagement) {
    filterEngagement.addEventListener("change", (e) => {
      activeFilters.engagement = e.target.value;
      currentPage = 1;
      renderCreators();
    });
  }
  
  if (filterPrice) {
    filterPrice.addEventListener("change", (e) => {
      activeFilters.price = e.target.value;
      currentPage = 1;
      renderCreators();
    });
  }
  
  if (filterVerified) {
    filterVerified.addEventListener("change", (e) => {
      activeFilters.verified = e.target.value;
      currentPage = 1;
      renderCreators();
    });
  }
  
  // Reset buttons
  const resetAllFiltersFn = () => {
    activeFilters = {
      search: "",
      category: "all",
      platform: "all",
      location: "all",
      followers: "all",
      engagement: "all",
      price: "all",
      verified: "all",
      quickTopRated: false,
      quickFastResponse: false,
      quickVerifiedOnly: false
    };
    
    // Sync forms
    if (searchInput) searchInput.value = "";
    if (filterCategory) filterCategory.value = "all";
    if (filterPlatform) filterPlatform.value = "all";
    if (filterLocation) filterLocation.value = "all";
    if (filterFollowers) filterFollowers.value = "all";
    if (filterEngagement) filterEngagement.value = "all";
    if (filterPrice) filterPrice.value = "all";
    if (filterVerified) filterVerified.value = "all";
    
    currentPage = 1;
    syncQuickFilterVisuals();
    renderCreators();
    showToast("All filters have been reset", "info");
  };
  
  if (btnResetFilters) btnResetFilters.addEventListener("click", resetAllFiltersFn);
  if (emptyResetBtn) emptyResetBtn.addEventListener("click", resetAllFiltersFn);
  
  // Sorting event
  if (selectSortBy) {
    selectSortBy.addEventListener("change", (e) => {
      sortBy = e.target.value;
      currentPage = 1;
      renderCreators();
    });
  }

  // Quick filter buttons
  if (filterTopRated) {
    filterTopRated.addEventListener("click", () => {
      activeFilters.quickTopRated = !activeFilters.quickTopRated;
      filterTopRated.classList.toggle("active");
      currentPage = 1;
      renderCreators();
    });
  }
  
  if (filterFastResponse) {
    filterFastResponse.addEventListener("click", () => {
      activeFilters.quickFastResponse = !activeFilters.quickFastResponse;
      filterFastResponse.classList.toggle("active");
      currentPage = 1;
      renderCreators();
    });
  }
  
  if (filterVerifiedOnly) {
    filterVerifiedOnly.addEventListener("click", () => {
      activeFilters.quickVerifiedOnly = !activeFilters.quickVerifiedOnly;
      filterVerifiedOnly.classList.toggle("active");
      currentPage = 1;
      renderCreators();
    });
  }

  // Layout triggers
  if (layoutGrid) {
    layoutGrid.addEventListener("click", () => {
      currentLayout = "grid";
      layoutGrid.classList.add("active");
      if (layoutList) layoutList.classList.remove("active");
      if (creatorGrid) creatorGrid.classList.remove("list-view");
      renderCreators();
    });
  }
  
  if (layoutList) {
    layoutList.addEventListener("click", () => {
      currentLayout = "list";
      layoutList.classList.add("active");
      if (layoutGrid) layoutGrid.classList.remove("active");
      if (creatorGrid) creatorGrid.classList.add("list-view");
      renderCreators();
    });
  }

  // Clear all selections
  if (clearAllSelectedBtn) {
    clearAllSelectedBtn.addEventListener("click", () => {
      if (selectedCreatorIds.length === 0) return;
      selectedCreatorIds = [];
      renderCreators();
      updateCampaignPanel();
      showToast("Cleared all selected creators", "info");
    });
  }

  // Review & Invite primary action
  if (btnReviewInvite) {
    btnReviewInvite.addEventListener("click", () => {
      if (selectedCreatorIds.length === 0) {
        showToast("Please select at least one creator to invite.", "warning");
        return;
      }
      const names = selectedCreatorIds.map(id => creators.find(c => c.id === id)?.name).join(", ");
      showToast(`Invitation brief sent to: ${names}!`, "success");
    });
  }

  // Sidebar toggle action
  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener("click", () => {
      if (sidebar) sidebar.classList.toggle("collapsed");
      
      // Change icon rotation
      if (sidebarChevron && sidebar) {
        if (sidebar.classList.contains("collapsed")) {
          sidebarChevron.setAttribute("data-lucide", "chevron-right");
        } else {
          sidebarChevron.setAttribute("data-lucide", "chevron-left");
        }
      }
      
      if (window.lucide) {
        lucide.createIcons();
      }
    });
  }

  // Brief panel collapse action
  if (toggleBriefBtn) {
    toggleBriefBtn.addEventListener("click", () => {
      if (briefBody) briefBody.classList.toggle("collapsed");
      
      if (briefChevron && briefBody) {
        if (briefBody.classList.contains("collapsed")) {
          briefChevron.setAttribute("data-lucide", "chevron-down");
        } else {
          briefChevron.setAttribute("data-lucide", "chevron-up");
        }
      }
      
      if (window.lucide) {
        lucide.createIcons();
      }
    });
  }

  // Modal overlay click to close
  if (profileModal) {
    profileModal.addEventListener("click", (e) => {
      if (e.target === profileModal) {
        closeProfileModal();
      }
    });
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeProfileModal);
  }
  
  // Sidebar items click handler (View Switching & Blue Highlight)
  const navItems = document.querySelectorAll(".nav-item");
  const viewMap = {
    "Dashboard": "dashboardView",
    "Marketplace": "marketplaceView",
    "Campaigns": "campaignsView",
    "Analytics": "analyticsView",
    "Media Monitoring": "mediaMonitoringView",
    "Messages": "messagesView",
    "Payments": "paymentsView",
    "Settings": "settingsView"
  };

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const tabName = item.querySelector("span").textContent.trim();
      const targetViewId = viewMap[tabName];
      if (!targetViewId) return;

      // Update active nav class (causes active blue highlight)
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      // Hide all views
      Object.values(viewMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      });

      // Show selected view
      const targetView = document.getElementById(targetViewId);
      if (targetView) {
        targetView.style.display = (targetViewId === "messagesView" || targetViewId === "settingsView") ? "flex" : "block";
      }

      // Draw map on dashboard tab
      if (targetViewId === "dashboardView") {
        renderCreatorMap();
      }

      // Hide/Show right panel (Campaign Brief) depending on the view
      const rightPanel = document.querySelector(".right-panel");
      if (rightPanel) {
        if (targetViewId === "marketplaceView" || targetViewId === "campaignsView") {
          rightPanel.style.display = "flex";
        } else {
          rightPanel.style.display = "none";
        }
      }

      // Hide/Show top-bar center filters
      const topbarCenter = document.querySelector(".topbar-center");
      if (topbarCenter) {
        topbarCenter.style.display = (targetViewId === "marketplaceView") ? "flex" : "none";
      }

      if (window.lucide) {
        lucide.createIcons();
      }

      showToast(`Switched view to ${tabName}`, "info");
    });
  });

  // Chat message send listener
  const btnSendChat = document.getElementById("btnSendChatMessage");
  if (btnSendChat) {
    btnSendChat.addEventListener("click", handleSendChatMessage);
  }
  const chatInputEl = document.getElementById("chatInputMessage");
  if (chatInputEl) {
    chatInputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleSendChatMessage();
      }
    });
  }

  // Chat search input listener
  const chatSearch = document.getElementById("chatSearchInput");
  if (chatSearch) {
    chatSearch.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const rows = document.querySelectorAll("#chatList .chat-item-row");
      rows.forEach(row => {
        const name = row.querySelector(".chat-item-name").textContent.toLowerCase();
        row.style.display = name.includes(query) ? "flex" : "none";
      });
    });
  }

  // Campaign tab buttons filtering
  const campaignTabs = document.querySelectorAll(".campaign-tab-btn");
  campaignTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      campaignTabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");
      const campaignCards = document.querySelectorAll("#campaignsGrid .campaign-card");

      campaignCards.forEach(card => {
        const cardStatus = card.getAttribute("data-status");
        if (filterValue === "all" || cardStatus === filterValue) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Settings sub-tab navigation
  const settingsTabLinks = document.querySelectorAll(".settings-tab-link");
  settingsTabLinks.forEach(link => {
    link.addEventListener("click", () => {
      settingsTabLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      const targetTab = link.getAttribute("data-settings-tab");
      const paneIds = ["profile", "notifications", "security"];
      paneIds.forEach(id => {
        const pane = document.getElementById(`settings-pane-${id}`);
        if (pane) {
          pane.style.display = (id === targetTab) ? "block" : "none";
        }
      });
    });
  });

  // Settings Save profile listener
  const btnSaveProfileSettings = document.getElementById("btnSaveProfileSettings");
  if (btnSaveProfileSettings) {
    btnSaveProfileSettings.addEventListener("click", () => {
      const settingsNameEl = document.getElementById("settingsName");
      const settingsRoleEl = document.getElementById("settingsRole");
      const settingsEmailEl = document.getElementById("settingsEmail");
      const settingsAgencyEl = document.getElementById("settingsAgency");
      
      const nameVal = settingsNameEl ? settingsNameEl.value.trim() : "";
      const roleVal = settingsRoleEl ? settingsRoleEl.value.trim() : "";
      const emailVal = settingsEmailEl ? settingsEmailEl.value.trim() : "";
      const agencyVal = settingsAgencyEl ? settingsAgencyEl.value.trim() : "";

      if (!nameVal || !roleVal || !emailVal || !agencyVal) {
        showToast("Please fill in all profile fields.", "warning");
        return;
      }

      // Sync topbar brand user info
      const topbarName = document.querySelector(".user-name");
      const topbarRole = document.querySelector(".user-role");
      if (topbarName) topbarName.textContent = nameVal;
      if (topbarRole) topbarRole.textContent = roleVal;

      showToast("Workspace profile settings saved!", "success");
    });
  }

  // Settings Security settings save listener
  const btnSaveSecuritySettings = document.getElementById("btnSaveSecuritySettings");
  if (btnSaveSecuritySettings) {
    btnSaveSecuritySettings.addEventListener("click", () => {
      showToast("Security credentials updated!", "success");
    });
  }

  // Settings 2FA Toggle simulation
  const btnToggle2FA = document.getElementById("btnToggle2FA");
  if (btnToggle2FA) {
    btnToggle2FA.addEventListener("click", () => {
      const isEnabled = btnToggle2FA.textContent.trim() === "Disable 2FA";
      if (isEnabled) {
        btnToggle2FA.textContent = "Enable 2FA";
        btnToggle2FA.className = "btn btn-outline-blue btn-sm";
        showToast("Two-Factor Authentication disabled.", "info");
      } else {
        btnToggle2FA.textContent = "Disable 2FA";
        btnToggle2FA.className = "btn btn-outline-orange btn-sm";
        showToast("Two-Factor Authentication is active!", "success");
      }
    });
  }

  // Invoice download action listeners
  document.querySelectorAll(".invoice-download-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const invId = btn.getAttribute("id");
      showToast(`Downloading invoice report ${invId ? invId.toUpperCase() : "REPORT"}...`, "success");
    });
  });

  // Saved corporate bank card action listener
  const btnAddCardMock = document.getElementById("btnAddCardMock");
  if (btnAddCardMock) {
    btnAddCardMock.addEventListener("click", () => {
      showToast("Card management restricted to workspace admins.", "warning");
    });
  }

  // Campaign create action listener
  const btnCreateCampaign = document.getElementById("btnCreateCampaign");
  if (btnCreateCampaign) {
    btnCreateCampaign.addEventListener("click", () => {
      showToast("Campaign creation wizard available in standard plans.", "info");
    });
  }

  // Add more button response
  const addMoreBtn = document.getElementById("addMoreBtn");
  if (addMoreBtn) {
    addMoreBtn.addEventListener("click", () => {
      if (searchInput) searchInput.focus();
      showToast("Use the search bar or filters to find more creators!", "info");
    });
  }
}

// ==========================================================================
// MESSAGING AND CHAT LOGIC IMPLEMENTATION
// ==========================================================================
const initialChats = [
  {
    creatorId: "nadia-aurel",
    unreadCount: 3,
    messages: [
      { sender: "creator", text: "Hi Arif! Hope you're doing well.", time: "Yesterday, 2:14 PM" },
      { sender: "brand", text: "Hi Nadia! We'd love to invite you to our Summer Getaway campaign.", time: "Yesterday, 3:00 PM" },
      { sender: "creator", text: "I looked over the campaign details and budget. It sounds like a perfect fit!", time: "Today, 9:30 AM" },
      { sender: "creator", text: "Do you have the brand guidelines ready? I can start drafting the Instagram reel concepts.", time: "Today, 9:31 AM" },
      { sender: "creator", text: "Let me know when we can hop on a quick briefing call.", time: "Today, 9:35 AM" }
    ]
  },
  {
    creatorId: "reza-alvaro",
    unreadCount: 2,
    messages: [
      { sender: "brand", text: "Hey Reza! How is the outdoor photography going? Let's talk about the Bali travel series.", time: "Yesterday, 10:00 AM" },
      { sender: "creator", text: "Hi Arif, sounds exciting! Bali is always beautiful.", time: "Today, 8:15 AM" },
      { sender: "creator", text: "Can we adjust the timeline slightly? I have another tech unboxing campaign ending on the 5th, so starting on the 8th would be ideal.", time: "Today, 8:16 AM" }
    ]
  },
  {
    creatorId: "clara-devina",
    unreadCount: 4,
    messages: [
      { sender: "brand", text: "Hi Clara, did you get the beauty sample pack we shipped last week?", time: "2 days ago" },
      { sender: "creator", text: "Hi! Yes, I received it. The packaging looks stunning.", time: "Yesterday, 11:00 AM" },
      { sender: "creator", text: "I've uploaded the draft video to the drive. Let me know if you need any edits on the makeup shade.", time: "Today, 10:10 AM" },
      { sender: "creator", text: "I focus a lot on the hydration test in the second half of the video.", time: "Today, 10:11 AM" },
      { sender: "creator", text: "Also, I've listed the pricing for an extra TikTok post if you're interested.", time: "Today, 10:15 AM" },
      { sender: "creator", text: "Let me know your thoughts!", time: "Today, 10:20 AM" }
    ]
  },
  {
    creatorId: "fahmi-ramadhan",
    unreadCount: 3,
    messages: [
      { sender: "brand", text: "Hi Fahmi, let's coordinate on the keyboard review videos.", time: "3 days ago" },
      { sender: "creator", text: "Sure, let's do it.", time: "Yesterday, 4:00 PM" },
      { sender: "creator", text: "Do you want the tech unboxing to focus more on gaming features or office productivity?", time: "Today, 11:00 AM" },
      { sender: "creator", text: "I find that gaming content gets slightly higher engagement on TikTok.", time: "Today, 11:02 AM" },
      { sender: "creator", text: "Let me know so I can tailor the script hooks.", time: "Today, 11:05 AM" }
    ]
  }
];

let chatChannels = [...initialChats];
let activeChatCreatorId = null;

function getOrCreateChatThread(creatorId) {
  let thread = chatChannels.find(c => c.creatorId === creatorId);
  if (!thread) {
    thread = {
      creatorId: creatorId,
      unreadCount: 0,
      messages: [
        { sender: "creator", text: "Hi Arif! Let's talk about the campaign brief details.", time: "Just now" }
      ]
    };
    chatChannels.unshift(thread); // Put new chat at top
  }
  return thread;
}

function renderChatList() {
  const chatListContainer = document.getElementById("chatList");
  if (!chatListContainer) return;

  chatListContainer.innerHTML = "";

  chatChannels.forEach(channel => {
    const creator = creators.find(c => c.id === channel.creatorId);
    if (!creator) return;

    const lastMsg = channel.messages[channel.messages.length - 1];
    const lastMsgText = lastMsg ? lastMsg.text : "";
    const lastMsgTime = lastMsg ? lastMsg.time : "";
    const isActive = activeChatCreatorId === creator.id;

    const chatRow = document.createElement("div");
    chatRow.className = `chat-item-row ${isActive ? "active" : ""}`;
    chatRow.innerHTML = `
      <div class="chat-avatar-wrapper">
        <img src="${creator.image}" class="chat-avatar" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80'">
        <span class="status-dot online"></span>
      </div>
      <div class="chat-item-info">
        <div class="chat-item-name-row">
          <span class="chat-item-name">${creator.name}</span>
          <span class="chat-item-time">${lastMsgTime}</span>
        </div>
        <div class="chat-item-msg-row">
          <span class="chat-item-preview">${lastMsgText}</span>
          ${channel.unreadCount > 0 ? `<span class="badge badge-orange chat-unread-dot"></span>` : ""}
        </div>
      </div>
    `;

    chatRow.addEventListener("click", () => {
      selectChat(creator.id);
    });

    chatListContainer.appendChild(chatRow);
  });

  updateTotalUnreadBadge();
}

function selectChat(creatorId) {
  activeChatCreatorId = creatorId;
  const channel = chatChannels.find(c => c.creatorId === creatorId);
  if (channel) {
    channel.unreadCount = 0; // mark as read
  }

  renderChatList();
  renderActiveChat();
}

function renderActiveChat() {
  const chatEmptyState = document.getElementById("chatEmptyState");
  const chatActivePane = document.getElementById("chatActivePane");
  
  if (!chatEmptyState || !chatActivePane) return;

  if (!activeChatCreatorId) {
    chatEmptyState.style.display = "flex";
    chatActivePane.style.display = "none";
    return;
  }

  chatEmptyState.style.display = "none";
  chatActivePane.style.display = "flex";

  const creator = creators.find(c => c.id === activeChatCreatorId);
  const channel = chatChannels.find(c => c.creatorId === activeChatCreatorId);
  if (!creator || !channel) return;

  // Header update
  document.getElementById("chatHeaderAvatar").src = creator.image;
  document.getElementById("chatHeaderName").textContent = creator.name;
  document.getElementById("chatHeaderSubtext").textContent = creator.fastResponse ? "Online • Responds within minutes" : "Online";

  // Bind view profile inside chat
  const viewProfileBtn = document.getElementById("btnChatViewProfile");
  if (viewProfileBtn) {
    viewProfileBtn.onclick = () => openProfileModal(creator);
  }

  // Messages log update
  const messagesBody = document.getElementById("chatMessagesBody");
  messagesBody.innerHTML = "";

  channel.messages.forEach(msg => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${msg.sender === "brand" ? "outgoing" : "incoming"}`;
    bubble.innerHTML = `
      <span>${escapeHTML(msg.text)}</span>
      <span class="chat-meta-time">${msg.time}</span>
    `;
    messagesBody.appendChild(bubble);
  });

  // Scroll to bottom
  messagesBody.scrollTop = messagesBody.scrollHeight;
}

function escapeHTML(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function updateTotalUnreadBadge() {
  const totalUnread = chatChannels.reduce((sum, c) => sum + c.unreadCount, 0);
  
  // Update Messages tab badge in the sidebar
  const sidebarNavItems = document.querySelectorAll(".nav-item");
  sidebarNavItems.forEach(item => {
    const span = item.querySelector("span");
    if (span && span.textContent.trim() === "Messages") {
      let badge = item.querySelector(".badge");
      if (badge) {
        badge.textContent = totalUnread;
        badge.style.display = totalUnread > 0 ? "inline-block" : "none";
      }
    }
  });

  // Update Messages view header badge
  const chatHeaderBadge = document.getElementById("messagesChatCount");
  if (chatHeaderBadge) {
    chatHeaderBadge.textContent = `${totalUnread} Unread`;
    chatHeaderBadge.style.display = totalUnread > 0 ? "inline-block" : "none";
  }
}

function handleSendChatMessage() {
  const inputEl = document.getElementById("chatInputMessage");
  if (!inputEl) return;

  const text = inputEl.value.trim();
  if (!text) return;

  const channel = chatChannels.find(c => c.creatorId === activeChatCreatorId);
  if (!channel) return;

  // Add outgoing message
  channel.messages.push({
    sender: "brand",
    text: text,
    time: "Just now"
  });

  inputEl.value = "";
  renderActiveChat();
  renderChatList();

  // Trigger automated simulation response
  const currentCreatorId = activeChatCreatorId;
  const creator = creators.find(c => c.id === currentCreatorId);
  
  setTimeout(() => {
    const updatedChannel = chatChannels.find(c => c.creatorId === currentCreatorId);
    if (!updatedChannel) return;

    const autoReplies = [
      `Thanks for messaging, Arif! Let me review the brief and I'll send you a custom draft proposal.`,
      `Awesome. I'm checking my content calendar for June and I definitely have slot availability. Let's do it!`,
      `Sounds good. I can structure the Instagram reel exactly how you suggested. Let's discuss onboarding contracts next.`,
      `Got it, Arif! That makes total sense. I'll make sure the tech unboxing highlights the key features you mentioned.`,
      `I've noted that down. Talk to you soon!`
    ];
    const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

    updatedChannel.messages.push({
      sender: "creator",
      text: randomReply,
      time: "Just now"
    });

    if (activeChatCreatorId !== currentCreatorId) {
      updatedChannel.unreadCount += 1;
    }

    renderChatList();
    if (activeChatCreatorId === currentCreatorId) {
      renderActiveChat();
    }
    
    showToast(`New message from ${creator ? creator.name : 'Creator'}`, "info");
  }, 1500);
}

// SYNC QUICK FILTERS VISUALS WITH STATE
function syncQuickFilterVisuals() {
  if (filterTopRated) {
    if (activeFilters.quickTopRated) {
      filterTopRated.classList.add("active");
    } else {
      filterTopRated.classList.remove("active");
    }
  }

  if (filterFastResponse) {
    if (activeFilters.quickFastResponse) {
      filterFastResponse.classList.add("active");
    } else {
      filterFastResponse.classList.remove("active");
    }
  }

  if (filterVerifiedOnly) {
    if (activeFilters.quickVerifiedOnly) {
      filterVerifiedOnly.classList.add("active");
    } else {
      filterVerifiedOnly.classList.remove("active");
    }
  }
}

// ==========================================================================
// INDONESIA GEOGRAPHIC CREATOR MAP LOGIC
// ==========================================================================
let leafletMap = null;
let leafletMarkers = [];

function renderCreatorMap() {
  const mapContainer = document.getElementById("indonesiaMap");
  const legendList = document.getElementById("mapLegendList");

  if (!mapContainer || !legendList) return;

  // 1. Calculate density counts by city
  const cityCounts = {};
  citiesWithCoords.forEach(c => {
    cityCounts[c.id] = 0;
  });

  creators.forEach(creator => {
    const cityId = creator.city.toLowerCase();
    if (cityCounts[cityId] !== undefined) {
      cityCounts[cityId]++;
    }
  });

  // Sort cities by density to list top ones in the legend
  const sortedCities = [...citiesWithCoords].sort((a, b) => cityCounts[b.id] - cityCounts[a.id]);

  // 2. Initialize Leaflet Map if it hasn't been initialized
  if (!leafletMap) {
    leafletMap = L.map('indonesiaMap', {
      zoomControl: true
    }).setView([-2.5, 118.0], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(leafletMap);

    setTimeout(() => {
      leafletMap.invalidateSize();
    }, 100);
  } else {
    // If it exists, clear existing markers
    leafletMarkers.forEach(marker => leafletMap.removeLayer(marker));
    leafletMarkers = [];
    
    // Invalidate size to ensure Leaflet renders correctly after display state toggles
    setTimeout(() => {
      leafletMap.invalidateSize();
    }, 100);
  }

  // 3. Render Leaflet Markers
  citiesWithCoords.forEach(city => {
    const count = cityCounts[city.id];
    if (count === 0) return;

    // Custom icon HTML based on status
    const isWarning = city.status === "red" || city.status === "orange";
    const iconName = isWarning ? "alert-triangle" : "user";
    
    const iconHtml = `
      <div class="marker-container ${city.status}">
        ${isWarning ? '<div class="marker-glow"></div>' : ''}
        <div class="marker-circle">
          <i data-lucide="${iconName}"></i>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: iconHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([city.lat, city.lng], { icon: customIcon }).addTo(leafletMap);
    
    // Custom tooltip
    marker.bindTooltip(`<strong>${city.name}</strong><br>${count.toLocaleString()} Creators`, {
      direction: 'top',
      offset: [0, -10]
    });

    // Clicking redirects to filtered Marketplace
    marker.on('click', () => {
      filterMarketplaceByCity(city.id, city.name);
    });

    leafletMarkers.push(marker);
  });

  // Re-initialize Lucide icons inside custom Leaflet elements
  if (window.lucide) {
    lucide.createIcons();
  }

  // 4. Render side legend list items
  legendList.innerHTML = "";
  sortedCities.slice(0, 5).forEach(city => {
    const count = cityCounts[city.id];
    
    const row = document.createElement("div");
    row.className = "map-city-legend-row";
    row.setAttribute("data-city", city.id);
    row.innerHTML = `
      <div class="map-city-legend-left">
        <span class="map-legend-dot" style="background-color: ${city.status === 'red' ? '#ff5630' : city.status === 'orange' ? '#ffab00' : '#36b37e'};"></span>
        <span class="map-city-name">${city.name}</span>
      </div>
      <span class="map-city-count">${count.toLocaleString()}</span>
    `;

    row.addEventListener("click", () => {
      filterMarketplaceByCity(city.id, city.name);
    });

    legendList.appendChild(row);
  });

  // Update total creator label in header
  const totalLabel = document.getElementById("mapTotalCreators");
  if (totalLabel) {
    totalLabel.textContent = `${creators.length.toLocaleString()} Creators`;
  }
}


function filterMarketplaceByCity(cityId, cityName) {
  currentPage = 1;
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(i => i.classList.remove("active"));
  
  const marketplaceItem = Array.from(navItems).find(i => {
    const text = i.querySelector("span").textContent.trim();
    return text === "Marketplace";
  });
  if (marketplaceItem) {
    marketplaceItem.classList.add("active");
  }

  const viewMap = {
    "Dashboard": "dashboardView",
    "Marketplace": "marketplaceView",
    "Campaigns": "campaignsView",
    "Analytics": "analyticsView",
    "Media Monitoring": "mediaMonitoringView",
    "Messages": "messagesView",
    "Payments": "paymentsView",
    "Settings": "settingsView"
  };
  Object.values(viewMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  const marketplaceView = document.getElementById("marketplaceView");
  if (marketplaceView) {
    marketplaceView.style.display = "block";
  }

  activeFilters.location = cityId;
  const selectFilterEl = document.getElementById("filterLocation");
  if (selectFilterEl) {
    selectFilterEl.value = cityId;
  }

  const rightPanel = document.querySelector(".right-panel");
  if (rightPanel) rightPanel.style.display = "flex";
  
  const topbarCenter = document.querySelector(".topbar-center");
  if (topbarCenter) topbarCenter.style.display = "flex";

  renderCreators();
  showToast(`Filtered creators in ${cityName}`, "success");
  addActivityLog(`Map marker clicked: Filtered creators in <strong>${cityName}</strong>.`, "info");

  // Scroll to search filters
  const filterSection = document.querySelector(".filters-section");
  if (filterSection) {
    filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// 16. DYNAMIC ACTIVITY LOGS HANDLER
function addActivityLog(message, type = "info") {
  const activityStream = document.getElementById("activityStream");
  if (!activityStream) return;
  
  const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" });
  
  let iconName = "info";
  if (type === "success") iconName = "check-circle";
  if (type === "warning") iconName = "alert-triangle";
  if (type === "danger") iconName = "x-circle";
  
  const item = document.createElement("div");
  item.className = `activity-item`;
  item.innerHTML = `
    <div class="activity-icon-wrapper ${type}">
      <i data-lucide="${iconName}"></i>
    </div>
    <div class="activity-details">
      <span class="activity-message">${message}</span>
      <span class="activity-time">Today, ${time}</span>
    </div>
  `;
  
  activityStream.insertBefore(item, activityStream.firstChild);
  
  // Keep only last 10 entries
  while (activityStream.children.length > 10) {
    activityStream.lastChild.remove();
  }
  
  if (window.lucide) {
    lucide.createIcons();
  }
}

const mockSystemLogs = [
  "Database synced: indexed 1,000 KOL profiles from Indonesia regional centers.",
  "System initialized under Brand Manager Arif Budiman successfully.",
  "Campaign brief loaded: 'Summer Getaway 2025' active with budget Rp 150.000.000."
];

function initActivityLog() {
  const activityStream = document.getElementById("activityStream");
  if (!activityStream) return;
  
  activityStream.innerHTML = "";
  
  // Add initial mock logs sequentially
  mockSystemLogs.forEach((msg, index) => {
    setTimeout(() => {
      let type = "info";
      if (index === 0) type = "success";
      if (index === 2) type = "warning";
      addActivityLog(msg, type);
    }, index * 200);
  });
  
  // Attach Refresh Stream button handler
  const btnRefreshLogs = document.getElementById("btnRefreshLogs");
  if (btnRefreshLogs) {
    btnRefreshLogs.addEventListener("click", () => {
      const randomLogs = [
        ["Makassar warning indicator triggered: high advertiser demand in South Sulawesi.", "warning"],
        ["New influencer application approved: Sarah Kirana (Beauty, Yogyakarta).", "success"],
        ["Vite bundler reload complete: compiled dashboard bundle in 303ms.", "success"],
        ["Campaign brief estimated costs calculated at Rp 20.000.000.", "info"],
        ["Server health status: 100% uptime with zero critical API exceptions.", "success"],
        ["Estimated reach for selected KOL group updated to 6.7M followers.", "info"]
      ];
      const selected = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      addActivityLog(selected[0], selected[1]);
    });
  }
}
