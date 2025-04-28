import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
});

exports.handler = async (event) => {
  try {
    const client = await pool.connect();

    // Fetch one "paid" key
    const paidResult = await client.query(
      'SELECT auth_key FROM one_time_keys WHERE note = $1 LIMIT 1',
      ['paid']
    );
    const paidKey = paidResult.rows.length > 0 ? paidResult.rows[0].auth_key : 'No Paid Key Found';

    // Fetch one "trial" key
    const trialResult = await client.query(
      'SELECT auth_key FROM one_time_keys WHERE note = $1 LIMIT 1',
      ['trial']
    );
    const trialKey = trialResult.rows.length > 0 ? trialResult.rows[0].auth_key : 'No Trial Key Found';

    // Optionally delete the fetched keys
    // await client.query('DELETE FROM one_time_keys WHERE note IN ($1, $2)', ['paid', 'trial']);

    client.release();

    // Return the keys in the specified plain text format
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: `Paid: ${paidKey}

Trial: ${trialKey}`,
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: 'Internal server error.',
    };
  }
};
