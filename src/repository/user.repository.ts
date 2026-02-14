import { RefreshToken } from "../models/refreshTokens.model";
import { IUser, User } from "../models/user.models";

export interface IUserRepository{
    Register(data:Partial<IUser>):Promise<IUser>
    // Login(username:string , password:string):Promise<IUser>
    GetUser(userId:string):Promise<IUser| null>
    UpdateUser(userId:string,update:Partial<IUser>):Promise<IUser | null >
    deleteById(userId: string): Promise<boolean>
    findByUsername(username:string):Promise<IUser | null>
    saveRefreshToken(userId:string,tokenHash:string,expiresAt:Date):Promise<void>
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
    
    async findByUsername(username: string): Promise<IUser | null> {
        return await User.findOne({username:username});
    }
    async saveRefreshToken(userId:string,tokenHash:string,expiresAt:Date):Promise<void>{
        const refreshToken = new RefreshToken({
            userId,
            tokenHash,
            expiresAt,
            revoked:false
        })
        await refreshToken.save();
    }
}