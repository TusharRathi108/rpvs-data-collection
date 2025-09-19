//* package imports
import { Router } from "express"

//* file imports
import { allSectors, createSector, subSectorAndWorks } from "@/controllers/sector.controller"

//* initialize router
const sectorRouter: Router = Router()

sectorRouter.post('/create-sector', createSector)
sectorRouter.get('/get-all-sectors', allSectors)
sectorRouter.get('/get-subsector-works', subSectorAndWorks)

export default sectorRouter
