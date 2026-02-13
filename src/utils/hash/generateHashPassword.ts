import bcrypt from "bcrypt"

export async function HashPassword(plainPassword:string):Promise<string>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);
    return hash
}

export async function compareHashPassword(plainPassword:string,hashedPassword:string) {
    return await bcrypt.compare(plainPassword,hashedPassword)
}