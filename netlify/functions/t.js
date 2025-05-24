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
- {name: "new - 美国|Netflix", server: huojian.hjjj168.com, port: 24003, type: trojan, password: 4f640fae-3cf4-46dc-a067-8f6e2852cab3, tls: true, skip-cert-verify: true}
    `
  };
};
