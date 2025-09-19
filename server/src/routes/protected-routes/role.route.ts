//* package imports
import { Router } from "express";

//* file imports
import { createRoleController } from "@/controllers/role.controller";

//* initialise router
const roleRouter: Router = Router()

roleRouter.post('/', createRoleController)

export default roleRouter
