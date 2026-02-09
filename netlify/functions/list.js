// Netlify Function: Get all available timezones
// Endpoint: /.netlify/functions/list

const countries = [
  { name: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', countryCode: 'IN', dialingCode: '+91' },
  { name: 'United States (New York)', timezone: 'America/New_York', flag: '🇺🇸', countryCode: 'US', dialingCode: '+1' },
  { name: 'United States (Los Angeles)', timezone: 'America/Los_Angeles', flag: '🇺🇸', countryCode: 'US', dialingCode: '+1' },
  { name: 'United States (Chicago)', timezone: 'America/Chicago', flag: '🇺🇸', countryCode: 'US', dialingCode: '+1' },
  { name: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧', countryCode: 'GB', dialingCode: '+44' },
  { name: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵', countryCode: 'JP', dialingCode: '+81' },
  { name: 'Australia (Sydney)', timezone: 'Australia/Sydney', flag: '🇦🇺', countryCode: 'AU', dialingCode: '+61' },
  { name: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪', countryCode: 'DE', dialingCode: '+49' },
  { name: 'France', timezone: 'Europe/Paris', flag: '🇫🇷', countryCode: 'FR', dialingCode: '+33' },
  { name: 'China', timezone: 'Asia/Shanghai', flag: '🇨🇳', countryCode: 'CN', dialingCode: '+86' },
  { name: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷', countryCode: 'BR', dialingCode: '+55' },
  { name: 'Russia (Moscow)', timezone: 'Europe/Moscow', flag: '🇷🇺', countryCode: 'RU', dialingCode: '+7' },
  { name: 'Canada (Toronto)', timezone: 'America/Toronto', flag: '🇨🇦', countryCode: 'CA', dialingCode: '+1' },
  { name: 'Mexico', timezone: 'America/Mexico_City', flag: '🇲🇽', countryCode: 'MX', dialingCode: '+52' },
  { name: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷', countryCode: 'KR', dialingCode: '+82' },
  { name: 'Italy', timezone: 'Europe/Rome', flag: '🇮🇹', countryCode: 'IT', dialingCode: '+39' },
  { name: 'Spain', timezone: 'Europe/Madrid', flag: '🇪🇸', countryCode: 'ES', dialingCode: '+34' },
  { name: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', countryCode: 'AR', dialingCode: '+54' },
  { name: 'South Africa', timezone: 'Africa/Johannesburg', flag: '🇿🇦', countryCode: 'ZA', dialingCode: '+27' },
  { name: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬', countryCode: 'EG', dialingCode: '+20' },
  { name: 'Turkey', timezone: 'Europe/Istanbul', flag: '🇹🇷', countryCode: 'TR', dialingCode: '+90' },
  { name: 'Saudi Arabia', timezone: 'Asia/Riyadh', flag: '🇸🇦', countryCode: 'SA', dialingCode: '+966' },
  { name: 'UAE', timezone: 'Asia/Dubai', flag: '🇦🇪', countryCode: 'AE', dialingCode: '+971' },
  { name: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬', countryCode: 'SG', dialingCode: '+65' },
  { name: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾', countryCode: 'MY', dialingCode: '+60' },
  { name: 'Thailand', timezone: 'Asia/Bangkok', flag: '🇹🇭', countryCode: 'TH', dialingCode: '+66' },
  { name: 'Indonesia', timezone: 'Asia/Jakarta', flag: '🇮🇩', countryCode: 'ID', dialingCode: '+62' },
  { name: 'Philippines', timezone: 'Asia/Manila', flag: '🇵🇭', countryCode: 'PH', dialingCode: '+63' },
  { name: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', flag: '🇻🇳', countryCode: 'VN', dialingCode: '+84' },
  { name: 'Pakistan', timezone: 'Asia/Karachi', flag: '🇵🇰', countryCode: 'PK', dialingCode: '+92' },
  { name: 'Bangladesh', timezone: 'Asia/Dhaka', flag: '🇧🇩', countryCode: 'BD', dialingCode: '+880' },
  { name: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿', countryCode: 'NZ', dialingCode: '+64' },
  { name: 'Israel', timezone: 'Asia/Jerusalem', flag: '🇮🇱', countryCode: 'IL', dialingCode: '+972' },
  { name: 'Sweden', timezone: 'Europe/Stockholm', flag: '🇸🇪', countryCode: 'SE', dialingCode: '+46' },
  { name: 'Norway', timezone: 'Europe/Oslo', flag: '🇳🇴', countryCode: 'NO', dialingCode: '+47' },
  { name: 'Denmark', timezone: 'Europe/Copenhagen', flag: '🇩🇰', countryCode: 'DK', dialingCode: '+45' },
  { name: 'Netherlands', timezone: 'Europe/Amsterdam', flag: '🇳🇱', countryCode: 'NL', dialingCode: '+31' },
  { name: 'Switzerland', timezone: 'Europe/Zurich', flag: '🇨🇭', countryCode: 'CH', dialingCode: '+41' },
  { name: 'Poland', timezone: 'Europe/Warsaw', flag: '🇵🇱', countryCode: 'PL', dialingCode: '+48' },
  { name: 'Belgium', timezone: 'Europe/Brussels', flag: '🇧🇪', countryCode: 'BE', dialingCode: '+32' },
  { name: 'Austria', timezone: 'Europe/Vienna', flag: '🇦🇹', countryCode: 'AT', dialingCode: '+43' },
  { name: 'Greece', timezone: 'Europe/Athens', flag: '🇬🇷', countryCode: 'GR', dialingCode: '+30' },
  { name: 'Portugal', timezone: 'Europe/Lisbon', flag: '🇵🇹', countryCode: 'PT', dialingCode: '+351' },
  { name: 'Ireland', timezone: 'Europe/Dublin', flag: '🇮🇪', countryCode: 'IE', dialingCode: '+353' },
  { name: 'Finland', timezone: 'Europe/Helsinki', flag: '🇫🇮', countryCode: 'FI', dialingCode: '+358' },
  { name: 'Czech Republic', timezone: 'Europe/Prague', flag: '🇨🇿', countryCode: 'CZ', dialingCode: '+420' },
  { name: 'Hungary', timezone: 'Europe/Budapest', flag: '🇭🇺', countryCode: 'HU', dialingCode: '+36' },
  { name: 'Romania', timezone: 'Europe/Bucharest', flag: '🇷🇴', countryCode: 'RO', dialingCode: '+40' },
  { name: 'Chile', timezone: 'America/Santiago', flag: '🇨🇱', countryCode: 'CL', dialingCode: '+56' },
  { name: 'Colombia', timezone: 'America/Bogota', flag: '🇨🇴', countryCode: 'CO', dialingCode: '+57' },
  { name: 'Peru', timezone: 'America/Lima', flag: '🇵🇪', countryCode: 'PE', dialingCode: '+51' },
  { name: 'Nigeria', timezone: 'Africa/Lagos', flag: '🇳🇬', countryCode: 'NG', dialingCode: '+234' },
  { name: 'Kenya', timezone: 'Africa/Nairobi', flag: '🇰🇪', countryCode: 'KE', dialingCode: '+254' },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', flag: '🇭🇰', countryCode: 'HK', dialingCode: '+852' },
  { name: 'Taiwan', timezone: 'Asia/Taipei', flag: '🇹🇼', countryCode: 'TW', dialingCode: '+886' },
  { name: 'Ukraine', timezone: 'Europe/Kyiv', flag: '🇺🇦', countryCode: 'UA', dialingCode: '+380' }
];

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'no-cache'
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Map countries to timezone list
  const timezoneList = countries.map(c => ({
    timezone: c.timezone,
    country: c.name,
    flag: c.flag,
    dialingCode: c.dialingCode,
    countryCode: c.countryCode
  }));

  const response = {
    status: 'success',
    total_timezones: timezoneList.length,
    timezones: timezoneList
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(response, null, 2)
  };
};
