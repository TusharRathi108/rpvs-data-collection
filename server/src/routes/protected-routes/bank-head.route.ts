//* package imports
import { Router } from "express"

//* file imports
import { createBankHead, fetchAgencyBankDetails, fetchBankDetails, updateBankHead } from "@/controllers/bank-head.controller"

//* initialize router
const bankRouter: Router = Router()

bankRouter.post('/create-bank-head', createBankHead)
bankRouter.get('/fetch-bank-details', fetchBankDetails)
bankRouter.get('/fetch-single-bank-head-details/:bank_head_id', fetchAgencyBankDetails)
bankRouter.put('/update-bank-head/:bank_head_id', updateBankHead)

export default bankRouter
