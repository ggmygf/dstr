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

    // Format the data as "element1\nelement2\n\nelement3\nelement4\n\n..."
    let formattedResult = '';
    if (data && Array.isArray(data.data)) {
      for (let i = 0; i < data.data.length; i++) {
        formattedResult += `${data.data[i]}\n`;
        if ((i + 1) % 2 === 0) { // Add an extra newline after every two elements
          formattedResult += '\n';
        }
      }
    }
    else{
        formattedResult = "Error: Data format incorrect.  Expected {data: [\"abc\",\"def\",...]}";
    }

    return {
      statusCode: 200,
      body: formattedResult, // Return the formatted string
      headers: {
        'Content-Type': 'text/plain', // Important: Set content type to text/plain
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
