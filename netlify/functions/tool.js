const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// --- Configuration ---
const accessKeyId = "YAZ8AEEOIC98YZO6VXA5"; // **WARNING: Hardcoding credentials is not recommended for production.**
const secretAccessKey = "fc2J7nwVwiHZPtz37r90eVeA3QCTMeP827vlYVA4"; // Consider using IAM roles or Secrets Manager
const region = "ap-northeast-2";
const wasabiEndpoint = `https://s3.${region}.wasabisys.com`;
const bucket = "dwtweesdw"; // Your S3 bucket name
const expires = 600; // URL expiration time in seconds (10 minutes)

// --- ID to S3 Key Mapping ---
// This object represents your desired JSON mapping.
const idToKeyMapping = {
  "m": "m.dmg",
  "c": "chrome.zip",
  "w": "w.zip",
  "1": "n.apk",
  "2": "ins.apk",
  "3": "ut.apk",

};
// Example: if event.queryStringParameters.id is "w", the key will be "cc.dmg"

// --- S3 Client Initialization ---
// Initialize outside the handler to reuse the connection across invocations
const s3 = new S3Client({
  region,
  endpoint: wasabiEndpoint,
  credentials: {
    accessKeyId, // **WARNING: Hardcoding credentials is not recommended for production.**
    secretAccessKey, // Consider using IAM roles or Secrets Manager
  },
});

// --- Lambda Handler ---
exports.handler = async function (event) {
  const id = event.queryStringParameters ? event.queryStringParameters.id : undefined;

  // 1. Check if ID is provided
  if (!id) {
    return {
      statusCode: 400,
      body: "Error: Missing 'id' query string parameter.",
    };
  }

  // 2. Look up the S3 key using the provided ID in the mapping
  const key = idToKeyMapping[id];

  // 3. Check if a key was found for the given ID
  if (!key) {
    return {
      statusCode: 404,
      body: `Error: No mapping found for ID: ${id}`,
    };
  }

  // 4. Generate the pre-signed URL using the mapped key
  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: expires });

    // 5. Return a 302 redirect to the pre-signed URL
    return {
      statusCode: 302,
      headers: {
        Location: signedUrl,
      },
      // body is optional for 302 redirects but good practice to omit or keep minimal
    };
  } catch (err) {
    // 6. Handle errors during S3 operation (e.g., file not found, permissions)
    console.error("S3 Error:", err); // Log the error for debugging
    let statusCode = 500;
    let errorMessage = "An unexpected error occurred.";

    // You might want to check the error type for more specific messages
    if (err.name === 'NoSuchKey') {
        statusCode = 404;
        errorMessage = `Error: The specified key "${key}" does not exist in the bucket.`;
    } else if (err.name === 'AccessDenied') {
         statusCode = 403;
         errorMessage = `Error: Access denied to the specified key "${key}".`;
    } else {
        errorMessage = "Error generating signed URL: " + err.message;
    }


    return {
      statusCode: statusCode,
      body: JSON.stringify({ message: errorMessage }),
    };
  }
};
