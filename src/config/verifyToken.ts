import { adminAuth } from "@/config/firebase-admin.config";

export async function verifyToken(token: string) {
  try {
    // Firebase Admin by default verifies the token's signature and checks its expiration time.
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { isValid: true, user: decodedToken };
  } catch (error) {
    console.error("Token Verification Error:", error);
    return { isValid: false, error: "Invalid or expired token" };
  }
}
