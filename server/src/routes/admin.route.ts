//* package imports
import { Router } from "express";

//* file imports
import { ensurePasswordReset } from "@/middlewares/authentication";

//* routes
import resetRouter from "@/routes/reset-password.route";
import iaRouter from "@/routes/protected-routes/ia.route";
import roleRouter from "@/routes/protected-routes/role.route";
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

adminRouter.use('/reset', resetRouter)

adminRouter.use('/roles', ensurePasswordReset, roleRouter)
adminRouter.use('/users', ensurePasswordReset, userRouter)
adminRouter.use('/monetary', ensurePasswordReset, ifscRouter)
adminRouter.use('/bank-head', ensurePasswordReset, bankRouter)
adminRouter.use('/sectors', ensurePasswordReset, sectorRouter)
adminRouter.use('/location', ensurePasswordReset, locationRouter)
adminRouter.use('/budget-head', ensurePasswordReset, budgetRouter)
adminRouter.use('/proposals', ensurePasswordReset, proposalRouter)
adminRouter.use('/departments', ensurePasswordReset, departmentRouter)
adminRouter.use('/implementation-agency', ensurePasswordReset, iaRouter)

export default adminRouter
