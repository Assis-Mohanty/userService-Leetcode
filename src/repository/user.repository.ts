import { serverConfig } from "../config";
import { IUser, User } from "../models/user.models";
import { compareHashPassword } from "../utils/hash/generateHashPassword";
import { generateJWT } from "../utils/jwt";



export interface IUserRepository{
    Register(data:Partial<IUser>):Promise<IUser>
    // Login(username:string , password:string):Promise<IUser>
    GetUser(userId:string):Promise<IUser| null>
    UpdateUser(userId:string,update:Partial<IUser>):Promise<IUser | null >
    deleteById(userId: string): Promise<boolean>
    Login(username:string,password:string):Promise<string>
}

export class UserRepository implements IUserRepository{
    constructor(){
        console.log("IUserRepository constructor created");
    }
    async Register(data:Partial<IUser>): Promise<IUser> {
        const user = new User(data);
        return await user.save();
    }
    async GetUser(userId:string):Promise<IUser| null>{
        return await User.findById(userId);
    }
    async UpdateUser(userId:string,update:Partial<IUser>):Promise<IUser | null>{
        const result = await User.findByIdAndUpdate(
            userId,
            update,
            {new:true}
        )
        return result
    }
    async deleteById(userId: string): Promise<boolean> {
        const result = await User.findByIdAndDelete(userId);
        return result !== null;
    }
    async Login(username:string,password:string):Promise<string>{
        const user = await User.findOne({username:username});
        if(!user){
            throw new Error("User not found");
        }
        const isValid = await compareHashPassword(password,user.passwordHash);
        if(!isValid){
            throw new Error("Invalid password");
        }
        const jwt = await generateJWT({
            userId:user._id.toString(),
            username:user.username,
            role:user.role
        },serverConfig.JWT_SECRET,
        "1h"
        );
        console.log("Generated JWT:", jwt);
        return jwt;
    }
}