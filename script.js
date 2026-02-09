// Nager.Date API: https://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}
const HOLIDAYS_API = 'https://date.nager.at/api/v3/PublicHolidays';
const CACHE_KEY_LAST_COUNTRY = 'globalTime_lastCountry';
const CACHE_KEY_HOLIDAYS = 'globalTime_holidays_';
const CACHE_KEY_HOLIDAYS_TIMESTAMP = 'globalTime_holidays_ts_';
const CACHE_KEY_FAVORITES = 'globalTime_favorites';
const CACHE_KEY_THEME = 'globalTime_theme';
const CACHE_KEY_CLOCK_MODE = 'globalTime_clockMode';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// New state variables
let favorites = [];
let currentTheme = 'auto'; // 'light', 'dark', 'auto'
let clockMode = 'digital'; // 'digital', 'analog'
let widgetTheme = 'auto'; // widget preview theme selection
let comparisonCountries = []; // countries selected for comparison

// Unique country codes for global calendar (Nager.Date supported)
function getGlobalCountryCodes() {
    return [...new Set(countries.map(c => c.countryCode).filter(Boolean))];
}

// Country and timezone data with ISO country codes for API
const countries = [
    { name: 'United States (New York)', timezone: 'America/New_York', flag: '🇺🇸', lat: 40.7128, lng: -74.0060, countryCode: 'US', dialingCode: '+1' },
    { name: 'United States (Los Angeles)', timezone: 'America/Los_Angeles', flag: '🇺🇸', lat: 34.0522, lng: -118.2437, countryCode: 'US', dialingCode: '+1' },
    { name: 'United States (Chicago)', timezone: 'America/Chicago', flag: '🇺🇸', lat: 41.8781, lng: -87.6298, countryCode: 'US', dialingCode: '+1' },
    { name: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧', lat: 51.5074, lng: -0.1278, countryCode: 'GB', dialingCode: '+44' },
    { name: 'France', timezone: 'Europe/Paris', flag: '🇫🇷', lat: 48.8566, lng: 2.3522, countryCode: 'FR', dialingCode: '+33' },
    { name: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪', lat: 52.5200, lng: 13.4050, countryCode: 'DE', dialingCode: '+49' },
    { name: 'Italy', timezone: 'Europe/Rome', flag: '🇮🇹', lat: 41.9028, lng: 12.4964, countryCode: 'IT', dialingCode: '+39' },
    { name: 'Spain', timezone: 'Europe/Madrid', flag: '🇪🇸', lat: 40.4168, lng: -3.7038, countryCode: 'ES', dialingCode: '+34' },
    { name: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵', lat: 35.6762, lng: 139.6503, countryCode: 'JP', dialingCode: '+81' },
    { name: 'China', timezone: 'Asia/Shanghai', flag: '🇨🇳', lat: 39.9042, lng: 116.4074, countryCode: 'CN', dialingCode: '+86' },
    { name: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', lat: 28.6139, lng: 77.2090, countryCode: null, dialingCode: '+91' },
    { name: 'Australia (Sydney)', timezone: 'Australia/Sydney', flag: '🇦🇺', lat: -33.8688, lng: 151.2093, countryCode: 'AU', dialingCode: '+61' },
    { name: 'Australia (Melbourne)', timezone: 'Australia/Melbourne', flag: '🇦🇺', lat: -37.8136, lng: 144.9631, countryCode: 'AU', dialingCode: '+61' },
    { name: 'Brazil (São Paulo)', timezone: 'America/Sao_Paulo', flag: '🇧🇷', lat: -23.5505, lng: -46.6333, countryCode: 'BR', dialingCode: '+55' },
    { name: 'Brazil (Rio de Janeiro)', timezone: 'America/Sao_Paulo', flag: '🇧🇷', lat: -22.9068, lng: -43.1729, countryCode: 'BR', dialingCode: '+55' },
    { name: 'Canada (Toronto)', timezone: 'America/Toronto', flag: '🇨🇦', lat: 43.6532, lng: -79.3832, countryCode: 'CA', dialingCode: '+1' },
    { name: 'Canada (Vancouver)', timezone: 'America/Vancouver', flag: '🇨🇦', lat: 49.2827, lng: -123.1207, countryCode: 'CA', dialingCode: '+1' },
    { name: 'Mexico', timezone: 'America/Mexico_City', flag: '🇲🇽', lat: 19.4326, lng: -99.1332, countryCode: 'MX', dialingCode: '+52' },
    { name: 'Russia (Moscow)', timezone: 'Europe/Moscow', flag: '🇷🇺', lat: 55.7558, lng: 37.6173, countryCode: 'RU', dialingCode: '+7' },
    { name: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷', lat: 37.5665, lng: 126.9780, countryCode: 'KR', dialingCode: '+82' },
    { name: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬', lat: 1.3521, lng: 103.8198, countryCode: 'SG', dialingCode: '+65' },
    { name: 'Thailand', timezone: 'Asia/Bangkok', flag: '🇹🇭', lat: 13.7563, lng: 100.5018, countryCode: null, dialingCode: '+66' },
    { name: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: '🇦🇪', lat: 25.2048, lng: 55.2708, countryCode: null, dialingCode: '+971' },
    { name: 'South Africa', timezone: 'Africa/Johannesburg', flag: '🇿🇦', lat: -26.2041, lng: 28.0473, countryCode: 'ZA', dialingCode: '+27' },
    { name: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬', lat: 30.0444, lng: 31.2357, countryCode: 'EG', dialingCode: '+20' },
    { name: 'Turkey', timezone: 'Europe/Istanbul', flag: '🇹🇷', lat: 41.0082, lng: 28.9784, countryCode: 'TR', dialingCode: '+90' },
    { name: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', lat: -34.6037, lng: -58.3816, countryCode: 'AR', dialingCode: '+54' },
    { name: 'Chile', timezone: 'America/Santiago', flag: '🇨🇱', lat: -33.4489, lng: -70.6693, countryCode: 'CL', dialingCode: '+56' },
    { name: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿', lat: -36.8485, lng: 174.7633, countryCode: 'NZ', dialingCode: '+64' },
    { name: 'Indonesia (Jakarta)', timezone: 'Asia/Jakarta', flag: '🇮🇩', lat: -6.2088, lng: 106.8456, countryCode: 'ID', dialingCode: '+62' },
    { name: 'Philippines', timezone: 'Asia/Manila', flag: '🇵🇭', lat: 14.5995, lng: 120.9842, countryCode: 'PH', dialingCode: '+63' },
    { name: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾', lat: 3.1390, lng: 101.6869, countryCode: null, dialingCode: '+60' },
    { name: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', flag: '🇻🇳', lat: 10.8231, lng: 106.6297, countryCode: 'VN', dialingCode: '+84' },
    { name: 'Saudi Arabia', timezone: 'Asia/Riyadh', flag: '🇸🇦', lat: 24.7136, lng: 46.6753, countryCode: null, dialingCode: '+966' },
    { name: 'Israel', timezone: 'Asia/Jerusalem', flag: '🇮🇱', lat: 31.7683, lng: 35.2137, countryCode: null, dialingCode: '+972' },
    { name: 'Poland', timezone: 'Europe/Warsaw', flag: '🇵🇱', lat: 52.2297, lng: 21.0122, countryCode: 'PL', dialingCode: '+48' },
    { name: 'Netherlands', timezone: 'Europe/Amsterdam', flag: '🇳🇱', lat: 52.3676, lng: 4.9041, countryCode: 'NL', dialingCode: '+31' },
    { name: 'Sweden', timezone: 'Europe/Stockholm', flag: '🇸🇪', lat: 59.3293, lng: 18.0686, countryCode: 'SE', dialingCode: '+46' },
    { name: 'Norway', timezone: 'Europe/Oslo', flag: '🇳🇴', lat: 59.9139, lng: 10.7522, countryCode: 'NO', dialingCode: '+47' },
    { name: 'Denmark', timezone: 'Europe/Copenhagen', flag: '🇩🇰', lat: 55.6761, lng: 12.5683, countryCode: 'DK', dialingCode: '+45' },
    { name: 'Switzerland', timezone: 'Europe/Zurich', flag: '🇨🇭', lat: 47.3769, lng: 8.5417, countryCode: 'CH', dialingCode: '+41' },
    { name: 'Belgium', timezone: 'Europe/Brussels', flag: '🇧🇪', lat: 50.8503, lng: 4.3517, countryCode: 'BE', dialingCode: '+32' },
    { name: 'Austria', timezone: 'Europe/Vienna', flag: '🇦🇹', lat: 48.2082, lng: 16.3738, countryCode: 'AT', dialingCode: '+43' },
    { name: 'Greece', timezone: 'Europe/Athens', flag: '🇬🇷', lat: 37.9838, lng: 23.7275, countryCode: 'GR', dialingCode: '+30' },
    { name: 'Portugal', timezone: 'Europe/Lisbon', flag: '🇵🇹', lat: 38.7223, lng: -9.1393, countryCode: 'PT', dialingCode: '+351' },
    { name: 'Ireland', timezone: 'Europe/Dublin', flag: '🇮🇪', lat: 53.3498, lng: -6.2603, countryCode: 'IE', dialingCode: '+353' },
    { name: 'Finland', timezone: 'Europe/Helsinki', flag: '🇫🇮', lat: 60.1699, lng: 24.9384, countryCode: 'FI', dialingCode: '+358' },
    { name: 'Czech Republic', timezone: 'Europe/Prague', flag: '🇨🇿', lat: 50.0755, lng: 14.4378, countryCode: 'CZ', dialingCode: '+420' },
    { name: 'Hungary', timezone: 'Europe/Budapest', flag: '🇭🇺', lat: 47.4979, lng: 19.0402, countryCode: 'HU', dialingCode: '+36' },
    { name: 'Romania', timezone: 'Europe/Bucharest', flag: '🇷🇴', lat: 44.4268, lng: 26.1025, countryCode: 'RO', dialingCode: '+40' },
];

let map;
let currentCountry = null;
let timeUpdateInterval = null;
let favoritesUpdateInterval = null;
let mapTerminatorInterval = null;
let comparisonUpdateInterval = null;
let mapMarkers = {};
let currentCalendarDate = new Date();
let calendarView = 'country'; // 'country' | 'global'
let holidaysByCountryYear = {}; // in-memory cache: { 'US_2026': [...] }

// ============ API FUNCTIONS (for internal use and promise-based exports) ============

function getTimezoneData(timezone) {
    const country = countries.find(c => c.timezone === timezone);
    
    if (!country) {
        return {
            status: 'error',
            message: `Timezone '${timezone}' not found`,
            hint: 'Use ?api=list to see available timezones'
        };
    }
    
    const now = new Date();
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    const time = timeFormatter.format(now);
    const date = dateFormatter.format(now);
    
    // Calculate UTC offset
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const utcOffset = -tzDate.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(utcOffset) / 60);
    const offsetMinutes = Math.abs(utcOffset) % 60;
    const offsetSign = utcOffset >= 0 ? '+' : '-';
    const utcOffsetStr = `UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
    
    return {
        status: 'success',
        timestamp: now.toISOString(),
        timezone: timezone,
        country: {
            name: country.name,
            flag: country.flag,
            dialingCode: country.dialingCode,
            countryCode: country.countryCode
        },
        current_time: time,
        current_date: date,
        utc_offset: utcOffsetStr,
        utc_offset_minutes: utcOffset
    };
}

function getSimpleTimeData(timezone) {
    const country = countries.find(c => c.timezone === timezone);
    
    if (!country) {
        return {
            status: 'error',
            message: `Timezone '${timezone}' not found`
        };
    }
    
    const now = new Date();
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const time = timeFormatter.format(now);
    
    return {
        status: 'success',
        timezone: timezone,
        time: time,
        country_name: country.name
    };
}

function getAllTimezonesData() {
    const timezoneList = countries.map(c => ({
        timezone: c.timezone,
        country: c.name,
        flag: c.flag,
        dialingCode: c.dialingCode,
        countryCode: c.countryCode
    }));
    
    return {
        status: 'success',
        total_timezones: timezoneList.length,
        timezones: timezoneList
    };
}

// ============ PROMISE-BASED API FUNCTIONS (Exportable for external use) ============

/**
 * Get full timezone data including time, date, country info, UTC offset
 * @param {string} timezone - Timezone string (e.g., 'Asia/Kolkata')
 * @returns {Promise<Object>} Promise resolving to timezone data
 */
function getTimezoneDataAsync(timezone) {
    return Promise.resolve(getTimezoneData(timezone));
}

/**
 * Get simple time data (just time and country name)
 * @param {string} timezone - Timezone string (e.g., 'Asia/Kolkata')
 * @returns {Promise<Object>} Promise resolving to time data
 */
function getTimeDataAsync(timezone) {
    return Promise.resolve(getSimpleTimeData(timezone));
}

/**
 * Get all available timezones
 * @returns {Promise<Object>} Promise resolving to list of all timezones
 */
function getAllTimezonesAsync() {
    return Promise.resolve(getAllTimezonesData());
}

// ============ ORIGINAL INITIALIZATION ============

function init() {
    loadPreferences();
    
    // Check for widget mode
    const urlParams = new URLSearchParams(window.location.search);
    const isWidgetMode = urlParams.has('widget');
    
    if (isWidgetMode) {
        initWidgetMode(urlParams);
        return;
    }
    
    if (isWidgetMode) {
        initWidgetMode(urlParams);
        return;
    }
    
    setupTabs();
    setupMap();
    setupCountryList();
    setupSearch();
    setupCalendar();
    setupThemeToggle();
    setupClockMode();
    setupFavorites();
    setupShareButton();
    detectMobile();
    setupBulkComparison();
    setupWidgetOptions();
    setupApiSection();
    updateWidgetEmbed();  // Generate initial preview
    
    // Restore favorites display first (before country selection)
    updateFavoritesDisplay();
    
    // Restore last selected country
    restoreLastCountry();
    
    // Setup geolocation after restoring last country
    setupGeolocation();
    
    preCacheHolidays();
    hideAppLoading();
}

function showAppLoading() {
    const el = document.getElementById('app-loading');
    if (el) el.setAttribute('aria-hidden', 'false');
}

function hideAppLoading() {
    const el = document.getElementById('app-loading');
    if (el) el.setAttribute('aria-hidden', 'true');
}

function initWidgetMode(urlParams) {
    // Hide ALL non-essential UI elements for widget mode
    document.documentElement.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // Hide everything except the container
    document.querySelectorAll('header, footer, .panel, .favorites-section, #offline-banner, #file-protocol-banner, #app-loading').forEach(el => {
        if (el) el.style.display = 'none';
    });
    
    // Simplify main container for widget view
    const container = document.querySelector('.container');
    if (container) {
        container.style.padding = '0';
        container.style.maxWidth = '100%';
        container.style.width = '100%';
        container.style.height = '100vh';
        container.style.margin = '0';
    }
    
    const main = document.querySelector('main');
    if (main) {
        main.style.padding = '0';
        main.style.minHeight = '100vh';
        main.style.height = '100%';
        main.style.display = 'flex';
        main.style.alignItems = 'center';
        main.style.justifyContent = 'center';
        main.style.margin = '0';
    }
    
    // Get parameters
    const tz = urlParams.get('tz');
    const clockType = urlParams.get('clock') || 'digital';
    const themeParam = urlParams.get('theme') || 'auto';
    
    // Apply theme to widget (BEFORE loadPreferences)
    if (themeParam === 'auto') {
        document.body.removeAttribute('data-theme');
        currentTheme = 'auto';
    } else if (themeParam === 'light' || themeParam === 'dark') {
        document.body.setAttribute('data-theme', themeParam);
        document.body.removeAttribute('data-time-theme');
        currentTheme = themeParam;
    }
    
    // Find country
    let country = countries[0];
    if (tz) {
        const foundCountry = countries.find(c => c.timezone === tz);
        if (foundCountry) country = foundCountry;
    }
    
    currentCountry = country;
    
    // Replace hero card with custom widget structure
    const heroCard = document.querySelector('.hero-card');
    if (heroCard) {
        // Create widget-only HTML structure
        heroCard.innerHTML = `
            <div class="widget-container">
                <div class="widget-header">
                    <span class="widget-country">${country.name}</span>
                </div>
                <div class="widget-time-display">
                    ${clockType === 'analog' ? `
                        <div class="widget-analog-clock">
                            <div class="widget-clock-face">
                                <div class="hand hour-hand" id="widgetHourHand"></div>
                                <div class="hand minute-hand" id="widgetMinuteHand"></div>
                                <div class="hand second-hand" id="widgetSecondHand"></div>
                                <div class="clock-center"></div>
                            </div>
                        </div>
                    ` : `
                        <div class="widget-digital-time" id="widgetDigitalTime">00:00:00</div>
                    `}
                </div>
                <div class="widget-footer">
                    <div class="widget-meta">
                        <span class="widget-timezone">${country.timezone}</span>
                        <span class="widget-dial">Dial: ${country.dialingCode || '--'}</span>
                    </div>
                </div>
            </div>
        `;
        
        heroCard.className = 'hero-card widget-mode-active';
        heroCard.style.margin = '0';
        heroCard.style.padding = '0';
        heroCard.style.maxWidth = 'none';
        heroCard.style.width = '100%';
        heroCard.style.height = '100%';
        heroCard.style.borderRadius = '0';
        heroCard.style.border = 'none';
    }
    
    // Load other preferences but DON'T override widget theme
    try {
        const savedFavorites = localStorage.getItem(CACHE_KEY_FAVORITES);
        if (savedFavorites) favorites = JSON.parse(savedFavorites);
        
        const savedClockMode = localStorage.getItem(CACHE_KEY_CLOCK_MODE);
        if (savedClockMode) clockMode = savedClockMode;
    } catch (e) {
        console.warn('Could not load preferences', e);
    }
    
    // Apply theme (after setting currentTheme but before setupThemeToggle)
    if (themeParam === 'auto') {
        updateTimeBasedTheme();
    } else {
        applyTheme();
    }
    
    // Skip setupThemeToggle for widgets - we don't need theme toggle button
    // setupThemeToggle();
    
    // Set up continuous time updates for widget
    if (timeUpdateInterval) clearInterval(timeUpdateInterval);
    timeUpdateInterval = setInterval(() => {
        updateWidgetTime(clockType);
    }, 1000);
    
    // Initial time display
    updateWidgetTime(clockType);
    
    hideAppLoading();
}

function updateWidgetTime(clockType) {
    if (!currentCountry) return;
    
    try {
        const now = new Date();
        
        if (clockType === 'digital') {
            const formatter = new Intl.DateTimeFormat('en-US', { 
                timeZone: currentCountry.timezone, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
            });
            const timeEl = document.getElementById('widgetDigitalTime');
            if (timeEl) {
                timeEl.textContent = formatter.format(now);
            }
        } else if (clockType === 'analog') {
            // Get time in the country's timezone
            const tzDate = new Date(now.toLocaleString('en-US', { timeZone: currentCountry.timezone }));
            const hours = tzDate.getHours();
            const minutes = tzDate.getMinutes();
            const seconds = tzDate.getSeconds();
            
            const hourHand = document.getElementById('widgetHourHand');
            const minuteHand = document.getElementById('widgetMinuteHand');
            const secondHand = document.getElementById('widgetSecondHand');
            
            if (hourHand && minuteHand && secondHand) {
                const hourDeg = (hours % 12) * 30 + minutes * 0.5;
                const minuteDeg = minutes * 6 + seconds * 0.1;
                const secondDeg = seconds * 6;
                
                hourHand.style.transform = `rotate(${hourDeg}deg)`;
                minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
                secondHand.style.transform = `rotate(${secondDeg}deg)`;
            }
        }
    } catch (err) {
        console.error('Widget time update error:', err);
    }
}

function showCalendarLoading() {
    const el = document.getElementById('calendar-loading');
    if (el) el.setAttribute('aria-hidden', 'false');
}

function hideCalendarLoading() {
    const el = document.getElementById('calendar-loading');
    if (el) el.setAttribute('aria-hidden', 'true');
}

function restoreLastCountry() {
    try {
        const saved = localStorage.getItem(CACHE_KEY_LAST_COUNTRY);
        if (saved) {
            const country = countries.find(c => c.name === saved);
            if (country) {
                selectCountry(country);
                console.log(`✓ Restored last country: ${country.name}`);
                return;
            }
        }
        // No saved country, show placeholder
        console.log('No saved country found');
    } catch (e) {
        console.warn('Could not restore last country', e);
    }
}

function saveLastCountry() {
    if (!currentCountry) return;
    try {
        localStorage.setItem(CACHE_KEY_LAST_COUNTRY, currentCountry.name);
        console.log(`✓ Saved current country: ${currentCountry.name}`);
    } catch (e) {
        console.warn('Could not save last country', e);
    }
}

function detectMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    if (!isMobile) {
        document.querySelectorAll('.flag-emoji, .country-item-flag').forEach(el => {
            el.style.display = 'none';
        });
    } else {
        document.querySelectorAll('.flag-emoji, .country-item-flag').forEach(el => {
            el.style.display = '';
        });
    }
}

// Fetch public holidays for a year and country: GET .../PublicHolidays/{year}/{countryCode}
async function fetchHolidays(countryCode, year) {
    if (!countryCode) return [];
    const key = `${countryCode}_${year}`;
    
    // Check memory cache first
    if (holidaysByCountryYear[key]) return holidaysByCountryYear[key];
    
    const storageKey = CACHE_KEY_HOLIDAYS + key;
    const timestampKey = CACHE_KEY_HOLIDAYS_TIMESTAMP + key;
    
    // Check localStorage cache validity
    try {
        const cached = localStorage.getItem(storageKey);
        const timestamp = localStorage.getItem(timestampKey);
        if (cached && timestamp) {
            const cacheAge = Date.now() - parseInt(timestamp);
            if (cacheAge < CACHE_DURATION) {
                // Cache is still valid
                const data = JSON.parse(cached);
                holidaysByCountryYear[key] = data;
                return data;
            }
        }
    } catch (e) {
        console.warn('Could not read cache', e);
    }
    
    // Try to fetch from API
    const url = `${HOLIDAYS_API}/${year}/${countryCode}`;
    try {
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            holidaysByCountryYear[key] = data;
            // Save to localStorage with timestamp
            try {
                localStorage.setItem(storageKey, JSON.stringify(data));
                localStorage.setItem(timestampKey, Date.now().toString());
            } catch (e) {
                console.warn('Could not save to cache', e);
            }
            return data;
        }
    } catch (err) {
        console.warn('Fetch failed, using offline cache', err);
    }
    
    // Fall back to offline cache even if expired
    try {
        const cached = localStorage.getItem(storageKey);
        if (cached) {
            const data = JSON.parse(cached);
            holidaysByCountryYear[key] = data;
            return data;
        }
    } catch (e) {
        console.warn('Could not read offline cache', e);
    }
    
    return [];
}

// Pre-cache holidays for current and next year to enable offline access
async function preCacheHolidays() {
    if (!navigator.onLine) return; // Only pre-cache when online
    
    try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const nextYear = currentYear + 1;
        
        // Get unique country codes
        const codes = getGlobalCountryCodes();
        const codesToCache = codes.slice(0, 10); // Cache first 10 countries to avoid too many requests
        
        // Pre-cache current and next year
        for (const code of codesToCache) {
            await fetchHolidays(code, currentYear);
            await fetchHolidays(code, nextYear);
            // Small delay to avoid hammering the API
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    } catch (e) {
        console.warn('Pre-caching failed:', e);
    }
}

function getHolidaysForDate(countryCode, year, month, day) {
    if (!countryCode) return [];
    const key = `${countryCode}_${year}`;
    const list = holidaysByCountryYear[key];
    if (!list) return [];
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return list.filter(h => h.date === dateStr).map(h => h.name);
}

// Global calendar: all festivals on this date across all countries (name + country code from API)
function getGlobalHolidaysForDate(year, month, day) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const result = [];
    getGlobalCountryCodes().forEach(cc => {
        const list = holidaysByCountryYear[`${cc}_${year}`];
        if (!list) return;
        list.filter(h => h.date === dateStr).forEach(h => result.push(`${h.name} (${cc})`));
    });
    return result;
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}Tab`) {
                    content.classList.add('active');
                    if (targetTab === 'map' && map) setTimeout(() => map.invalidateSize(), 100);
                    if (targetTab === 'calendar') loadHolidaysAndRenderCalendar();
                }
            });
        });
    });
}

function setupMap() {
    const mapWrap = document.getElementById('mapWrap');
    const mapOffline = document.getElementById('mapOffline');
    if (!navigator.onLine) {
        if (mapWrap) mapWrap.classList.add('hidden');
        if (mapOffline) {
            mapOffline.classList.remove('hidden');
            fillMapOfflineList();
        }
        return;
    }
    try {
        // Destroy existing map if it exists
        if (map) {
            map.remove();
            map = null;
        }
        mapMarkers = {};
        
        map = L.map('map').setView([20, 0], 2);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            minZoom: 2,
            noWrap: true
        }).addTo(map);
        
        countries.forEach(country => {
            const marker = L.marker([country.lat, country.lng], { icon: getMarkerIcon(country) })
                .addTo(map)
                .bindPopup(`<b>${country.name}</b><br/>${country.timezone}`)
                .bindTooltip(`${country.name}<br/>${country.timezone}`, { permanent: false, direction: 'top' })
                .on('click', () => selectCountry(country));
            mapMarkers[country.name] = marker;
        });
        
        map.on('click', (e) => {
            let nearest = null, minD = Infinity;
            countries.forEach(c => {
                const d = Math.sqrt(Math.pow(e.latlng.lat - c.lat, 2) + Math.pow(e.latlng.lng - c.lng, 2));
                if (d < minD && d < 5) { minD = d; nearest = c; }
            });
            if (nearest) selectCountry(nearest);
        });

        setupMapTerminator();
    } catch (err) {
        if (mapWrap) mapWrap.classList.add('hidden');
        if (mapOffline) mapOffline.classList.remove('hidden');
    }
}

function setupMapTerminator() {
    const overlay = document.getElementById('mapTerminator');
    if (!overlay) return;
    updateMapTerminator();
    if (mapTerminatorInterval) clearInterval(mapTerminatorInterval);
    mapTerminatorInterval = setInterval(updateMapTerminator, 60000);
}

function updateMapTerminator() {
    const overlay = document.getElementById('mapTerminator');
    if (!overlay) return;
    const now = new Date();
    const utcMinutes = (now.getUTCHours() * 60) + now.getUTCMinutes() + (now.getUTCSeconds() / 60);
    let subsolarLon = 180 - (utcMinutes / 4);
    subsolarLon = ((subsolarLon + 180) % 360 + 360) % 360 - 180;
    const shift = (-subsolarLon / 180) * 50;
    overlay.style.setProperty('--terminator-shift', `${shift}%`);
}

function getMarkerIcon(country) {
    const isFavorite = favorites.some(f => f.name === country.name);
    return L.divIcon({
        className: 'map-marker-wrapper',
        html: `<div class="map-marker${isFavorite ? ' is-favorite' : ''}"><span class="marker-star">★</span></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
    });
}

function updateFavoriteMarkers() {
    if (!map || !mapMarkers) return;
    Object.keys(mapMarkers).forEach((name) => {
        const marker = mapMarkers[name];
        if (!marker) return;
        const country = countries.find(c => c.name === name);
        if (!country) return;
        marker.setIcon(getMarkerIcon(country));
    });
}

function updateMapThemeForCountry() {
    const mapWrap = document.getElementById('mapWrap');
    if (!mapWrap || !currentCountry) {
        if (mapWrap) mapWrap.removeAttribute('data-map-theme');
        return;
    }
    try {
        const now = new Date();
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: currentCountry.timezone }));
        const hour = tzDate.getHours();
        const mode = (hour >= 6 && hour < 18) ? 'day' : 'night';
        mapWrap.setAttribute('data-map-theme', mode);
    } catch (err) {
        mapWrap.removeAttribute('data-map-theme');
    }
}

function fillMapOfflineList() {
    const list = document.getElementById('mapOfflineList');
    if (!list) return;
    list.innerHTML = '';
    countries.forEach(country => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'map-offline-country-btn';
        btn.textContent = country.name;
        btn.addEventListener('click', () => selectCountry(country));
        list.appendChild(btn);
    });
}

function updateMapOfflineState() {
    const mapWrap = document.getElementById('mapWrap');
    const mapOffline = document.getElementById('mapOffline');
    if (!mapWrap || !mapOffline) return;
    if (navigator.onLine) {
        mapOffline.classList.add('hidden');
        if (!map) {
            mapWrap.classList.remove('hidden');
            setupMap();
        } else {
            mapWrap.classList.remove('hidden');
        }
    } else {
        mapWrap.classList.add('hidden');
        mapOffline.classList.remove('hidden');
        fillMapOfflineList();
    }
}

function setupCountryList() {
    const listEl = document.getElementById('countryList');
    listEl.innerHTML = '';
    countries.forEach(country => {
        const item = document.createElement('div');
        item.className = 'country-item';
        item.innerHTML = `
            <span class="country-item-flag">${country.flag}</span>
            <div style="flex: 1;">
                <span class="country-item-name">${country.name}</span>
                <span class="country-item-timezone">${country.timezone}</span>
            </div>
            <span class="country-item-dial">${country.dialingCode}</span>
        `;
        item.addEventListener('click', () => selectCountry(country));
        listEl.appendChild(item);
    });
}

function setupSearch() {
    document.getElementById('countrySearch').addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.country-item').forEach(item => {
            const name = item.querySelector('.country-item-name').textContent.toLowerCase();
            const tz = item.querySelector('.country-item-timezone').textContent.toLowerCase();
            item.style.display = (name.includes(q) || tz.includes(q)) ? 'flex' : 'none';
        });
    });
}

function selectCountry(country) {
    currentCountry = country;
    
    // In widget mode, always show flag emoji
    const isWidgetMode = document.querySelector('.hero-card')?.classList.contains('widget-only-mode');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    // Safe element updates with null checks
    const flagEl = document.getElementById('flagEmoji');
    if (flagEl) {
        if (isWidgetMode) {
            flagEl.style.display = 'block';
            flagEl.textContent = country.flag;
        } else {
            flagEl.textContent = isMobile ? country.flag : (country.countryCode || '—');
        }
    }
    
    const nameEl = document.getElementById('countryName');
    if (nameEl) nameEl.textContent = country.name;
    
    const tzEl = document.getElementById('timezone');
    if (tzEl) tzEl.textContent = country.timezone;
    
    const dialEl = document.getElementById('dialCode');
    if (dialEl) dialEl.textContent = country.dialingCode || '--';
    
    // Update widget-specific info
    const widgetInfoEl = document.getElementById('widgetInfo');
    if (widgetInfoEl) {
        widgetInfoEl.innerHTML = `
            <div class="widget-info-item">${country.timezone}</div>
            <div class="widget-info-item"><span class="widget-info-label">Dial:</span> ${country.dialingCode || '--'}</div>
        `;
    }
    
    updateTime();
    updateSeason();
    updateUTCOffset();
    updateTimeDifference();
    updateDateInMetaGrid();
    updateSunTimes(country);
    updateTimeBasedTheme();
    updateMapThemeForCountry();
    updateFavoriteButton();
    updateWidgetEmbed();
    saveLastCountry();
    if (timeUpdateInterval) clearInterval(timeUpdateInterval);
    timeUpdateInterval = setInterval(() => {
        updateTime();
        updateAnalogClock();
        updateTimeBasedTheme();
        updateMapThemeForCountry();
        updateDateInMetaGrid();
    }, 1000);
    document.querySelectorAll('.country-item').forEach(item => {
        const nameEl = item.querySelector('.country-item-name');
        if (nameEl && nameEl.textContent === country.name) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    if (map) map.setView([country.lat, country.lng], 5);
    const calendarTab = document.getElementById('calendarTab');
    if (calendarTab && calendarTab.classList.contains('active')) {
        loadHolidaysAndRenderCalendar();
    }
    // Pre-cache holidays for selected country
    if (country.countryCode && navigator.onLine) {
        const now = new Date();
        const year = now.getFullYear();
        fetchHolidays(country.countryCode, year).catch(() => {});
        fetchHolidays(country.countryCode, year + 1).catch(() => {});
    }
    updateCalendarHint();
}

function updateTime() {
    if (!currentCountry) return;
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', { timeZone: currentCountry.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const dateFormatter = new Intl.DateTimeFormat('en-US', { timeZone: currentCountry.timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('currentTime').textContent = formatter.format(now);
        document.getElementById('currentDate').textContent = dateFormatter.format(now);
        updateMapThemeForCountry();
    } catch (err) {
        document.getElementById('currentTime').textContent = '--:--:--';
        document.getElementById('currentDate').textContent = '--';
    }
}

function getSeason(country) {
    if (!country) return '--';
    const month = new Date().getMonth() + 1;
    const north = country.lat > 0;
    if (north) {
        if (month >= 12 || month <= 2) return 'Winter ❄️';
        if (month <= 5) return 'Spring 🌸';
        if (month <= 8) return 'Summer ☀️';
        return 'Autumn 🍂';
    } else {
        if (month >= 12 || month <= 2) return 'Summer ☀️';
        if (month <= 5) return 'Autumn 🍂';
        if (month <= 8) return 'Winter ❄️';
        return 'Spring 🌸';
    }
}

function updateSeason() {
    document.getElementById('seasonValue').textContent = currentCountry ? getSeason(currentCountry) : '--';
}

function setupCalendar() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        loadHolidaysAndRenderCalendar();
    });
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        loadHolidaysAndRenderCalendar();
    });
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            calendarView = btn.getAttribute('data-view');
            loadHolidaysAndRenderCalendar();
        });
    });
    renderCalendar();
}

async function loadHolidaysAndRenderCalendar() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    showCalendarLoading();
    try {
        if (calendarView === 'country') {
            // Use the same country selected for time checking
            if (currentCountry && currentCountry.countryCode) {
                await fetchHolidays(currentCountry.countryCode, year);
                if (month === 11) await fetchHolidays(currentCountry.countryCode, year + 1);
            }
        } else {
            const codes = getGlobalCountryCodes();
            await Promise.all(codes.map(cc => fetchHolidays(cc, year)));
            if (month === 11) await Promise.all(codes.map(cc => fetchHolidays(cc, year + 1)));
        }
    } finally {
        hideCalendarLoading();
    }
    renderCalendar();
}

function updateCalendarHint() {
    const hint = document.getElementById('calendarHint');
    if (!hint) return;
    if (calendarView === 'global') {
        hint.textContent = 'Public holidays from all countries';
        return;
    }
    if (currentCountry) {
        if (currentCountry.countryCode) {
            hint.textContent = 'Holidays for ' + currentCountry.name + ' — tap a day with events to see names';
        } else {
            hint.textContent = 'Holiday data not available for ' + currentCountry.name + ' — try Global or pick another country';
        }
    } else {
        hint.textContent = 'Select a country (Map/List) or use Global to see holidays';
    }
}

function showFestivalModal(dateLabel, names) {
    const existing = document.getElementById('festival-modal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'festival-modal';
    modal.className = 'festival-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Festivals on this day');
    modal.innerHTML = `
        <div class="festival-modal-backdrop"></div>
        <div class="festival-modal-box">
            <div class="festival-modal-header">
                <h3>${dateLabel}</h3>
                <button type="button" class="festival-modal-close" aria-label="Close">&times;</button>
            </div>
            <ul class="festival-modal-list">${names.map(n => `<li>${escapeHtml(n)}</li>`).join('')}</ul>
        </div>
    `;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('festival-modal-visible'));
    const close = () => {
        modal.classList.remove('festival-modal-visible');
        setTimeout(() => modal.remove(), 300);
    };
    modal.querySelector('.festival-modal-close').addEventListener('click', close);
    modal.querySelector('.festival-modal-backdrop').addEventListener('click', close);
}

function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
}

function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    const monthYearEl = document.getElementById('calendarMonthYear');
    if (!calendarEl || !monthYearEl) return;
    updateCalendarHint();
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearEl.textContent = `${monthNames[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const countryCode = calendarView === 'country' && currentCountry && currentCountry.countryCode ? currentCountry.countryCode : null;
    calendarEl.innerHTML = '';
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => {
        const h = document.createElement('div');
        h.className = 'calendar-day-header';
        h.textContent = d;
        calendarEl.appendChild(h);
    });
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day empty';
        calendarEl.appendChild(empty);
    }
    const monthNamesShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        const date = new Date(year, month, day);
        if (date.toDateString() === today.toDateString()) cell.classList.add('today');
        const names = calendarView === 'global'
            ? getGlobalHolidaysForDate(year, month + 1, day)
            : (countryCode ? getHolidaysForDate(countryCode, year, month + 1, day) : []);
        cell.innerHTML = `<span class="day-number">${day}</span>`;
        if (names.length > 0) {
            const label = document.createElement('div');
            label.className = 'calendar-day-festivals';
            label.textContent = names.length === 1 ? names[0] : names.length + ' events';
            cell.appendChild(label);
            cell.classList.add('has-events');
            const dateLabel = monthNamesShort[month] + ' ' + day + ', ' + year;
            cell.addEventListener('click', () => showFestivalModal(dateLabel, names));
            cell.setAttribute('role', 'button');
            cell.setAttribute('tabindex', '0');
            cell.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showFestivalModal(dateLabel, names); } });
        }
        calendarEl.appendChild(cell);
    }
}

// ============ NEW FEATURES ============

// Load preferences from localStorage
function loadPreferences() {
    try {
        const savedFavorites = localStorage.getItem(CACHE_KEY_FAVORITES);
        if (savedFavorites) {
            favorites = JSON.parse(savedFavorites);
            console.log(`✓ Loaded ${favorites.length} favorite(s) from storage`);
        }
        
        const savedTheme = localStorage.getItem(CACHE_KEY_THEME);
        if (savedTheme) currentTheme = savedTheme;
        
        const savedClockMode = localStorage.getItem(CACHE_KEY_CLOCK_MODE);
        if (savedClockMode) clockMode = savedClockMode;
        
        applyClockMode();
    } catch (e) {
        console.warn('Could not load preferences', e);
        favorites = [];
    }
}

// Favorites functionality
function setupFavorites() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', toggleFavorite);
    }
}

function toggleFavorite() {
    if (!currentCountry) return;
    
    const index = favorites.findIndex(f => f.name === currentCountry.name);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast(`\u2606 Removed ${currentCountry.name} from favorites`);
    } else {
        favorites.push(currentCountry);
        showToast(`\u2605 Added ${currentCountry.name} to favorites`);
    }
    
    saveFavorites();
    updateFavoriteButton();
    updateFavoritesDisplay();
    updateFavoriteMarkers();
}

function saveFavorites() {
    try {
        localStorage.setItem(CACHE_KEY_FAVORITES, JSON.stringify(favorites));
        console.log(`✓ Saved ${favorites.length} favorite(s) to storage`);
    } catch (e) {
        console.warn('Could not save favorites', e);
        showToast('Failed to save favorites');
    }
}

function updateFavoriteButton() {
    const btn = document.getElementById('favoriteBtn');
    const icon = document.getElementById('favoriteIcon');
    if (!btn || !icon || !currentCountry) return;
    
    btn.style.display = 'inline-flex';
    const isFavorite = favorites.some(f => f.name === currentCountry.name);
    icon.textContent = isFavorite ? '★' : '☆';
    btn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
}

function updateFavoritesDisplay() {
    const section = document.getElementById('favoritesSection');
    const grid = document.getElementById('favoritesGrid');
    
    if (!section || !grid) return;
    
    if (favorites.length === 0) {
        section.style.display = 'none';
        if (favoritesUpdateInterval) {
            clearInterval(favoritesUpdateInterval);
            favoritesUpdateInterval = null;
        }
        return;
    }
    
    section.style.display = 'block';
    grid.innerHTML = '';
    
    favorites.forEach(country => {
        const card = document.createElement('div');
        card.className = 'favorite-card';
        
        const time = getCurrentTimeForCountry(country);
        const hour = time ? parseInt(time.split(':')[0]) : 12;
        const emoji = getTimeEmoji(hour);
        
        card.innerHTML = `
            <div class="favorite-card-header">
                <span class="favorite-flag">${country.flag}</span>
                <button type="button" class="favorite-remove" data-country="${country.name}" title="Remove">×</button>
            </div>
            <div class="favorite-name">${country.name}</div>
            <div class="favorite-time">${emoji} ${time || '--:--:--'}</div>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('favorite-remove')) {
                selectCountry(country);
            }
        });
        
        const removeBtn = card.querySelector('.favorite-remove');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            favorites = favorites.filter(f => f.name !== country.name);
            saveFavorites();
            updateFavoritesDisplay();
            updateFavoriteButton();
            updateFavoriteMarkers();
        });
        
        grid.appendChild(card);
    });
    
    // Update favorite times every second
    if (!favoritesUpdateInterval && favorites.length > 0) {
        favoritesUpdateInterval = setInterval(() => {
            const timeEls = document.querySelectorAll('.favorite-time');
            timeEls.forEach((el, index) => {
                if (favorites[index]) {
                    const time = getCurrentTimeForCountry(favorites[index]);
                    const hour = time ? parseInt(time.split(':')[0]) : 12;
                    const emoji = getTimeEmoji(hour);
                    el.textContent = `${emoji} ${time || '--:--:--'}`;
                }
            });
        }, 1000);
    }
}

function getCurrentTimeForCountry(country) {
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', { 
            timeZone: country.timezone, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
        });
        return formatter.format(now);
    } catch (err) {
        return null;
    }
}

function getTimeEmoji(hour) {
    if (hour >= 5 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 17) return '☀️';
    if (hour >= 17 && hour < 20) return '🌆';
    return '🌙';
}

// UTC Offset
function updateUTCOffset() {
    const offsetEl = document.getElementById('utcOffset');
    if (!offsetEl || !currentCountry) return;
    
    try {
        const now = new Date();
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: currentCountry.timezone }));
        const diffMinutes = (tzDate - utcDate) / (1000 * 60);
        const hours = Math.floor(Math.abs(diffMinutes) / 60);
        const minutes = Math.abs(diffMinutes) % 60;
        const sign = diffMinutes >= 0 ? '+' : '-';
        
        offsetEl.textContent = `UTC ${sign}${hours}${minutes > 0 ? ':' + String(minutes).padStart(2, '0') : ''}`;
    } catch (err) {
        offsetEl.textContent = '--';
    }
}

// Time Difference Calculator
function updateTimeDifference() {
    const diffEl = document.getElementById('timeDiff');
    if (!diffEl || !currentCountry) return;
    
    try {
        const now = new Date();
        const localTime = now.getTime();
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: currentCountry.timezone }));
        const tzTime = tzDate.getTime();
        const diffMs = tzTime - localTime;
        const diffHours = Math.round(diffMs / (1000 * 60 * 60));
        
        if (diffHours === 0) {
            diffEl.textContent = 'Same as local';
        } else if (diffHours > 0) {
            diffEl.textContent = `+${diffHours}h ahead`;
        } else {
            diffEl.textContent = `${diffHours}h behind`;
        }
    } catch (err) {
        diffEl.textContent = '--';
    }
}

// Sunrise/Sunset Times
function updateSunTimes(country) {
    const el = document.getElementById('sunTimes');
    const sunriseEl = document.getElementById('sunriseTime');
    const sunsetEl = document.getElementById('sunsetTime');
    
    if (!el || !sunriseEl || !sunsetEl) return;
    
    // Calculate approximate sunrise/sunset based on latitude
    const { sunrise, sunset } = calculateSunTimes(country.lat, country.lng);
    
    if (sunrise && sunset) {
        el.style.display = 'flex';
        sunriseEl.textContent = sunrise;
        sunsetEl.textContent = sunset;
    } else {
        el.style.display = 'none';
    }
}

function calculateSunTimes(lat, lng) {
    // Simplified sunrise/sunset calculation
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    
    // This is a simplified approximation
    const sunriseBase = 6;
    const sunsetBase = 18;
    
    // Adjust for latitude (very simplified)
    const latFactor = lat / 90;
    const seasonFactor = Math.sin((month - 3) * Math.PI / 6) * 2;
    
    const sunriseHour = sunriseBase - latFactor * seasonFactor;
    const sunsetHour = sunsetBase + latFactor * seasonFactor;
    
    const formatTime = (hour) => {
        const h = Math.floor(hour);
        const m = Math.floor((hour - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };
    
    return {
        sunrise: formatTime(sunriseHour),
        sunset: formatTime(sunsetHour)
    };
}

// Theme Toggle
function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (btn) {
        // Remove any existing listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        const newBtnRef = document.getElementById('themeToggle');
        if (newBtnRef) {
            newBtnRef.addEventListener('click', toggleTheme);
        }
        applyTheme();
    }
}

function toggleTheme() {
    if (currentTheme === 'auto') {
        currentTheme = 'light';
    } else if (currentTheme === 'light') {
        currentTheme = 'dark';
    } else {
        currentTheme = 'auto';
    }
    
    saveTheme();
    applyTheme();
}

function saveTheme() {
    try {
        localStorage.setItem(CACHE_KEY_THEME, currentTheme);
    } catch (e) {
        console.warn('Could not save theme', e);
    }
}

function applyTheme() {
    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');
    
    if (currentTheme === 'auto') {
        document.body.removeAttribute('data-theme');
        if (icon) icon.textContent = '🌓';
        if (label) label.textContent = 'Auto';
        updateTimeBasedTheme();
    } else {
        document.body.setAttribute('data-theme', currentTheme);
        document.body.removeAttribute('data-time-theme');
        if (icon) icon.textContent = currentTheme === 'light' ? '☀️' : '🌙';
        if (label) label.textContent = currentTheme === 'light' ? 'Light' : 'Dark';
    }
}

function updateTimeBasedTheme() {
    if (currentTheme !== 'auto') return;
    
    if (!currentCountry) {
        document.body.removeAttribute('data-theme');
        document.body.setAttribute('data-time-theme', 'night');
        return;
    }
    
    try {
        const now = new Date();
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: currentCountry.timezone }));
        const hour = tzDate.getHours();
        
        let theme;
        if (hour >= 6 && hour < 12) {
            theme = 'morning';
        } else if (hour >= 12 && hour < 17) {
            theme = 'afternoon';
        } else if (hour >= 17 && hour < 20) {
            theme = 'evening';
        } else {
            theme = 'night';
        }
        
        document.body.removeAttribute('data-theme');
        document.body.setAttribute('data-time-theme', theme);
    } catch (err) {
        document.body.removeAttribute('data-theme');
        document.body.setAttribute('data-time-theme', 'night');
    }
}

// Clock Mode (Digital/Analog)
function setupClockMode() {
    const btn = document.getElementById('clockModeBtn');
    if (btn) {
        btn.addEventListener('click', toggleClockMode);
    }
}

function toggleClockMode() {
    clockMode = clockMode === 'digital' ? 'analog' : 'digital';
    saveClockMode();
    applyClockMode();
}

function saveClockMode() {
    try {
        localStorage.setItem(CACHE_KEY_CLOCK_MODE, clockMode);
    } catch (e) {
        console.warn('Could not save clock mode', e);
    }
}

function applyClockMode() {
    const digital = document.getElementById('digitalClock');
    const analog = document.getElementById('analogClock');
    const icon = document.getElementById('clockModeIcon');
    const label = document.getElementById('clockModeLabel');
    
    if (clockMode === 'analog') {
        if (digital) digital.style.display = 'none';
        if (analog) analog.style.display = 'flex';
        if (icon) icon.textContent = '🕰️';
        if (label) label.textContent = 'Analog';
        updateAnalogClock();
    } else {
        if (digital) digital.style.display = 'block';
        if (analog) analog.style.display = 'none';
        if (icon) icon.textContent = '🔢';
        if (label) label.textContent = 'Digital';
    }
}

function updateAnalogClock() {
    if (clockMode !== 'analog' || !currentCountry) return;
    
    try {
        const now = new Date();
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: currentCountry.timezone }));
        const hours = tzDate.getHours() % 12;
        const minutes = tzDate.getMinutes();
        const seconds = tzDate.getSeconds();
        
        const hourHand = document.getElementById('hourHand');
        const minuteHand = document.getElementById('minuteHand');
        const secondHand = document.getElementById('secondHand');
        
        if (hourHand) hourHand.style.transform = `rotate(${(hours * 30) + (minutes * 0.5)}deg)`;
        if (minuteHand) minuteHand.style.transform = `rotate(${minutes * 6}deg)`;
        if (secondHand) secondHand.style.transform = `rotate(${seconds * 6}deg)`;
    } catch (err) {
        console.warn('Could not update analog clock', err);
    }
}

// Share functionality
function setupShareButton() {
    const btn = document.getElementById('shareBtn');
    if (btn) {
        btn.addEventListener('click', shareCurrentTime);
    }
}

async function shareCurrentTime() {
    if (!currentCountry) {
        alert('Please select a country first');
        return;
    }
    
    const time = document.getElementById('currentTime').textContent;
    const date = document.getElementById('currentDate').textContent;
    const text = `🌍 ${currentCountry.name}\n⏰ ${time}\n📅 ${date}\n🌐 ${currentCountry.timezone}`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Global Time',
                text: text,
                url: window.location.href
            });
        } catch (err) {
            if (err.name !== 'AbortError') {
                fallbackShare(text);
            }
        }
    } else {
        fallbackShare(text);
    }
}

function fallbackShare(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('✓ Copied to clipboard!');
        }).catch(() => {
            showToast('Could not copy to clipboard');
        });
    } else {
        showToast('Share not supported');
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('toast-visible'), 100);
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

window.addEventListener('resize', () => {
    detectMobile();
    if (currentCountry) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        const flagEl = document.getElementById('flagEmoji');
        if (flagEl) {
            flagEl.textContent = isMobile ? currentCountry.flag : (currentCountry.countryCode || '—');
        }
    }
});

window.addEventListener('online', updateMapOfflineState);
window.addEventListener('offline', updateMapOfflineState);

// ============ GEOLOCATION AUTO-SELECT ============
function setupGeolocation() {
    if (!navigator.geolocation) return;
    const saved = localStorage.getItem('globalTime_geolocationAsked');
    if (saved) return;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            lastKnownLocation = { latitude, longitude };
            const nearest = findNearestCountry(latitude, longitude);
            if (nearest) {
                selectCountry(nearest);
                showToast(`📍 Auto-selected: ${nearest.name}`);
            } else {
                showToast('📍 Location found, but no nearby country matched');
            }
            localStorage.setItem('globalTime_geolocationAsked', 'true');
        },
        (error) => {
            if (error && error.code === 1) {
                // Permission denied: do not keep asking on every load
                localStorage.setItem('globalTime_geolocationAsked', 'true');
                showToast('Location permission denied');
            } else {
                // Timeout or unavailable: allow retry on next load
                showToast('Location unavailable, please try again');
            }
        },
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
    );
}

function findNearestCountry(lat, lng) {
    let nearest = null;
    let minDist = Infinity;
    countries.forEach(country => {
        const dLat = country.lat - lat;
        const dLng = country.lng - lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        if (dist < minDist) {
            minDist = dist;
            nearest = country;
        }
    });
    return nearest;
}

// ============ BULK TIMEZONE COMPARISON ============
function setupBulkComparison() {
    const compareSearch = document.getElementById('compareSearch');
    const compareDropdown = document.getElementById('compareDropdown');
    const addBtn = document.getElementById('addComparisonBtn');
    const clearBtn = document.getElementById('clearComparisonBtn');
    const copyWidgetBtn = document.getElementById('copyWidgetBtn');
    
    let selectedForComparison = null;
    
    if (compareSearch) {
        compareSearch.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase().trim();
            
            if (!q) {
                if (compareDropdown) compareDropdown.style.display = 'none';
                selectedForComparison = null;
                if (addBtn) addBtn.disabled = true;
                return;
            }
            
            // Filter countries matching the search query
            const matches = countries.filter(c => 
                (c.name.toLowerCase().includes(q) || c.timezone.toLowerCase().includes(q)) &&
                !comparisonCountries.find(comp => comp.name === c.name)
            );
            
            // Show dropdown with matches
            if (compareDropdown) {
                compareDropdown.innerHTML = '';
                if (matches.length > 0) {
                    matches.forEach(country => {
                        const item = document.createElement('div');
                        item.className = 'compare-dropdown-item';
                        item.innerHTML = `
                            <span class="comp-drop-flag">${country.flag}</span>
                            <div class="comp-drop-info">
                                <div class="comp-drop-name">${country.name}</div>
                                <div class="comp-drop-tz">${country.timezone}</div>
                            </div>
                            <span class="comp-drop-dial">${country.dialingCode}</span>
                        `;
                        item.addEventListener('click', () => {
                            if (!comparisonCountries.find(c => c.name === country.name)) {
                                comparisonCountries.push(country);
                                updateBulkComparison();
                                compareSearch.value = '';
                                compareDropdown.style.display = 'none';
                                selectedForComparison = null;
                                if (addBtn) addBtn.disabled = true;
                            }
                        });
                        compareDropdown.appendChild(item);
                    });
                    compareDropdown.style.display = 'block';
                    selectedForComparison = matches[0];
                } else {
                    compareDropdown.innerHTML = '<div class="compare-dropdown-empty">No countries found</div>';
                    compareDropdown.style.display = 'block';
                    selectedForComparison = null;
                }
            }
            
            if (addBtn) addBtn.disabled = !selectedForComparison;
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (compareSearch && compareDropdown && !compareSearch.contains(e.target) && !compareDropdown.contains(e.target)) {
                compareDropdown.style.display = 'none';
            }
        });
    }
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (selectedForComparison && !comparisonCountries.find(c => c.name === selectedForComparison.name)) {
                comparisonCountries.push(selectedForComparison);
                updateBulkComparison();
                if (compareSearch) compareSearch.value = '';
                if (compareDropdown) compareDropdown.style.display = 'none';
                selectedForComparison = null;
                addBtn.disabled = true;
            }
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            comparisonCountries = [];
            updateBulkComparison();
        });
    }
    
    if (copyWidgetBtn) {
        copyWidgetBtn.addEventListener('click', () => {
            const textarea = document.getElementById('widgetEmbedCode');
            if (textarea) {
                textarea.select();
                document.execCommand('copy');
                showToast('Widget code copied to clipboard!');
            }
        });
    }
    
    // Initial widget setup
    updateBulkComparison();
}

function setupWidgetOptions() {
    // Populate country dropdown
    const countrySelect = document.getElementById('widgetCountrySelect');
    if (countrySelect) {
        const isMobile = window.innerWidth < 768;
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.timezone;
            option.textContent = isMobile ? `${country.flag} ${country.name}` : country.name;
            countrySelect.appendChild(option);
        });
        
        // Set default to currentCountry
        if (currentCountry) {
            countrySelect.value = currentCountry.timezone;
        }
        
        // Add change listener
        countrySelect.addEventListener('change', () => {
            updateWidgetEmbed();
        });
    }
    
    // Setup clock type radio listeners
    const clockTypeRadios = document.querySelectorAll('input[name="widgetClockType"]');
    clockTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateWidgetEmbed();
        });
    });
    
    // Setup theme radio listeners and initialize from first checked
    const themeRadios = document.querySelectorAll('input[name="widgetTheme"]');
    themeRadios.forEach(radio => {
        if (radio.checked) {
            widgetTheme = radio.value;
        }
        radio.addEventListener('change', (e) => {
            widgetTheme = e.target.value;
            updateWidgetEmbed();
        });
    });
}

function setupApiSection() {
    const tzSelect = document.getElementById('apiTimezoneSelect');
    const widgetTzSelect = document.getElementById('apiWidgetTimezoneSelect');
    if (!tzSelect || !widgetTzSelect) return;

    const isMobile = window.innerWidth < 768;
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.timezone;
        option.textContent = isMobile ? `${country.flag} ${country.name}` : country.name;
        tzSelect.appendChild(option);

        const widgetOption = document.createElement('option');
        widgetOption.value = country.timezone;
        widgetOption.textContent = isMobile ? `${country.flag} ${country.name}` : country.name;
        widgetTzSelect.appendChild(widgetOption);
    });

    const defaultTz = currentCountry?.timezone || countries[0]?.timezone || 'UTC';
    tzSelect.value = defaultTz;
    widgetTzSelect.value = defaultTz;

    tzSelect.addEventListener('change', updateApiUrls);
    widgetTzSelect.addEventListener('change', updateApiUrls);

    document.querySelectorAll('input[name="apiWidgetClockType"]').forEach(radio => {
        radio.addEventListener('change', updateApiUrls);
    });

    document.querySelectorAll('input[name="apiWidgetTheme"]').forEach(radio => {
        radio.addEventListener('change', updateApiUrls);
    });

    const apiTab = document.getElementById('apiTab');
    if (apiTab) {
        apiTab.querySelectorAll('[data-copy-target]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-copy-target');
                const field = document.getElementById(targetId);
                if (!field) return;
                const text = field.value;
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(() => {
                        showToast('API URL copied to clipboard!');
                    }).catch(() => {
                        field.select();
                        document.execCommand('copy');
                        showToast('API URL copied to clipboard!');
                    });
                } else {
                    field.select();
                    document.execCommand('copy');
                    showToast('API URL copied to clipboard!');
                }
            });
        });
    }

    updateApiUrls();
}

function updateApiUrls() {
    const tzSelect = document.getElementById('apiTimezoneSelect');
    const widgetTzSelect = document.getElementById('apiWidgetTimezoneSelect');
    const tz = tzSelect?.value || 'UTC';
    const widgetTz = widgetTzSelect?.value || tz;
    const apiBase = 'https://globeclock.netlify.app';

    const clockTypeEl = document.querySelector('input[name="apiWidgetClockType"]:checked');
    const themeEl = document.querySelector('input[name="apiWidgetTheme"]:checked');
    const clockType = clockTypeEl ? clockTypeEl.value : 'digital';
    const theme = themeEl ? themeEl.value : 'auto';

    const timezoneUrl = `${apiBase}/.netlify/functions/timezone?tz=${encodeURIComponent(tz)}`;
    const timeUrl = `${apiBase}/.netlify/functions/time?tz=${encodeURIComponent(tz)}`;
    const listUrl = `${apiBase}/.netlify/functions/list`;
    const widgetUrl = `${apiBase}/?widget=1&tz=${encodeURIComponent(widgetTz)}&clock=${encodeURIComponent(clockType)}&theme=${encodeURIComponent(theme)}`;
    const widgetJsonUrl = `${apiBase}/.netlify/functions/widget?tz=${encodeURIComponent(widgetTz)}&clock=${encodeURIComponent(clockType)}&theme=${encodeURIComponent(theme)}`;

    const timezoneField = document.getElementById('apiTimezoneUrl');
    const timeField = document.getElementById('apiTimeUrl');
    const listField = document.getElementById('apiListUrl');
    const widgetField = document.getElementById('apiWidgetUrl');
    const widgetJsonField = document.getElementById('apiWidgetJsonUrl');

    if (timezoneField) timezoneField.value = timezoneUrl;
    if (timeField) timeField.value = timeUrl;
    if (listField) listField.value = listUrl;
    if (widgetField) widgetField.value = widgetUrl;
    if (widgetJsonField) widgetJsonField.value = widgetJsonUrl;
}

function updateBulkComparison() {
    const grid = document.getElementById('comparisonGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (comparisonCountries.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px 20px;">No countries selected yet. Start by searching above!</p>';
        // Clear interval when no countries
        if (comparisonUpdateInterval) {
            clearInterval(comparisonUpdateInterval);
            comparisonUpdateInterval = null;
        }
        return;
    }
    
    comparisonCountries.forEach((country, index) => {
        const time = getCurrentTimeForCountry(country);
        const hour = time ? parseInt(time.split(':')[0]) : 12;
        const emoji = getTimeEmoji(hour);
        
        const card = document.createElement('div');
        card.className = 'comparison-card';
        card.innerHTML = `
            <div class="comp-header">
                <span class="comp-flag">${country.flag}</span>
                <button type="button" class="comp-remove" data-index="${index}" title="Remove">×</button>
            </div>
            <div class="comp-name">${country.name}</div>
            <div class="comp-time" data-tz="${country.timezone}">${emoji} ${time || '--:--:--'}</div>
            <div class="comp-tz">${country.timezone}</div>
            <div class="comp-dial" title="International dialing code">${country.dialingCode}</div>
        `;
        
        const removeBtn = card.querySelector('.comp-remove');
        removeBtn.addEventListener('click', () => {
            comparisonCountries.splice(index, 1);
            updateBulkComparison();
        });
        
        grid.appendChild(card);
    });
    
    // Start interval for continuous updates
    if (!comparisonUpdateInterval) {
        comparisonUpdateInterval = setInterval(updateComparisonTimes, 1000);
    }
    
    // Show/hide comparison details button
    updateComparisonDetailsButton();
    
    // Update widget code
    updateWidgetEmbed();
}

function updateWidgetEmbed() {
    const textarea = document.getElementById('widgetEmbedCode');
    const preview = document.getElementById('widgetPreview');
    
    // Get selected country from dropdown
    const countrySelect = document.getElementById('widgetCountrySelect');
    const selectedTz = countrySelect?.value || currentCountry?.timezone;
    const country = countries.find(c => c.timezone === selectedTz) || currentCountry;
    
    if (!country) return;
    
    // Get selected clock type from radio buttons
    const clockTypeRadios = document.querySelectorAll('input[name="widgetClockType"]');
    let selectedClockType = 'digital';
    clockTypeRadios.forEach(radio => {
        if (radio.checked) {
            selectedClockType = radio.value;
        }
    });
    
    // Get selected theme
    const selectedTheme = widgetTheme || 'auto';
    
    // Dynamic sizing based on clock type
    const iframeWidth = selectedClockType === 'analog' ? '380' : '320';
    const iframeHeight = selectedClockType === 'analog' ? '420' : '220';
    
    const widgetCode = `<iframe 
  src="${window.location.origin}${window.location.pathname}?tz=${encodeURIComponent(country.timezone)}&widget=1&clock=${selectedClockType}&theme=${selectedTheme}" 
  width="${iframeWidth}" 
  height="${iframeHeight}" 
  frameborder="0" 
  style="border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
</iframe>`;
    
    if (textarea) textarea.value = widgetCode;
    
    if (preview) {
        // Create actual iframe preview so users see exact theme rendering
        // Add cache-busting parameter to force iframe reload
        const iframeId = `widget-preview-${Math.random().toString(36).substr(2, 9)}`;
        const cacheBust = `&cb=${Date.now()}`;
        const previewUrl = `${window.location.origin}${window.location.pathname}?tz=${encodeURIComponent(country.timezone)}&widget=1&clock=${selectedClockType}&theme=${selectedTheme}${cacheBust}`;
        
        preview.innerHTML = `<div style="padding: 20px; text-align: center;">
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0 0 12px; font-weight: 500;">Live Preview (${selectedTheme} • ${selectedClockType})</p>
            <iframe 
                id="${iframeId}"
                src="${previewUrl}" 
                width="${iframeWidth}" 
                height="${iframeHeight}" 
                frameborder="0" 
                scrolling="no"
                style="border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: block; margin: 0 auto; overflow: hidden;">
            </iframe>
        </div>`;
    }
}

// Update comparison times continuously
function updateComparisonTimes() {
    const compTimeElements = document.querySelectorAll('.comp-time');
    compTimeElements.forEach((el, index) => {
        const tz = el.getAttribute('data-tz');
        if (tz && comparisonCountries[index]) {
            const time = getCurrentTimeForCountry(comparisonCountries[index]);
            const hour = time ? parseInt(time.split(':')[0]) : 12;
            const emoji = getTimeEmoji(hour);
            el.textContent = `${emoji} ${time || '--:--:--'}`;
        }
    });
}

// Show/hide comparison details button based on number of selected countries
function updateComparisonDetailsButton() {
    const btn = document.getElementById('showCompareDetailsBtn');
    if (!btn) return;
    
    if (comparisonCountries.length >= 2) {
        btn.style.display = 'inline-block';
        btn.onclick = showComparisonDetails;
    } else {
        btn.style.display = 'none';
        // Hide details if less than 2 countries
        const detailsEl = document.getElementById('comparisonDetails');
        if (detailsEl) detailsEl.style.display = 'none';
    }
}

// Show comparison details (timezone differences, UTC offsets)
function showComparisonDetails() {
    const detailsEl = document.getElementById('comparisonDetails');
    if (!detailsEl) return;
    
    if (comparisonCountries.length < 2) {
        detailsEl.style.display = 'none';
        return;
    }
    
    // Toggle display
    if (detailsEl.style.display === 'block') {
        detailsEl.style.display = 'none';
        document.getElementById('showCompareDetailsBtn').textContent = 'Show Comparison Details';
        return;
    }
    
    detailsEl.innerHTML = '<h4 style=\"margin: 0 0 15px; color: var(--text); font-size: 1.1rem;\">Timezone Comparison Details</h4>';
    
    // Calculate all pairwise comparisons
    for (let i = 0; i < comparisonCountries.length; i++) {
        for (let j = i + 1; j < comparisonCountries.length; j++) {
            const country1 = comparisonCountries[i];
            const country2 = comparisonCountries[j];
            
            // Get current times and dates
            const now = new Date();
            const date1 = new Date(now.toLocaleString('en-US', { timeZone: country1.timezone }));
            const date2 = new Date(now.toLocaleString('en-US', { timeZone: country2.timezone }));
            
            // Calculate time difference
            const offset1 = -date1.getTimezoneOffset();
            const offset2 = -date2.getTimezoneOffset();
            const offsetDiffHours = Math.abs(offset1 - offset2) / 60;
            const aheadBehind = offset1 > offset2 ? `${country1.name} is ahead` : `${country2.name} is ahead`;
            
            // Check day difference
            const day1 = date1.getDate();
            const day2 = date2.getDate();
            const dayDiff = Math.abs(day1 - day2);
            
            // Get formatted dates
            const dateFormatter = new Intl.DateTimeFormat('en-US', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
            const formattedDate1 = dateFormatter.format(date1);
            const formattedDate2 = dateFormatter.format(date2);
            
            // Calculate scheduling examples
            const getTimeInTz = (hour, minute, fromTz, toTz) => {
                const testDate = new Date();
                testDate.setHours(hour, minute, 0, 0);
                const fromString = testDate.toLocaleString('en-US', { timeZone: fromTz, hour12: false });
                const toDate = new Date(fromString);
                const formatter = new Intl.DateTimeFormat('en-US', { 
                    timeZone: toTz, 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                });
                return formatter.format(toDate);
            };
            
            const time9amIn2 = getTimeInTz(9, 0, country1.timezone, country2.timezone);
            const time5pmIn2 = getTimeInTz(17, 0, country1.timezone, country2.timezone);
            const time9amIn1 = getTimeInTz(9, 0, country2.timezone, country1.timezone);
            
            // Check business hours overlap (9 AM - 5 PM)
            const hour1 = date1.getHours();
            const hour2 = date2.getHours();
            const inWorkHours1 = hour1 >= 9 && hour1 < 17;
            const inWorkHours2 = hour2 >= 9 && hour2 < 17;
            const workOverlap = inWorkHours1 && inWorkHours2 ? '✅ Both in business hours' : 
                                inWorkHours1 ? `⏰ Only ${country1.name} in business hours` :
                                inWorkHours2 ? `⏰ Only ${country2.name} in business hours` :
                                '🌙 Both outside business hours';
            
            const comparisonCard = document.createElement('div');
            comparisonCard.className = 'comparison-detail-card';
            comparisonCard.innerHTML = `
                <div class="comp-detail-header">
                    <span>${country1.flag} ${country1.name}</span>
                    <span style="margin: 0 10px; opacity: 0.6;">↔</span>
                    <span>${country2.flag} ${country2.name}</span>
                </div>
                <div class="comp-detail-body">
                    <div class="comp-detail-item">
                        <span class="comp-detail-label">Time Difference:</span>
                        <span class="comp-detail-value">${offsetDiffHours} hour${offsetDiffHours !== 1 ? 's' : ''} (${aheadBehind})</span>
                    </div>
                    ${dayDiff > 0 ? `
                    <div class="comp-detail-item comp-detail-warning">
                        <span class="comp-detail-label">⚠️ Day Difference:</span>
                        <span class="comp-detail-value">${dayDiff} day${dayDiff !== 1 ? 's' : ''} apart</span>
                    </div>` : ''}
                    <div class="comp-detail-item">
                        <span class="comp-detail-label">${country1.name} Date:</span>
                        <span class="comp-detail-value">${formattedDate1}</span>
                    </div>
                    <div class="comp-detail-item">
                        <span class="comp-detail-label">${country2.name} Date:</span>
                        <span class="comp-detail-value">${formattedDate2}</span>
                    </div>
                    <div class="comp-detail-item comp-detail-schedule">
                        <span class="comp-detail-label">When 9 AM in ${country1.name}:</span>
                        <span class="comp-detail-value">${time9amIn2} in ${country2.name}</span>
                    </div>
                    <div class="comp-detail-item comp-detail-schedule">
                        <span class="comp-detail-label">When 5 PM in ${country1.name}:</span>
                        <span class="comp-detail-value">${time5pmIn2} in ${country2.name}</span>
                    </div>
                    <div class="comp-detail-item comp-detail-schedule">
                        <span class="comp-detail-label">When 9 AM in ${country2.name}:</span>
                        <span class="comp-detail-value">${time9amIn1} in ${country1.name}</span>
                    </div>
                    <div class="comp-detail-item comp-detail-overlap">
                        <span class="comp-detail-label">Current Status:</span>
                        <span class="comp-detail-value">${workOverlap}</span>
                    </div>
                </div>
            `;
            detailsEl.appendChild(comparisonCard);
        }
    }
    
    detailsEl.style.display = 'block';
    document.getElementById('showCompareDetailsBtn').textContent = 'Hide Comparison Details';
}

// Update date in meta-grid
function updateDateInMetaGrid() {
    const dateEl = document.getElementById('currentDateMeta');
    if (!dateEl || !currentCountry) return;
    
    try {
        const now = new Date();
        const dateFormatter = new Intl.DateTimeFormat('en-US', { 
            timeZone: currentCountry.timezone, 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        const formattedDate = dateFormatter.format(now);
        dateEl.textContent = formattedDate;
    } catch (err) {
        dateEl.textContent = '--';
    }
}

document.addEventListener('DOMContentLoaded', init);
