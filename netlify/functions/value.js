import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
});

exports.handler = async (event) => {
  const code = event.queryStringParameters.code; // Get the last part of the pa
  const value = event.queryStringParameters.value; 
  
  try {
    const client = await pool.connect();
    if (value) {const result_set = await client.query('UPDATE one_time_keys SET secret_value = $1 WHERE auth_key = $2', [value, code]);
       if (result_set) {console.log(result_set);}           
    }
    
    const result = await client.query('SELECT secret_value FROM one_time_keys WHERE auth_key = $1', [code]);

    if (result.rows.length > 0) {
      const secretValue = result.rows[0].secret_value;
      await client.query('DELETE FROM one_time_keys WHERE auth_key = $1', [code]);
      client.release();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
        body: secretValue,
      };
    } else {
      client.release();
      return {
        statusCode: 404,
        body: 'Code not found or already used.',
      };
    }
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: 'Internal server error.',
    };
  }
};
