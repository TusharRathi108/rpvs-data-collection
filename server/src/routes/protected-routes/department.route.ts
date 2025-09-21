//* package imports
import { Router } from "express";

//* file imports
import { createDepartment, fetchDepartments, updateDepartment } from "@/controllers/department.controller"

//* initialise router
const departmentRouter: Router = Router()

departmentRouter.post('/create-department', createDepartment)
departmentRouter.get('/fetch-departments', fetchDepartments)
departmentRouter.patch('/update-department/:department_id', updateDepartment)

export default departmentRouter
