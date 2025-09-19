//* package imports
import { Router } from 'express'

//* file imports
import { fetchBlocks, fetchConstituencies, fetchDistricts, fetchLocalBodies, fetchLocalBodyType, fetchLocalBodyWards, fetchPanchayats, fetchStates, fetchVillages } from '@/controllers/location.controller'

//* initialise router
const locationRouter: Router = Router()

locationRouter.get('/fetch-states', fetchStates)
locationRouter.get('/fetch-districts', fetchDistricts)
locationRouter.get('/fetch-blocks', fetchBlocks)
locationRouter.get('/fetch-constituencies', fetchConstituencies)
locationRouter.get('/fetch-panchayats', fetchPanchayats)
locationRouter.get('/fetch-villages', fetchVillages)
locationRouter.get('/fetch-local-body-list', fetchLocalBodyType)
locationRouter.get('/fetch-local-bodies', fetchLocalBodies)
locationRouter.get('/fetch-local-body-wards', fetchLocalBodyWards)

export default locationRouter
