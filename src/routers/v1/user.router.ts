import express from "express"
import {getUserByIdHandler, GetUserHandler, deleteUserByIdHandler, DeleteUserHandler,  LoginHandler, RegisterUserHandler, updateRatingHandler, updateUserByIdHandler, UpdateUserHandler } from "../../controllers/user.controller"
import { validateRequestBody } from './../../validators/index';
import { createUserSchema, updateUserSchema } from "../../validators/user.validator";
const userRouter = express.Router()

userRouter.post('/auth/register',validateRequestBody(createUserSchema),RegisterUserHandler)
userRouter.get('/me',GetUserHandler)
userRouter.patch('/me',validateRequestBody(updateUserSchema),UpdateUserHandler)
userRouter.delete('/me',DeleteUserHandler)
userRouter.post('/auth/login',LoginHandler)
userRouter.patch('/rating/:id',updateRatingHandler)
userRouter.get('/:id', getUserByIdHandler);
userRouter.patch('/:id', updateUserByIdHandler);
userRouter.delete('/:id', deleteUserByIdHandler);


export default userRouter;