import express from "express"
import { deleteByIdHandler, GetUserByIdHandler, RegisterUserHandler, UpdateUserHandler } from "../../controllers/user.controller"
const userRouter = express.Router()

userRouter.post('/',RegisterUserHandler)
userRouter.get('/:id',GetUserByIdHandler)
userRouter.patch('/:id',UpdateUserHandler)
userRouter.delete('/:id',deleteByIdHandler)

export default userRouter;