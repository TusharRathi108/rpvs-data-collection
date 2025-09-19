//* package imports
import { Router } from "express"

//* file imports
import { createBudgetHead, fetchBudgetDetails, fetchSingleBudgetHeadDetails, updateBudgetHead } from "@/controllers/budget-head.controller"

//* initialize router
const budgetRouter: Router = Router()

budgetRouter.post('/create-budget-head', createBudgetHead)
budgetRouter.get('/fetch-budget-head-details', fetchBudgetDetails)
budgetRouter.get('/fetch-single-budget-head-details/:budget_head_id', fetchSingleBudgetHeadDetails)
budgetRouter.put('/update-budget-head/:budget_head_id', updateBudgetHead)

export default budgetRouter
