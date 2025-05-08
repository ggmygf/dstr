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
  const pathParts = event.path.split('/');
  const id = pathParts[pathParts.length - 1]; // e.g. '1' from /download/1
  const objectKey = `${id}.apk`;

  try {
    const command = new GetObjectCommand({
      Bucket: "dwtweesdw",
      Key: objectKey,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 600 });

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
