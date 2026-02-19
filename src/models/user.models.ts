import mongoose, { Types } from "mongoose";

export interface Profile{
    name:string;
    bio?:string;
}


export enum RoleEnum{
    USER = "user",
    ADMIN = "admin"
}

export interface IUser{
    _id:Types.ObjectId;
    username:string;
    email:string;
    passwordHash:string;
    profile?:Profile;
    rating:number;
    role:RoleEnum;
    createdAt:Date;
    updatedAt:Date;
}
export const userSchema = new mongoose.Schema<IUser>({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        index:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        index:true
    },
    passwordHash:{
        type:String,
        required:[true,"passwordHash is required"]
    },
    profile:{
        name:{
            type:String,
            required:false
        },
        bio:{
            type:String,
            required:false
        }
    },
    rating:{
        type:Number,
        required:false,
        default:0
    },
    role:{
        type:String,
        enum:Object.values(RoleEnum),
        default:RoleEnum.USER,
        required:true
    }
},{
    timestamps:true
})

userSchema.set("toJSON", {
    transform: (_doc, ret: any) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
    }
});



export const User= mongoose.model<IUser>('User',userSchema)