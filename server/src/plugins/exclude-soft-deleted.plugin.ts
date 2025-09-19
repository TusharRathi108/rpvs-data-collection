//* package imports
import { Schema } from "mongoose"

// export function softDeletePlugin(schema: Schema) {
//     const applyFilter = function (this: any) {
//         if (!this.getFilter().hasOwnProperty("isDeleted")) {
//             this.where({ isDeleted: false })
//         }
//     }

//     schema.pre("find", applyFilter)
//     schema.pre("findOne", applyFilter)
//     schema.pre("countDocuments", applyFilter)

//     schema.pre("aggregate", function () {
//         const pipeline = this.pipeline()
//         console.log("[PLUGIN] Original pipeline:", JSON.stringify(pipeline, null, 2))

//         const firstStage = pipeline[0]

//         const hasDeletedCondition =
//             firstStage &&
//             "$match" in firstStage &&
//             Object.prototype.hasOwnProperty.call(firstStage.$match, "isDeleted")

//         if (!hasDeletedCondition) {
//             pipeline.unshift({ $match: { isDeleted: false } })
//             console.log("[PLUGIN] Injected $match for isDeleted: false")
//         }
//     })

//     schema.methods.softDelete = function () {
//         this.isDeleted = true
//         return this.save()
//     }
// }

export function softDeletePlugin(schema: Schema) {
    schema.pre("find", function () {
        if (!this.getFilter().hasOwnProperty("isDeleted")) {
            this.where({ isDeleted: false })
        }
    })

    schema.pre("aggregate", function () {
        const pipeline = this.pipeline()
        const firstStage = pipeline[0]

        const hasDeletedCondition =
            firstStage &&
            "$match" in firstStage &&
            Object.prototype.hasOwnProperty.call(firstStage.$match, "isDeleted")

        if (!hasDeletedCondition) {
            pipeline.unshift({ $match: { isDeleted: false } })
            console.log("[softDeletePlugin] Injected isDeleted filter")
        }
    })
}
