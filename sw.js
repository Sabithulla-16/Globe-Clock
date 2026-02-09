// Service Worker — Global Time Converter PWA (offline-first)
const CACHE_SHELL = 'global-time-shell-v3';
const CACHE_API = 'global-time-api-v1';
const SHELL_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icon.svg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

const NAGER_ORIGIN = 'https://date.nager.at';

// Country data for API responses
const countries = [
  { name: 'United States (New York)', timezone: 'America/New_York', flag: '🇺🇸', countryCode: 'US', dialingCode: '+1' },
  { name: 'United States (Los Angeles)', timezone: 'America/Los_Angeles', flag: '🇺🇸', countryCode: 'US', dialingCode: '+1' },
  { name: 'United States (Chicago)', timezone: 'America/Chicago', flag: '🇺🇸', countryCode: 'US', dialingCode: '+1' },
  { name: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧', countryCode: 'GB', dialingCode: '+44' },
  { name: 'France', timezone: 'Europe/Paris', flag: '🇫🇷', countryCode: 'FR', dialingCode: '+33' },
  { name: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪', countryCode: 'DE', dialingCode: '+49' },
  { name: 'Italy', timezone: 'Europe/Rome', flag: '🇮🇹', countryCode: 'IT', dialingCode: '+39' },
  { name: 'Spain', timezone: 'Europe/Madrid', flag: '🇪🇸', countryCode: 'ES', dialingCode: '+34' },
  { name: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵', countryCode: 'JP', dialingCode: '+81' },
  { name: 'China', timezone: 'Asia/Shanghai', flag: '🇨🇳', countryCode: 'CN', dialingCode: '+86' },
  { name: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', countryCode: null, dialingCode: '+91' },
  { name: 'Australia (Sydney)', timezone: 'Australia/Sydney', flag: '🇦🇺', countryCode: 'AU', dialingCode: '+61' },
  { name: 'Australia (Melbourne)', timezone: 'Australia/Melbourne', flag: '🇦🇺', countryCode: 'AU', dialingCode: '+61' },
  { name: 'Brazil (São Paulo)', timezone: 'America/Sao_Paulo', flag: '🇧🇷', countryCode: 'BR', dialingCode: '+55' },
  { name: 'Brazil (Rio de Janeiro)', timezone: 'America/Sao_Paulo', flag: '🇧🇷', countryCode: 'BR', dialingCode: '+55' },
  { name: 'Canada (Toronto)', timezone: 'America/Toronto', flag: '🇨🇦', countryCode: 'CA', dialingCode: '+1' },
  { name: 'Canada (Vancouver)', timezone: 'America/Vancouver', flag: '🇨🇦', countryCode: 'CA', dialingCode: '+1' },
  { name: 'Mexico', timezone: 'America/Mexico_City', flag: '🇲🇽', countryCode: 'MX', dialingCode: '+52' },
  { name: 'Russia (Moscow)', timezone: 'Europe/Moscow', flag: '🇷🇺', countryCode: 'RU', dialingCode: '+7' },
  { name: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷', countryCode: 'KR', dialingCode: '+82' },
  { name: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬', countryCode: 'SG', dialingCode: '+65' },
  { name: 'Thailand', timezone: 'Asia/Bangkok', flag: '🇹🇭', countryCode: null, dialingCode: '+66' },
  { name: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: '🇦🇪', countryCode: null, dialingCode: '+971' },
  { name: 'South Africa', timezone: 'Africa/Johannesburg', flag: '🇿🇦', countryCode: 'ZA', dialingCode: '+27' },
  { name: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬', countryCode: 'EG', dialingCode: '+20' },
  { name: 'Turkey', timezone: 'Europe/Istanbul', flag: '🇹🇷', countryCode: 'TR', dialingCode: '+90' },
  { name: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', countryCode: 'AR', dialingCode: '+54' },
  { name: 'Chile', timezone: 'America/Santiago', flag: '🇨🇱', countryCode: 'CL', dialingCode: '+56' },
  { name: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿', countryCode: 'NZ', dialingCode: '+64' },
  { name: 'Indonesia (Jakarta)', timezone: 'Asia/Jakarta', flag: '🇮🇩', countryCode: 'ID', dialingCode: '+62' },
  { name: 'Philippines', timezone: 'Asia/Manila', flag: '🇵🇭', countryCode: 'PH', dialingCode: '+63' },
  { name: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾', countryCode: null, dialingCode: '+60' },
  { name: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', flag: '🇻🇳', countryCode: 'VN', dialingCode: '+84' },
  { name: 'Saudi Arabia', timezone: 'Asia/Riyadh', flag: '🇸🇦', countryCode: null, dialingCode: '+966' },
  { name: 'Israel', timezone: 'Asia/Jerusalem', flag: '🇮🇱', countryCode: null, dialingCode: '+972' },
  { name: 'Poland', timezone: 'Europe/Warsaw', flag: '🇵🇱', countryCode: 'PL', dialingCode: '+48' },
  { name: 'Netherlands', timezone: 'Europe/Amsterdam', flag: '🇳🇱', countryCode: 'NL', dialingCode: '+31' },
  { name: 'Sweden', timezone: 'Europe/Stockholm', flag: '🇸🇪', countryCode: 'SE', dialingCode: '+46' },
  { name: 'Norway', timezone: 'Europe/Oslo', flag: '🇳🇴', countryCode: 'NO', dialingCode: '+47' },
  { name: 'Denmark', timezone: 'Europe/Copenhagen', flag: '🇩🇰', countryCode: 'DK', dialingCode: '+45' },
  { name: 'Switzerland', timezone: 'Europe/Zurich', flag: '🇨🇭', countryCode: 'CH', dialingCode: '+41' },
  { name: 'Belgium', timezone: 'Europe/Brussels', flag: '🇧🇪', countryCode: 'BE', dialingCode: '+32' },
  { name: 'Austria', timezone: 'Europe/Vienna', flag: '🇦🇹', countryCode: 'AT', dialingCode: '+43' },
  { name: 'Greece', timezone: 'Europe/Athens', flag: '🇬🇷', countryCode: 'GR', dialingCode: '+30' },
  { name: 'Portugal', timezone: 'Europe/Lisbon', flag: '🇵🇹', countryCode: 'PT', dialingCode: '+351' },
  { name: 'Ireland', timezone: 'Europe/Dublin', flag: '🇮🇪', countryCode: 'IE', dialingCode: '+353' },
  { name: 'Finland', timezone: 'Europe/Helsinki', flag: '🇫🇮', countryCode: 'FI', dialingCode: '+358' },
  { name: 'Czech Republic', timezone: 'Europe/Prague', flag: '🇨🇿', countryCode: 'CZ', dialingCode: '+420' },
  { name: 'Hungary', timezone: 'Europe/Budapest', flag: '🇭🇺', countryCode: 'HU', dialingCode: '+36' },
  { name: 'Romania', timezone: 'Europe/Bucharest', flag: '🇷🇴', countryCode: 'RO', dialingCode: '+40' }
];

// API Handler Functions
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
  const localOffset = now.getTimezoneOffset();
  const tzOffset = -Math.round((tzDate - now) / 60000);
  const utcOffset = tzOffset + localOffset;
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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_SHELL).then((cache) => {
      return Promise.allSettled(
        SHELL_URLS.map((url) =>
          fetch(url, { mode: 'cors' }).then((res) => {
            if (res.ok) return cache.put(url, res);
          }).catch(() => {})
        )
      ).then(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_SHELL && k !== CACHE_API).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // =========================
  // API ENDPOINT INTERCEPTION
  // =========================
  if (url.origin === self.location.origin && url.searchParams.has('api')) {
    const apiType = url.searchParams.get('api');
    const timezone = url.searchParams.get('tz');
    
    let response;
    
    if (apiType === 'timezone' && timezone) {
      response = getTimezoneData(timezone);
    } else if (apiType === 'time' && timezone) {
      response = getSimpleTimeData(timezone);
    } else if (apiType === 'list') {
      response = getAllTimezonesData();
    } else {
      response = {
        status: 'error',
        message: 'Invalid parameters',
        usage: {
          'Get current time for timezone': '?api=timezone&tz=America/New_York',
          'Get simple time only': '?api=time&tz=America/New_York',
          'Get all timezones list': '?api=list'
        }
      };
    }
    
    // Return proper JSON Response
    event.respondWith(
      Promise.resolve(new Response(JSON.stringify(response, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      }))
    );
    return;
  }

  // API: cache first from network, fallback to cache when offline
  if (url.origin === NAGER_ORIGIN && event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_API).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // App shell: cache first, then network
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      caches.match('/index.html').then((cached) => cached || fetch(event.request))
    );
    return;
  }

  if (SHELL_URLS.some((u) => url.href === u || (url.origin + url.pathname) === u)) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_SHELL).then((cache) => cache.put(event.request, clone));
        return res;
      }))
    );
    return;
  }

  // Default: network first, fallback to cache for same-origin
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
