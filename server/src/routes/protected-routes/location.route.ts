//* package imports
import { Router } from 'express'

//* file imports
import {
    fetchBlocks,
    fetchConstituencies,
    fetchDistricts,
    fetchLocalBodies,
    fetchLocalBodyType,
    fetchLocalBodyWards,
    fetchPanchayats,
    fetchStates,
    fetchVillages
} from '@/controllers/location.controller'
import { createPanchayat, fetchAllPanchayats, updatePanchayat } from '@/controllers/location-controllers/panchayat.controller'
import { createVillage, fetchAllVillages, updateVillage } from '@/controllers/location-controllers/village.controller'

//* initialise router
const locationRouter: Router = Router()

//? get routes
locationRouter.get('/fetch-states', fetchStates)
locationRouter.get('/fetch-districts', fetchDistricts)
locationRouter.get('/fetch-blocks', fetchBlocks)
locationRouter.get('/fetch-constituencies', fetchConstituencies)
locationRouter.get('/fetch-panchayats', fetchPanchayats)
locationRouter.get('/fetch-villages', fetchVillages)
locationRouter.get('/fetch-local-body-list', fetchLocalBodyType)
locationRouter.get('/fetch-local-bodies', fetchLocalBodies)
locationRouter.get('/fetch-local-body-wards', fetchLocalBodyWards)

//? get all data routes
locationRouter.get('/fetch-all-panchayats', fetchAllPanchayats)
locationRouter.get('/fetch-all-villages', fetchAllVillages)

//? post routes
locationRouter.post('/create-panchayat', createPanchayat)
locationRouter.post('/create-village', createVillage)

//? patch routes
locationRouter.patch('/update-panchayat/:panchayat_id', updatePanchayat)
locationRouter.patch('/update-village/:village_id', updateVillage)

export default locationRouter
