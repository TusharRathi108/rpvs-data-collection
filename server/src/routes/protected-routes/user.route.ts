//* package imports
import { Router } from "express";

//* file imports
import { createUserController, fetchMla } from "@/controllers/user.controller";

//* initialise router
const userRouter: Router = Router()

userRouter.post('/', createUserController)
userRouter.get('/mla/fetch-mla', fetchMla)

export default userRouter
