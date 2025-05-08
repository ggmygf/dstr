const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const accessKeyId = "YAZ8AEEOIC98YZO6VXA5";
const secretAccessKey = "fc2J7nwVwiHZPtz37r90eVeA3QCTMeP827vlYVA4";
const region = "ap-northeast-2";
const wasabiEndpoint = `https://s3.${region}.wasabisys.com`;

const s3 = new S3Client({
  region,
  endpoint: wasabiEndpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

exports.handler = async function (event) {
  const { id = "1" } = event.queryStringParameters;
  const key = `${id}.apk`; // "1.apk", "2.apk", etc.
  const bucket = "dwtweesdw";
  const expires = 600;

  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: expires });

    return {
      statusCode: 302,
      headers: {
        Location: signedUrl,
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Error: " + err.message,
    };
  }
};
