//* package imports
import { Document, FilterQuery, Model, PipelineStage, SortOrder } from 'mongoose';

//* file imports
import { normalizeSort } from '@/utils/utility-functions';

interface RecordsWithCount<T> {
    records: T[];
    count: number;
}

export async function getRecordsWithCount<T extends Document>(
    model: Model<T>,
    rawSort: Record<string, SortOrder>,
    skip: number,
    limit: number,
    where?: FilterQuery<T>,
    prePipeline: PipelineStage[] = []
): Promise<RecordsWithCount<T>> {

    const sortOrder = normalizeSort(rawSort);

    // Build pipeline without mutating the caller's array
    const pipeline: PipelineStage[] = [...prePipeline];

    if (where && Object.keys(where).length > 0) {
        pipeline.push({ $match: where });
    }

    pipeline.push(
        { $sort: sortOrder },
        {
            $facet: {
                DataView: [
                    { $skip: Math.max(skip, 0) },
                    { $limit: Math.max(limit, 1) }
                ],
                totalCount: [{ $count: "count" }]
            }
        }
    );

    const [facetResult] = await model.aggregate(pipeline).exec();
    const records: T[] = (facetResult?.DataView ?? []) as T[];
    const count: number = facetResult?.totalCount?.[0]?.count ?? 0;

    return { records, count };
}

// /**
//  * Fetches a page of documents plus the total count using an aggregation pipeline.
//  *
//  * @param model     - Mongoose model to query.
//  * @param where     - Filter conditions.
//  * @param sortOrder - Sort spec e.g. { createdAt: -1 }.
//  * @param skip      - Number of documents to skip (for paging).
//  * @param limit     - Maximum number of documents to return.
//  */
// export async function getRecordsWithCount<T extends Document>(
//     model: Model<T>,
//     rawSort: Record<string, SortOrder>,
//     skip: number,
//     limit: number,
//     where?: FilterQuery<T>
// ): Promise<RecordsWithCount<T>> {

//     const sortOrder = normalizeSort(rawSort);

//     const pipeline: PipelineStage[] = [];

//     if (where && Object.keys(where).length > 0) {
//         pipeline.push({ $match: where })
//     }

//     pipeline.push(
//         { $sort: sortOrder },
//         {
//             $facet: {
//                 DataView: [
//                     { $skip: skip },
//                     { $limit: limit }
//                 ],
//                 totalCount: [
//                     { $count: 'count' }
//                 ]
//             }
//         }
//     )

//     const [facetResult] = await model.aggregate(pipeline).exec();

//     const records: T[] = facetResult.DataView as T[];
//     const count: number = (facetResult.totalCount[0]?.count as number) ?? 0;

//     return { records, count };
// }