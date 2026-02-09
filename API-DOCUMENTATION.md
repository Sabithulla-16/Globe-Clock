# Global Clock API Documentation

## Netlify Functions Endpoints

All API endpoints return JSON and support CORS for cross-origin requests.

### 1. Get Full Timezone Data

**Endpoint:** `/.netlify/functions/timezone?tz=<timezone>`

**Example:** 
```
https://globeclock.netlify.app/.netlify/functions/timezone?tz=Asia/Kolkata
```

**Response:**
```json
{
  "status": "success",
  "timestamp": "2026-02-09T10:30:45.123Z",
  "timezone": "Asia/Kolkata",
  "country": {
    "name": "India",
    "flag": "🇮🇳",
    "dialingCode": "+91",
    "countryCode": "IN"
  },
  "current_time": "16:00:45",
  "current_date": "02/09/2026",
  "utc_offset": "UTC+05:30",
  "utc_offset_minutes": 330
}
```

---

### 2. Get Simple Time Only

**Endpoint:** `/.netlify/functions/time?tz=<timezone>`

**Example:** 
```
https://globeclock.netlify.app/.netlify/functions/time?tz=Europe/London
```

**Response:**
```json
{
  "status": "success",
  "timezone": "Europe/London",
  "time": "10:30:45",
  "country_name": "United Kingdom"
}
```

---

### 3. Get All Available Timezones

**Endpoint:** `/.netlify/functions/list`

**Example:** 
```
https://globeclock.netlify.app/.netlify/functions/list
```

**Response:**
```json
{
  "status": "success",
  "total_timezones": 56,
  "timezones": [
    {
      "timezone": "Asia/Kolkata",
      "country": "India",
      "flag": "🇮🇳",
      "dialingCode": "+91",
      "countryCode": "IN"
    },
    ...
  ]
}
```

---

## Usage Examples

### JavaScript/Fetch API
```javascript
fetch('https://globeclock.netlify.app/.netlify/functions/timezone?tz=Asia/Kolkata')
  .then(response => response.json())
  .then(data => console.log(data));
```

### cURL
```bash
curl https://globeclock.netlify.app/.netlify/functions/timezone?tz=Asia/Kolkata
```

### Python
```python
import requests
response = requests.get('https://globeclock.netlify.app/.netlify/functions/timezone?tz=Asia/Kolkata')
data = response.json()
print(data)
```

---

## Error Responses

### Missing Parameter
```json
{
  "status": "error",
  "message": "Missing timezone parameter",
  "usage": "Add ?tz=Asia/Kolkata to the URL"
}
```

### Invalid Timezone
```json
{
  "status": "error",
  "message": "Timezone 'Invalid/Timezone' not found",
  "hint": "Use /.netlify/functions/list to see available timezones"
}
```

---

## Features

- ✅ **Pure JSON responses** - No HTML, perfect for API consumption
- ✅ **CORS enabled** - Access from any domain
- ✅ **Serverless** - Powered by Netlify Functions
- ✅ **Real-time data** - Live timezone calculations
- ✅ **56 timezones** - Major cities worldwide
- ✅ **No authentication required** - Free and open access

---

## Available Timezones

Use `/.netlify/functions/list` to get the complete list, including:
- Asia/Kolkata (India)
- America/New_York (USA)
- Europe/London (UK)
- Asia/Tokyo (Japan)
- Australia/Sydney (Australia)
- And 51 more...
