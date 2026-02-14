import bcrypt from "bcrypt"
import crypto from "crypto";

export async function HashPassword(plainPassword:string):Promise<string>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);
    return hash
}

export async function compareHashPassword(plainPassword:string,hashedPassword:string) {
    return await bcrypt.compare(plainPassword,hashedPassword)
}


export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}