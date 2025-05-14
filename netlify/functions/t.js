// filename: netlify/functions/haha.js

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain"
    },
    body: "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTp0MHNybWR4cm0zeHlqbnZxejlld2x4YjJteXE3cmp1dg@1a4057b.d4.gladns.com:2377?plugin=obfs-local;obfs=tls;obfs-host=1a4057b.dl.nintendo.jp:123932;obfs-uri=/&uot=1#GLaDOS-US-Netflix"
  };
};
