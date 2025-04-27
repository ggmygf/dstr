import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
});

exports.handler = async (event) => {
  const noteType = event.queryStringParameters.type; // 'paid' or 'trial'

  if (!noteType || (noteType !== 'paid' && noteType !== 'trial')) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid or missing type parameter. Must be "paid" or "trial".' }),
    };
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT auth_key FROM one_time_keys WHERE note = $1 LIMIT 1',
      [noteType]
    );

    if (result.rows.length > 0) {
      const authKey = result.rows[0].auth_key;
      // Optionally, you might want to delete the key after fetching, depending on your use case
      // await client.query('DELETE FROM one_time_keys WHERE auth_key = $1', [authKey]);
      client.release();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: authKey }),
      };
    } else {
      client.release();
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `No unused "${noteType}" keys found.` }),
      };
    }
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error.' }),
    };
  }
};
