import { RegisterUserDto } from "../dto/user.dto"
import { IUser } from "../models/user.models"
import { IUserRepository } from "../repository/user.repository"
import { HashPassword } from "../utils/hash/generateHashPassword"

export interface IUserService{
    Register(data:RegisterUserDto):Promise<IUser>
    // Login(username:string , password:string):Promise<IUser>
    GetUser(userId:string):Promise<IUser| null>
    UpdateUser(userId:string,update:Partial<IUser>):Promise<IUser | null >
    deleteById(userId: string): Promise<boolean>
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
}
