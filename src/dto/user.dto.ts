import { Profile } from "../models/user.models";

export type RegisterUserDto={
    username:string,
    email:string,
    password:string,
}

export type UpdateUserDto = {
    username:string;
    email:string;
    passwordHash:string;
    profile?:Profile;
    rating:number;
}