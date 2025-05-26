const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
});

exports.handler = async (event) => {
  const code = event.queryStringParameters.code;
  const a1 = event.queryStringParameters.a;
  const b1 = event.queryStringParameters.b; 
  let uuid = "5";
  const test = "vmess://ewogICJ2IjogIjIiLAogICJwcyI6ICJtbmVlOWJ0eCIsCiAgImFkZCI6ICIxNDMuMTk4LjIyOC44MSIsCiAgInBvcnQiOiAzNjU1LAogICJpZCI6ICIxMzlkNWQ0NC00NzJjLTQxNDEtODhkMC01N2NiYjgyMzkzYzgiLAogICJzY3kiOiAiYXV0byIsCiAgIm5ldCI6ICJ0Y3AiLAogICJ0eXBlIjogIm5vbmUiLAogICJ0bHMiOiAidGxzIiwKICAiZnAiOiAiY2hyb21lIiwKICAiYWxwbiI6ICJoMyxoMixodHRwLzEuMSIKfQ=="
  
  if(code==="gg") {return {statusCode: 200, headers: {'Content-Type': 'text/plain',}, body: test,};}
  
  try {
    const client = await pool.connect();
    
    if (a1 && b1) {const result_set = await client.query('UPDATE one_time_keys SET auth_key = $1, note = $2 WHERE secret_value = $3', [a1, b1, "o3dp55vks9gXcy1d"]);
       if (result_set) {console.log(result_set); 
       const targetUrl = `https://uuid3update.jinghunnai.workers.dev/?uuid=${b1}`;
       try {const response = await fetch(targetUrl);} catch(error){ }
       return;
    }}

    const direct = await client.query('SELECT note FROM one_time_keys WHERE secret_value = $1', ["o3dp55vks9gXcy1d"]);
    if (direct.rows.length > 0) { uuid = direct.rows[0].note;};

    
    const result = await client.query('SELECT note FROM one_time_keys WHERE auth_key = $1', [code]);
    if (result.rows.length > 0) {
      const secretValue = result.rows[0].note;
      await client.query('DELETE FROM one_time_keys WHERE auth_key = $1', [code]);
      client.release();
      
      const trial = `vless://${uuid}@103.21.244.11:443?remarks=sorry-auth&obfsParam=love.gracemygf.pics&path=/?ed=2048&obfs=websocket&tls=1&peer=love.gracemygf.pics&alpn=h2,http/1.1`;
      const paid = "vless://6af3b37a-91a9-4773-8d76-1e81918448c3@103.21.244.11:443?remarks=sorry-auth&obfsParam=love.gracemygf.pics&path=/?ed=2048&obfs=websocket&tls=1&peer=love.gracemygf.pics&alpn=h2,http/1.1";
      let final = "get lost";
      if (secretValue==="paid"){final = paid;}
      if (secretValue==="trial"){final = trial;} 
        
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








                     // android   
/*
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
});

exports.handler = async (event, context) => {
//  const code = event.queryStringParameters.code;
  let keyy; // Declare keyy outside the try block
  let client; // Declare client outside the try block
  

  try {
    client = await pool.connect();
    const result = await client.query('SELECT note FROM one_time_keys WHERE auth_key = $1', [code]);

    if (result.rows.length > 0) {
      const note = result.rows[0].note;
      if (note === 'paid') {
        keyy = 'de2d5353-fcd3-41c0-a909-fee6e7facc6d';
        await client.query('DELETE FROM one_time_keys WHERE auth_key = $1', [code]);
      } else if (note === 'trial') {
        keyy = '9dbeaa1a-b0da-4057-a841-b289e97d3b31';
        await client.query('DELETE FROM one_time_keys WHERE auth_key = $1', [code]);
      } else {
        return { statusCode: 400, body: 'Invalid.' }; // Changed to 400 for bad request
      }
    } else {
      return { statusCode: 404, body: 'Code not found.' }; // Changed to 404 for not found
    }
  } catch (error) {
    console.error('Database error:', error);
    return { statusCode: 500, body: 'Internal server error.', };
  } finally {
    if (client) {
      client.release(); // Release the client in the finally block
    }
  }

  const configText = `port: 7890
socks-port: 7891
allow-lan: true
mode: Rule
log-level: info
external-controller: :9090
dns:
  enable: true
  nameserver:
    - 119.29.29.29
    - 223.5.5.5
  fallback:
    - 8.8.8.8
    - 8.8.4.4
    - tls://1.0.0.1:853
    - tls://dns.google:853
proxies:
  - {"name": "1-paid", "server": "143.198.228.81", "port": 3655, "client-fingerprint": "chrome", "type": "vmess", "uuid": "139d5d44-472c-4141-88d0-57cbb82393c8", "tls": true, "alpn": ["h3", "h2", "http/1.1"], "tfo": false, "skip-cert-verify": false, "network": "tcp"}`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename=config.yaml',
    },
    body: configText,
  };
};

*/
