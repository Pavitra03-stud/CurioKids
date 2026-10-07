import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(
  __dirname,
  "curiokids-f13b7-firebase-adminsdk-fbsvc-14a61f3770.json"
);

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ Firebase service account JSON not found");
  process.exit(1);
}

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

initializeApp({
  credential: cert(serviceAccount),
});

const firebaseAuth = getAuth();

const adminEmail = process.argv[2];

if (!adminEmail) {
  console.error("❌ Please provide admin email");
  console.log("Example: node setAdmin.js your@email.com");
  process.exit(1);
}

try {
  const user = await firebaseAuth.getUserByEmail(adminEmail);

  await firebaseAuth.setCustomUserClaims(user.uid, {
    admin: true,
  });

  console.log("");
  console.log("=================================");
  console.log("✅ ADMIN ACCESS GRANTED");
  console.log("=================================");
  console.log("Email:", user.email);
  console.log("UID:", user.uid);
  console.log("Admin:", true);
  console.log("=================================");
  console.log("");
} catch (error) {
  console.error("❌ Failed to make user admin");
  console.error(error);
}