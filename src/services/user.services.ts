import { serverConfig } from "../config"
import { RegisterUserDto } from "../dto/user.dto"
import { IUser } from "../models/user.models"
import { IUserRepository } from "../repository/user.repository"
import { compareHashPassword, HashPassword, hashToken } from "../utils/hash/generateHashPassword"
import { generateJWT, verifyJWT } from "../utils/jwt"

export interface IUserService{
    Register(data:RegisterUserDto):Promise<IUser>
    // Login(username:string , password:string):Promise<IUser>
    GetUser(userId:string):Promise<IUser| null>
    UpdateUser(userId:string,update:Partial<IUser>):Promise<IUser | null >
    deleteById(userId: string): Promise<boolean>
    GetMe(userId:string):Promise<IUser | null>
    Login(username:string,password:string):Promise<{accessToken:string, refreshToken:string}>
    RefreshToken(oldRefreshToken:string):Promise<{accessToken:string, refreshToken:string}>
    updateRating(userId:string,newRating:number):Promise<IUser | null>
}

export class  UserService implements IUserService{
    private userRepository:IUserRepository
    constructor(userRepository:IUserRepository){
        this.userRepository=userRepository
    }
    async Register(data: RegisterUserDto): Promise<IUser> {
        const {username,email,password} = data;
        const hashedPassword= await HashPassword(password);
        
        return await this.userRepository.Register({
            username,
            email,
            passwordHash: hashedPassword
        });
    }
    async GetUser(userId: string): Promise<IUser | null> {
        return await this.userRepository.GetUser(userId)
    }
    async UpdateUser(userId: string, update: Partial<IUser>): Promise<IUser | null> {
        return await this.userRepository.UpdateUser(userId,update)
    }
    async deleteById(userId: string): Promise<boolean> {
        return await this.userRepository.deleteById(userId)
    }
    async Login(username:string,password:string):Promise<{accessToken:string, refreshToken:string}>{
        const user = await this.userRepository.findByUsername(username);
        if(!user){
            throw new Error("User not found");
        }
        const isValid = await compareHashPassword(password,user.passwordHash);
        if(!isValid){
            throw new Error("Invalid password");
        }
        const jwtAccess = await generateJWT({
            userId:user._id.toString(),
            username:user.username,
            role:user.role
        },serverConfig.JWT_ACCESS_SECRET,
        "1h"
        );
        const jwtRefresh = await generateJWT({
            userId:user._id.toString(),
            username:user.username,
            role:user.role
        },serverConfig.JWT_REFRESH_SECRET,
        "7d"
        );
        const tokenhash = hashToken(jwtRefresh);
        await this.userRepository.saveRefreshToken(user._id.toString(),tokenhash,new Date(Date.now() + 7*24*60*60*1000),false);
        
        console.log("Generated JWT:", jwtAccess);
        console.log("Generated Refresh Token:", jwtRefresh);
        return {
            accessToken:jwtAccess,
            refreshToken:jwtRefresh
        }
    }
    async GetMe(userId: string):Promise<IUser | null>{
        return await this.userRepository.GetUser(userId)
    }
    async RefreshToken(oldRefreshToken:string):Promise<{accessToken:string, refreshToken:string}>{
        const tokenHash = hashToken(oldRefreshToken);
        const decoded = await verifyJWT(oldRefreshToken,serverConfig.JWT_REFRESH_SECRET);
        const storedToken = await this.userRepository.findRefreshTokenByHash(tokenHash);
        if(!storedToken){
            throw new Error("Invalid refresh token");
        }
        await this.userRepository.revokeRefreshToken(tokenHash);
        const user = await this.userRepository.GetUser(decoded.userId);
        if(!user){
            throw new Error("User not found");
        }
        const jwtAccess = await generateJWT({
            userId:user._id.toString(),
            username:user.username,
            role:user.role
        },serverConfig.JWT_ACCESS_SECRET,
        "15m"
        );
        const jwtRefresh = await generateJWT({
            userId:user._id.toString(),
            username:user.username,
            role:user.role
        },serverConfig.JWT_REFRESH_SECRET,
        "7d"
        );
        const newTokenHash = hashToken(jwtRefresh);
        await this.userRepository.saveRefreshToken(user._id.toString(),newTokenHash,new Date(Date.now() + 7*24*60*60*1000),false);
        
        console.log("Generated JWT:", jwtAccess);
        console.log("Generated Refresh Token:", jwtRefresh);
        return {
            accessToken:jwtAccess,
            refreshToken:jwtRefresh
        }
    }
    updateRating(userId: string, newRating: number): Promise<IUser | null> {
        return this.userRepository.updateRating(userId, newRating);
    }
}