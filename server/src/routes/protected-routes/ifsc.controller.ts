//* package imports
import { Router } from "express";

//* file imports
import { fetchIfscCodes } from "@/controllers/ifsc.controller";

//* initialise router 
const ifscRouter: Router = Router()

ifscRouter.get('/fetch-ifsc-code/:district_id', fetchIfscCodes)

export default ifscRouter
