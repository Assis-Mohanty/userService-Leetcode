import express from "express"
import { deleteByIdHandler, GetUserByIdHandler, LoginHandler, RegisterUserHandler, UpdateUserHandler } from "../../controllers/user.controller"
import { validateRequestBody } from './../../validators/index';
import { createUserSchema, updateUserSchema } from "../../validators/user.validator";
const userRouter = express.Router()

userRouter.post('/',validateRequestBody(createUserSchema),RegisterUserHandler)
userRouter.get('/:id',GetUserByIdHandler)
userRouter.patch('/:id',validateRequestBody(updateUserSchema),UpdateUserHandler)
userRouter.delete('/:id',deleteByIdHandler)
userRouter.post('/login',LoginHandler)
export default userRouter;