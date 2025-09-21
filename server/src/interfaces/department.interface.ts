//* package imports
import { Types } from "mongoose"

interface IDepartment {
    department_name: string
    contact_person: string
    contact_number: number
    contact_email: string
    isDeleted: boolean
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    lasteActionTakenBy: Types.ObjectId
}

export {
    IDepartment
}
