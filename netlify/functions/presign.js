const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const accessKeyId = "YAZ8AEEOIC98YZO6VXA5";
const secretAccessKey = "fc2J7nwVwiHZPtz37r90eVeA3QCTMeP827vlYVA4";
const region = "ap-northeast-2";
const endpoint = `https://s3.${region}.wasabisys.com`;

const s3 = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

exports.handler = async function (event, context) {
  const { key, bucket } = event.queryStringParameters;

  if (!key || !bucket) {
    return {
      statusCode: 400,
      body: "Missing 'key' or 'bucket' query parameters.",
    };
  }

  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour

    return {
      statusCode: 200,
      body: JSON.stringify({ url: signedUrl }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Error: " + err.message,
    };
  }
};
