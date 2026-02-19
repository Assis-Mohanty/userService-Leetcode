import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { UserRepository } from "../repository/user.repository";
import { InternalServerError } from "../utils/errors/app.error";

const userService = new UserService(new UserRepository())
export async function RegisterUserHandler(req:Request,res:Response){
    const user = await userService.Register(req.body)
    if(!user){
        throw new InternalServerError("Failed creating user");
    }
    res.status(200).json({
        message:"created user succesfully",
        success:true,
        data:user
    })
}

export async function GetUserHandler(req:Request,res:Response){
    const userPayloadId = req.get('x-user-id') as string;
    const user = await userService.GetUser(userPayloadId)
    if(!user){
        throw new InternalServerError("Failed fetching user");
    }
    res.status(200).json({
        message:"fetched user succesfully",
        success:true,
        data:user
    })
}


export async function UpdateUserHandler(req:Request,res:Response){
    const userPayloadId = req.get('x-user-id') as string;
    const user = await userService.UpdateUser(userPayloadId,req.body)
    if(!user){
        throw new InternalServerError("Failed updating user")
    }
    res.status(200).json({
        message:"updated user succesfully",
        success:true,
        data:user
    })
}

export async function DeleteUserHandler(req:Request,res:Response){
    const userPayloadId = req.get('x-user-id') as string;
    const user = await userService.deleteById(userPayloadId)
    if(!user){
        throw new InternalServerError("Failed deleting user");
    }
    res.status(200).json({
        message:"deleted user succesfully",
        success:true,
        data:user
    })
}
export async function LoginHandler(req:Request,res:Response){
    const {username,password} = req.body;
    const jwt = await userService.Login(username,password)
    res.cookie("refreshToken",jwt.refreshToken,{
        httpOnly:true,
        // secure:true,
        sameSite:"strict"
    })
    res.status(200).json({
        message:"logged in succesfully",
        success:true,
        data:jwt.accessToken
    })
}
export async function RefreshTokenHandler(req:Request,res:Response){
    const refreshToken = req.cookies.refreshToken 
    if(!refreshToken){
        return res.status(401).json({
            message:"Refresh token not found",
            success:false
        })   
    }

    const jwt = await userService.RefreshToken(refreshToken)
    res.cookie("refreshToken",jwt.refreshToken,{
        httpOnly:true,
        // secure:true,
        sameSite:"strict"
    })
    res.status(200).json({
        message:"refreshed token succesfully",
        success:true,
        data:jwt.accessToken
    })
}
export async function updateRatingHandler(req:Request,res:Response){
    const userPayloadId = req.get('x-user-id') as string;
    const {newRating} = req.body;
    const updatedUser = await userService.updateRating(userPayloadId,newRating);
    if(!updatedUser){
        throw new InternalServerError("Failed updating user rating");
    }
    res.status(200).json({
        message:"updated user rating succesfully",
        success:true,
        data:updatedUser
    })
}
export async function getUserByIdHandler(req: Request, res: Response) {
  const targetUserId = req.params.id;

  if (!targetUserId) {
    throw new InternalServerError("User ID param missing");
  }

  const user = await userService.GetUser(targetUserId);

  if (!user) {
    throw new InternalServerError("Failed fetching user");
  }

  res.status(200).json({
    message: "Fetched user successfully",
    success: true,
    data: user
  });
}

export async function updateUserByIdHandler(req: Request, res: Response) {
  const targetUserId = req.params.id;

  if (!targetUserId) {
    throw new InternalServerError("User ID param missing");
  }

  const updatedUser = await userService.UpdateUser(
    targetUserId,
    req.body
  );

  if (!updatedUser) {
    throw new InternalServerError("Failed updating user");
  }

  res.status(200).json({
    message: "Updated user successfully",
    success: true,
    data: updatedUser
  });
}

export async function deleteUserByIdHandler(req: Request, res: Response) {
  const targetUserId = req.params.id;

  if (!targetUserId) {
    throw new InternalServerError("User ID param missing");
  }

  const deletedUser = await userService.deleteById(targetUserId);

  if (!deletedUser) {
    throw new InternalServerError("Failed deleting user");
  }

  res.status(200).json({
    message: "Deleted user successfully",
    success: true,
    data: deletedUser
  });
}

