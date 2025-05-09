import fetch from 'node-fetch';

export async function handler(event, context) {
  const targetUrl = 'http://137.184.36.21:3100/run';

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      // If the external API returned an error, pass that along
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Failed to fetch from target: ${response.statusText}` }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Add CORS header if needed for browser access
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error: Could not fetch data', details: error.message }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}
