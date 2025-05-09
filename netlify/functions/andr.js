import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
});

exports.handler = async (event, context) => {
  const code = event.queryStringParameters.code;
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
  - {"name": "1-paid", "server": "143.198.228.81", "port": 3655, "client-fingerprint": "chrome", "type": "vless", "uuid": "139d5d44-472c-4141-88d0-57cbb82393c8", "tls": true, "alpn": ["h3", "h2", "http/1.1"], "tfo": false, "skip-cert-verify": false, "network": "tcp"}`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename=config.yaml',
    },
    body: configText,
  };
};
