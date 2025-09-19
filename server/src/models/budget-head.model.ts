//* package imports
import { model, Schema, Document, Types } from "mongoose";

//* file imports
import { IBudgetHead } from "@/interfaces/budget.interface";
import { calculateFinancialYear } from "@/utils/utility-functions";

interface BudgetHeadDocument extends IBudgetHead, Document { }

const budgetHeadSchema = new Schema<BudgetHeadDocument>(
    {
        district_id: {
            type: Schema.ObjectId,
            ref: "district",
            required: true,
        },
        district_code: {
            type: String,
            ref: "district",
            required: true,
            trim: true,
        },
        district_name: {
            type: String,
            required: true,
            trim: true,
        },

        sanction_number: {
            type: String,
            unique: true,
        },

        financial_year: {
            type: String,
            required: true,
            default: () => calculateFinancialYear("full"),
        },

        allocated_budget: { type: Schema.Types.Double, default: 0 },
        allocated_budget_date: { type: Date },

        sanctioned_budget: { type: Schema.Types.Double, default: 0 },
        sanctioned_budget_date: { type: Date },

        released_budget: { type: Types.Double, ref: "fund_releases" },
        release_budget_date: { type: Date },

        isActive: { type: Boolean, default: true },

        createdBy: { type: Schema.ObjectId, ref: "users", required: true },
        updatedBy: { type: Schema.ObjectId, ref: "users", default: null },
        lastActionTakenBy: { type: Schema.ObjectId, ref: "users", default: null },
    },
    {
        timestamps: true,
    }
);

budgetHeadSchema.pre<BudgetHeadDocument>("save", async function (next) {
    if (!this.isNew && this.isModified("allocated_budget")) {
        return next(new Error("Allocated budget cannot be changed once set."));
    }
    next();
});

budgetHeadSchema.pre<BudgetHeadDocument>("save", async function (next) {
    // 1. Prevent modification of allocated budget after creation
    if (!this.isNew && this.isModified("allocated_budget")) {
        return next(new Error("Allocated budget cannot be changed once set."));
    }

    const districtCode = this.district_code ?? "";
    const financialYear = this.financial_year ?? calculateFinancialYear("short");

    if (!districtCode || !financialYear) {
        return next(new Error("District code and financial year are required."));
    }

    // 🔍 Fetch all existing records for same district + FY
    const existingRecords = await (this.constructor as typeof BudgetHeadModel).find({
        district_code: districtCode,
        financial_year: financialYear,
    });

    const hasPrevious = existingRecords.length > 0;

    if (this.isNew) {
        if (hasPrevious) {
            const firstRecord = existingRecords[0]; // Assume oldest one is correct

            // ✅ Allocated budget must be same as existing
            const existing = firstRecord?.allocated_budget?.valueOf() ?? 0;
            const current = this.allocated_budget?.valueOf();

            if (current !== existing) {
                return next(
                    new Error(
                        `Allocated budget must match existing value. Expected: ${existing}, Got: ${current}`
                    )
                );
            }

            // ✅ Sanctioned budget cumulative check
            const totalSanctionedSoFar = existingRecords.reduce((sum, r) => {
                return sum + (r.sanctioned_budget?.valueOf?.() ?? 0);
            }, 0);

            const currentSanctioned = this.sanctioned_budget?.valueOf?.() ?? 0;

            const cumulativeSanctioned = totalSanctionedSoFar + currentSanctioned;

            if (cumulativeSanctioned > this.allocated_budget?.valueOf()) {
                return next(
                    new Error(
                        `Cumulative sanctioned budget (${cumulativeSanctioned}) exceeds allocated budget (${this.allocated_budget?.valueOf()})`
                    )
                );
            }

            if ((this.sanctioned_budget?.valueOf?.() ?? 0) > (this.allocated_budget?.valueOf?.() ?? 0)) {
                return next(
                    new Error(
                        `Sanctioned budget (${this.sanctioned_budget?.valueOf?.()}) cannot exceed allocated budget (${this.allocated_budget?.valueOf?.()})`
                    )
                );
            }
        }

        // 🔢 Generate sanction number
        let runningNumber = 1;
        const lastRecord = await (this.constructor as typeof BudgetHeadModel)
            .findOne({ district_code: districtCode, financial_year: financialYear })
            .sort({ createdAt: -1 })
            .lean();

        if (lastRecord?.sanction_number) {
            const parts = lastRecord.sanction_number.split("/");
            const lastRunning = parseInt(parts[2] ?? "0", 10);
            if (!isNaN(lastRunning)) runningNumber = lastRunning + 1;
        }
        const runningStr = runningNumber.toString().padStart(3, "0");
        this.sanction_number = `${districtCode}/${financialYear}/${runningStr}`;
        this.financial_year = financialYear;
    }

    // ✅ Always: Sanctioned <= Allocated
    if (this.sanctioned_budget > this.allocated_budget) {
        return next(
            new Error(
                `Sanctioned budget (${this.sanctioned_budget}) cannot exceed allocated budget (${this.allocated_budget})`
            )
        );
    }

    // ✅ Always: Released <= Sanctioned
    if (this.released_budget > this.sanctioned_budget) {
        return next(
            new Error(
                `Released budget (${this.released_budget}) cannot exceed sanctioned budget (${this.sanctioned_budget})`
            )
        );
    }

    // Auto-set dates if not already set
    if (this.isModified("allocated_budget") && this.allocated_budget && !this.allocated_budget_date) {
        this.allocated_budget_date = new Date();
    }
    if (this.isModified("sanctioned_budget") && this.sanctioned_budget && !this.sanctioned_budget_date) {
        this.sanctioned_budget_date = new Date();
    }
    if (this.isModified("released_budget") && this.released_budget && !this.release_budget_date) {
        this.release_budget_date = new Date();
    }

    next();
});

const BudgetHeadModel = model<BudgetHeadDocument>("budget_head", budgetHeadSchema);

export { BudgetHeadDocument, BudgetHeadModel };
