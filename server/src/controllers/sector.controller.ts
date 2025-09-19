//* package imports
import { Types } from "mongoose"
import { Request, Response } from "express"

//* file imports
import SectorModel from "@/models/sector.model"
import { fetchData } from "@/globals/find-all.helper"
import { sectorDto, sectorSchema } from "@/schemas/sector.schema"
import { handleError, successHandler } from "@/globals/response-handler.helper"

const createSector = async (request: Request, response: Response) => {
    const parsedPayload: sectorDto = sectorSchema.parse(request.body)

    const {
        department_id,
        sector_name,
        permissible_works,
        createBy
    } = parsedPayload;

    const sectorData = {
        department_id,
        sector_name,
        createBy,
        permissible_works: [] as any[],
    };

    try {

        for (const item of permissible_works) {
            if (typeof item === "string") {
                sectorData.permissible_works.push(item);
            } else if (typeof item === "object" && "sub_sector" in item) {
                sectorData.permissible_works.push({
                    sub_sector: item.sub_sector,
                    works: item.works,
                });
            }
        }

        const result = new SectorModel(sectorData);
        await result.save();

        return successHandler({ response, records: result, message: "Records creared successfully....!", status: true, httpCode: 200 })

    } catch (error) {
        console.log(error)
        return handleError(error, response)
    }
}

const allSectors = async (request: Request, response: Response) => {
    try {
        const result = await fetchData(SectorModel, {}, { permissible_works: 0 })
        return successHandler({ response, records: result, message: "All the sectors....!", status: true, httpCode: 200 })
    } catch (error) {
        console.log(error)
        return handleError(error, response)
    }
}

const subSectorAndWorks = async (request: Request, response: Response) => {
    const { sector, subSector } = request.query as { sector: string, subSector: string }

    const pipeline = [
        {
            $match: {
                _id: new Types.ObjectId(sector)
            }
        },
        {
            $project: {
                _id: 0,
                sector_name: 1,
                result: {
                    $let: {
                        vars: {
                            isNested: {
                                $gt: [
                                    {
                                        $size: {
                                            $filter: {
                                                input: "$permissible_works",
                                                as: "pw",
                                                cond: {
                                                    $and: [
                                                        { $ne: ["$$pw.sub_sector", null] },
                                                        { $isArray: "$$pw.works" }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    0
                                ]
                            },
                            subsectorsAll: {
                                $map: {
                                    input: "$permissible_works",
                                    as: "pw",
                                    in: "$$pw.sub_sector"
                                }
                            },
                            selected: {
                                $first: {
                                    $filter: {
                                        input: "$permissible_works",
                                        as: "pw",
                                        cond: { $eq: ["$$pw.sub_sector", subSector] }
                                    }
                                }
                            }
                        },
                        in: {
                            $cond: [
                                { $and: ["$$isNested", { $ifNull: [subSector, false] }] },
                                {
                                    sector_name: "$sector_name",
                                    sub_sectors: subSector,
                                    works: { $ifNull: ["$$selected.works", []] }
                                },
                                {
                                    sector_name: "$sector_name",
                                    sub_sectors: { $cond: ["$$isNested", "$$subsectorsAll", []] },
                                    works: { $cond: ["$$isNested", [], "$permissible_works"] }
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            $replaceRoot: { newRoot: "$result" }
        }
    ]

    try {
        const result = await SectorModel.aggregate(pipeline)
        return successHandler({ response, records: result, message: "Works fetched successfully....!", status: true, httpCode: 200 })
    } catch (error) {
        console.log(error)
        return handleError(error, response)
    }
}

export { allSectors, createSector, subSectorAndWorks }
