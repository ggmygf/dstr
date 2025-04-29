import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
});

exports.handler = async (event) => {
  try {
    const client = await pool.connect();

    // Fetch one "paid" key
    const paidResult = await client.query('SELECT auth_key FROM one_time_keys WHERE note = $1 ORDER BY RANDOM() LIMIT 1', ['paid']);
    const paidKey = paidResult.rows.length > 0 ? paidResult.rows[0].auth_key : 'No Paid Key Found';
    const paidCount = await client.query('SELECT COUNT(*) FROM one_time_keys WHERE note = $1', ['paid']);




    // Fetch one "trial" key
    const trialResult = await client.query('SELECT auth_key FROM one_time_keys WHERE note = $1 ORDER BY RANDOM() LIMIT 1',['trial']);
    const trialKey = trialResult.rows.length > 0 ? trialResult.rows[0].auth_key : 'No Trial Key Found';
    const trialCount = await client.query('SELECT COUNT(*) FROM one_time_keys WHERE note = $1', ['trial']);
    // Optionally delete the fetched keys
    // await client.query('DELETE FROM one_time_keys WHERE note IN ($1, $2)', ['paid', 'trial']);

    client.release();

    // Return the keys in HTML format
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fetched Keys</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #000;
              color: #fff;
              font-size: 3rem;
              font-family: sans-serif;
              text-align: center;
            }
            .container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div>Paid: ${paidKey}   ${paidCount} left</div>
            <div>Trial: ${trialKey}   ${trialCount} left</div>
          </div>
        </body>
        </html>
      `,
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: 'Internal server error.',
    };
  }
};
