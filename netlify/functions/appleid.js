import fetch from 'node-fetch';

export async function handler(event, context) {
  const targetUrl = 'http://13.57.39.66:3200/run';

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      // If the external API returned an error, pass that along
      // Keep error response as JSON for structured error info
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Failed to fetch from target: ${response.statusText}` }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    const data = await response.json();

    // Check if data.data is an array before processing
    if (!Array.isArray(data.data)) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error: Unexpected data format from target API' }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }

    const formattedData = data.data.reduce((acc, curr, index) => {
      if (index % 2 === 0) {
        // If the index is even (0, 2, 4, ...), it's an email.
        // Push the email as a new element into the accumulator array.
        acc.push(curr);
      } else {
        // If the index is odd (1, 3, 5, ...), it's a password.
        // Append a newline, the password, and two newlines to the *last* element
        // that was added to the accumulator (which was the corresponding email).
        // Use two newlines (\n\n) to create the blank line between pairs.
        acc[acc.length - 1] += `\n${curr}\n\n`;
      }
      return acc;
    }, []) // Start with an empty array as the accumulator
    // Join the elements of the final accumulator array.
    // The extra newline at the end of each pair means we don't need join('\n')
    // but we will remove the final two newlines if they exist
    .join('')
    .trimEnd(); // Remove trailing whitespace (including the last \n\n)


    return {
      statusCode: 200,
      body: formattedData, // Return the plain text directly
      headers: {
        'Content-Type': 'text/plain', // Set Content-Type to plain text
        'Access-Control-Allow-Origin': '*', // Add CORS header if needed for browser access
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    // Keep error response as JSON for structured error info
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error: Could not fetch data', details: error.message }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}
