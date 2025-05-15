// filename: netlify/functions/haha.js

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain"
    },
    body: "vless://YXV0bzpkZTJkNTM1My1mY2QzLTQxYzAtYTkwOS1mZWU2ZTdmYWNjNmRAMTQzLjE5OC4yMjguODE6NDI5OA?remarks=1-paid&obfs=none&tls=1&alpn=h3,h2,http/1.1"
    // body: "vless://9dbeaa1a-b0da-4057-a841-b289e97d3b31@143.198.228.81:4298/?type=tcp&security=tls&fp=chrome&alpn=h3%2Ch2%2Chttp%2F1.1#1-trial"
  };
};
