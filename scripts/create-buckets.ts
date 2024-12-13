import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, "../.env") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("URL:", SUPABASE_URL);
console.log("Service Role Key exists:", !!SUPABASE_SERVICE_ROLE_KEY);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const buckets = [
  { name: "product-images", public: true },
  { name: "store-assets", public: true },
  { name: "category-images", public: true },
  { name: "user-uploads", public: false },
];

async function createBuckets() {
  for (const bucket of buckets) {
    try {
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: 5242880, // 5MB in bytes
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      });

      if (error) {
        console.error(`Error creating bucket ${bucket.name}:`, error.message);
      } else {
        console.log(`Successfully created bucket: ${bucket.name}`);
      }
    } catch (err) {
      console.error(`Failed to create bucket ${bucket.name}:`, err);
    }
  }
}

createBuckets();
