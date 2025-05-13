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
    
    const result = await client.query('SELECT note FROM one_time_keys WHERE auth_key = $1', [code]);

    if (result.rows.length > 0) {
      const secretValue = result.rows[0].secret_value;
      if(code!==="gg"){await client.query('DELETE FROM one_time_keys WHERE auth_key = $1', [code]);}
      client.release();
      
      const trial = "vless://9dbeaa1a-b0da-4057-a841-b289e97d3b31@143.198.228.81:4298/?type=tcp&security=tls&fp=chrome&alpn=h3%2Ch2%2Chttp%2F1.1#1-trial";
      const paid = "vless://de2d5353-fcd3-41c0-a909-fee6e7facc6d@143.198.228.81:4298/?type=tcp&security=tls&fp=chrome&alpn=h3%2Ch2%2Chttp%2F1.1#1-paid";
      const final;
      if (secretValue==="paid"){final = paid;}
      if (secretValue==="trial"){final = trial;} 
      else {final="get lost";}
        
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
        body: final,
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
