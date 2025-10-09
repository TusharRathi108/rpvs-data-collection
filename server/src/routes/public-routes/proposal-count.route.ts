//* package imports
import { Router } from "express";

//* file imports
import { fetchAllDistrictPorposalCount } from "@/controllers/proposal.controller";

//* initialise router 
const publicProposal: Router = Router()

publicProposal.get('/porposal-district-wise-count', fetchAllDistrictPorposalCount)

export default publicProposal