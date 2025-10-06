//* package imports
import { Router } from "express"

//* file imports
import { withTransaction } from "@/utils/transaction-controller"
import { createProposal, fetchProposalDetails, fetchSingleProposal, updateProposal } from "@/controllers/proposal.controller"

//* initialize router
const proposalRouter: Router = Router()

proposalRouter.post('/create-proposal', withTransaction(createProposal))
proposalRouter.get('/fetch-proposals', fetchProposalDetails)
proposalRouter.post('/fetch-single-proposal/:id', fetchSingleProposal)
proposalRouter.patch('/update-proposal/:proposal_id', withTransaction(updateProposal))

export default proposalRouter
