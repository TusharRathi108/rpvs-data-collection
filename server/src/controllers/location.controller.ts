//* package imports
import { Request, Response } from "express"

//* file imports 
import { BlockModel } from "@/models/location-models/block.model"
import { ConstituencyModel } from "@/models/location-models/constituency.model"
import { DistrictModel } from "@/models/location-models/district.model"
import { LocalBodyListModel } from "@/models/location-models/local-body-type.model"
import { LocalBodyWardModel } from "@/models/location-models/local-body-ward.model"
import { LocalBodyModel } from "@/models/location-models/local-body.model"
import { PanchayatModel } from "@/models/location-models/panchayat.model"
import { StateModel } from "@/models/location-models/state.model"
import { PanchayatVillageModel } from "@/models/location-models/village.model"
import { fetchLocation } from "@/procedures/fetch-location"

const fetchStates = async (request: Request, response: Response) =>
    fetchLocation(request, response, StateModel)

const fetchDistricts = (request: Request, response: Response) => {
    console.log(request.user)
    fetchLocation(request, response, DistrictModel, (query) => ({
        ...(query.state_code ? { state_code: query.state_code } : {})
    }))
}

const fetchBlocks = (request: Request, response: Response) =>
    fetchLocation(request, response, BlockModel, (query) => ({
        ...(query.state_code ? { state_code: query.state_code } : {}),
        ...(query.district_code ? { district_code: query.district_code } : {}),
    }))

const fetchConstituencies = (request: Request, response: Response) =>
    fetchLocation(request, response, ConstituencyModel, (query) => ({
        ...(query.state_code ? { state_code: query.state_code } : {}),
        ...(query.district_code ? { district_code: query.district_code } : {}),
    }))

const fetchPanchayats = (request: Request, response: Response) =>
    fetchLocation(request, response, PanchayatModel, (query) => ({
        ...(query.district_code ? { district_code: query.district_code } : {}),
        ...(query.block_code ? { block_code: query.block_code } : {}),
    }))

const fetchVillages = (req: Request, res: Response) =>
    fetchLocation(req, res, PanchayatVillageModel, (query) => ({
        ...(query.district_code ? { district_code: query.district_code } : {}),
        ...(query.block_code ? { block_code: query.block_code } : {}),
        ...(query.panchayat_code ? { panchayat_code: query.panchayat_code } : {}),
    }))

const fetchLocalBodyType = (req: Request, res: Response) =>
    fetchLocation(req, res, LocalBodyListModel)

const fetchLocalBodies = (req: Request, res: Response) =>
    fetchLocation(req, res, LocalBodyModel, (query) => ({
        ...(query.district_code ? { district_code: query.district_code } : {}),
        ...(query.local_body_type_code ? { local_body_type_code: query.local_body_type_code } : {}),
    }))

const fetchLocalBodyWards = (req: Request, res: Response) =>
    fetchLocation(req, res, LocalBodyWardModel, (query) => ({
        ...(query.district_code ? { district_code: query.district_code } : {}),
        ...(query.local_body_type_code ? { local_body_type_code: query.local_body_type_code } : {}),
        ...(query.local_body_code ? { local_body_code: query.local_body_code } : {}),
    }))

export {
    fetchBlocks,
    fetchConstituencies, fetchDistricts, fetchLocalBodies, fetchLocalBodyType, fetchLocalBodyWards, fetchPanchayats, fetchStates, fetchVillages
}
