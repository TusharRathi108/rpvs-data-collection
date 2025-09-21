//* package imports
import { Router } from "express";

//* file imports
import { createImplementationAgency, fetchImplemenationAgencyDistrictWise, fetchImplementationAgencies, updateImplementationAgency } from "@/controllers/ia.controller"

//* initialise router
const iaRouter: Router = Router()

iaRouter.post('/create-ia', createImplementationAgency)

iaRouter.get('/fetch-ia', fetchImplementationAgencies)
iaRouter.get('/fetch-ia-district-wise/:district_id', fetchImplemenationAgencyDistrictWise)

iaRouter.patch('/update-ia/:agency_id', updateImplementationAgency)

export default iaRouter
