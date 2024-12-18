import admin, { ServiceAccount } from "firebase-admin";
import crypto from "crypto";

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (!serviceAccountBase64) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 is not set");
}

const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
);
console.log("FIREBASE_STORAGE_BUCKET", process.env.FIREBASE_STORAGE_BUCKET);

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      storageBucket: "autopostthat-bbfad.appspot.com/",
    });

    // Verify bucket exists immediately after initialization
    const bucket = admin.storage().bucket();
    await bucket.exists(); // This will throw if bucket doesn't exist

    console.log("Successfully connected to bucket:", bucket.name);
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // throw new Error(`Failed to initialize Firebase: ${error.message}`);
  }
}

// Get bucket reference after successful initialization
const bucket = admin.storage().bucket();
console.log("bucket", bucket, "bucket");
if (!bucket) {
  throw new Error("Failed to initialize storage bucket");
}

async function getFileHash(buffer: Buffer): Promise<string> {
  const hash = crypto.createHash("md5");
  hash.update(buffer);
  return hash.digest("hex");
}

export async function uploadToFirebase(file: File) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type;

    if (!contentType?.includes('zip')) {
      throw new Error("Only ZIP files are allowed");
    }

    // Generate hash for the file
    const hash = await getFileHash(buffer);
    const folderName = 'SHOPIFYTHEMES';
    const uniqueFilename = `${folderName}/${hash}.zip`;

    // Create folder if it doesn't exist
    // try {
    //   const folder = bucket.file(`${folderName}`);
    //   console.log("folder", folder);
    //   const [folderExists] = await folder.exists();
    //   if (!folderExists) {
    //     console.log("folder not exists");
    //     await bucket.file(`${folderName}/.keep`).save('');
    //   }
    // } catch (error) {
    //   console.error("Error creating folder:", (error as any).message);
    // }

    // Check if file already exists
    const [exists] = await bucket.file(uniqueFilename).exists();
    if (exists) {
      console.log(`File ${uniqueFilename} already exists in Firebase Storage`);
      return `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;
    }

    // Upload new file
    const blob = bucket.file(uniqueFilename);
    // console.log("blob", blob);
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
      public: true,
      metadata: {
        contentType: contentType,
      },
    });

    return new Promise<string>((resolve, reject) => {
      blobStream.on("error", (err) => {
        console.error("Upload error:", err);
        reject(err); // Pass through the actual error
      });

      blobStream.on("finish", async () => {
        try {
          await blob.makePublic();
          console.log("bucket.name", bucket.name);
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;
          console.log("publicUrl", publicUrl);
          console.log(`File uploaded: ${uniqueFilename}`);
          resolve(publicUrl);
        } catch (error) {
          console.error("Error making file public:", error);
          reject(error);
        }
      });

      blobStream.end(buffer);
    });
  } catch (error) {
    console.error("Firebase upload error:", error);
    throw error;
  }
}