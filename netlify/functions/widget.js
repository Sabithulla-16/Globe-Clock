// Netlify Function: Widget endpoint helper
// Endpoint: /.netlify/functions/widget?tz=America/New_York&clock=digital&theme=auto

const CLOCK_TYPES = new Set(['digital', 'analog']);
const THEMES = new Set(['auto', 'light', 'dark']);

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'no-cache'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const params = event.queryStringParameters || {};
  const tz = params.tz || 'UTC';
  const clock = (params.clock || 'digital').toLowerCase();
  const theme = (params.theme || 'auto').toLowerCase();

  if (!CLOCK_TYPES.has(clock)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Invalid clock type',
        allowed: ['digital', 'analog'],
        example: '/.netlify/functions/widget?tz=America/New_York&clock=digital&theme=auto'
      }, null, 2)
    };
  }

  if (!THEMES.has(theme)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Invalid theme',
        allowed: ['auto', 'light', 'dark'],
        example: '/.netlify/functions/widget?tz=America/New_York&clock=digital&theme=auto'
      }, null, 2)
    };
  }

  const host = event.headers?.host || 'globeclock.netlify.app';
  const proto = event.headers?.['x-forwarded-proto'] || 'https';
  const widgetPath = `/?widget=1&tz=${encodeURIComponent(tz)}&clock=${encodeURIComponent(clock)}&theme=${encodeURIComponent(theme)}`;

  const response = {
    status: 'success',
    widget_path: widgetPath,
    widget_url: `${proto}://${host}${widgetPath}`,
    params: {
      tz,
      clock,
      theme
    },
    note: 'Change tz, clock, or theme to customize the widget.'
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(response, null, 2)
  };
};
