//* package imports
import { Router } from "express";

//* file imports
import iaRouter from "@/routes/protected-routes/ia.route";
import roleRouter from "@/routes/protected-routes/role.route"
import userRouter from "@/routes/protected-routes/user.route";
import sectorRouter from "@/routes/protected-routes/sector.route";
import bankRouter from "@/routes/protected-routes/bank-head.route";
import ifscRouter from "@/routes/protected-routes/ifsc.controller";
import proposalRouter from "@/routes/protected-routes/proposal.route";
import locationRouter from "@/routes/protected-routes/location.route";
import budgetRouter from "@/routes/protected-routes/budget-head.route";
import departmentRouter from "@/routes/protected-routes/department.route";

//* initialise router
const adminRouter: Router = Router()

adminRouter.use('/roles', roleRouter)
adminRouter.use('/users', userRouter)
adminRouter.use('/monetary', ifscRouter)
adminRouter.use('/bank-head', bankRouter)
adminRouter.use('/sectors', sectorRouter)
adminRouter.use('/location', locationRouter)
adminRouter.use('/budget-head', budgetRouter)
adminRouter.use('/proposals', proposalRouter)
adminRouter.use('/departments', departmentRouter)
adminRouter.use('/implementation-agency', iaRouter)

export default adminRouter
