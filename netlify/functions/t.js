exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain"
    },
    //body: "vless://de2d5353-fcd3-41c0-a909-fee6e7facc6d@143.198.228.81:4298/?type=tcp&security=tls&fp=chrome&alpn=h3%2Ch2%2Chttp%2F1.1#1-paid"
    //body: "vless://9dbeaa1a-b0da-4057-a841-b289e97d3b31@143.198.228.81:4298/?type=tcp&security=tls&fp=chrome&alpn=h3%2Ch2%2Chttp%2F1.1#1-trial"
    body:`
port: 7890
socks-port: 7891
allow-lan: true
mode: Rule
log-level: info
external-controller: 127.0.0.1:9090
proxies:
- {name: "sorry-aulix", server: 103.21.244.11, port: 443, type: vless, uuid: 6af3b37a-91a9-4773-8d76-1e81918448c3, tls: true, skip-cert-verify: true, ws-opts: {path: "/?ed=2048", headers: {Host: love.gracemygf.pics}}, alpn: [h2, http/1.1], sni: love.gracemygf.pics}
    `
  };
};
