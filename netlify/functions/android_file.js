import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
});


exports.handler = async (event, context) => {
  const code = event.queryStringParameters.code;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT note FROM one_time_keys WHERE auth_key = $1', [code]);
    const keyy;
    if(result==="paid"){keyy="de2d5353-fcd3-41c0-a909-fee6e7facc6d"} 
    if(result==="trial"){keyy="9dbeaa1a-b0da-4057-a841-b289e97d3b31"}
    else {return {statusCode: 500, body: 'fuck off.',};}
  } catch (error) {
    console.error('Database error:', error);
    return {statusCode: 500, body: 'Internal server error.',};
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
  - {name: 1-paid, server: 143.198.228.81, port: 4298, client-fingerprint: chrome, type: vless, uuid: ${keyy}, tls: true, alpn: [h3,h2,http/1.1], tfo: false, skip-cert-verify: false, network: tcp}`;


  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain', // Use text/plain
      'Content-Disposition': 'attachment; filename=config.yaml', //  ...but name it .yaml
    },
    body: configText,
  };
};
