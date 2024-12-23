import admin, { ServiceAccount } from "firebase-admin";
import crypto from "crypto";

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (!serviceAccountBase64) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 is not set");
}

const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
);

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
if (!bucket) {
  throw new Error("Failed to initialize storage bucket");
}

async function getFileHash(buffer: Buffer): Promise<string> {
  const hash = crypto.createHash("md5");
  hash.update(buffer);
  return hash.digest("hex");
}

export async function uploadZipToFirebase(file: File) {
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

          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;

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

export async function uploadImageToFirebase(file: File) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type;

    // Check if the file is an image
    if (!contentType?.startsWith('image/')) {
      throw new Error("Only image files are allowed");
    }

    // Generate hash for the file
    const hash = await getFileHash(buffer);
    const folderName = 'THEMESMEDIA'; // Change folder name as needed
    const uniqueFilename = `${folderName}/${hash}.${contentType.split('/')[1]}`; // Use the correct file extension

    // Check if file already exists
    const [exists] = await bucket.file(uniqueFilename).exists();
    if (exists) {
      console.log(`File ${uniqueFilename} already exists in Firebase Storage`);
      return `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;
    }

    // Upload new file
    const blob = bucket.file(uniqueFilename);
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

          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;

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

export async function deleteImageFromFirebase(imageUrl: string) {
  try {
    if (!imageUrl) {
      throw new Error("Image URL is required");
    }
    const filePath = imageUrl.split('/').pop(); // Extract the file name from the URL
    if (!filePath) {
      throw new Error("File path is required");
    }
    const file = bucket.file(filePath);

    await file.delete(); // Delete the file from Firebase Storage
    console.log(`Successfully deleted ${imageUrl}`);
  } catch (error) {
    console.error("Error deleting image from Firebase:", error);
    throw new Error("Failed to delete image from storage");
  }
}