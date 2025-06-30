import * as argon2 from "argon2";

export async function HashPassword(password: string) {
  const pass = password.trim();
  try {
    return await argon2.hash(pass, {
      type: argon2.argon2id,
      memoryCost: 4096,
      timeCost: 3,
      parallelism: 1,
    });
  } catch {
    throw new Error("error hashing password");
  }
}
export async function VerifyPassword(hashpassword: string, password: string) {
  const pass = password.trim();
  try {
    return await argon2.verify(hashpassword, pass);
  } catch (error) {
    console.error("Password verification failed:", error);
    return false;
  }
}
