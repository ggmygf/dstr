// filename: netlify/functions/haha.js

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain"
    },
    body: "vless://9dbeaa1a-b0da-4057-a841-b289e97d3b31@143.198.228.81:4298/?type=tcp&security=tls&fp=chrome&alpn=h3%2Ch2%2Chttp%2F1.1#1-trial"
  };
};
