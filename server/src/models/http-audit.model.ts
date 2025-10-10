//* package imports
import { Document, model, Schema } from "mongoose";

//* file imports
import { IHttpAudit } from "@/interfaces/http-audit.interface";

interface HttpAuditDocument extends IHttpAudit, Document { }

const httpAuditSchema = new Schema<HttpAuditDocument>({
    user_agent: {
        type: String,
        required: true
    },
    ip_address: {
        type: String,
        default: null
    },
    browser: {
        name: String,
        version: String
    },
    os: {
        name: String,
        version: String
    },
    location: {
        country: String,
        region: String,
        city: String
    },
    device: {
        model: String,
        d_type: String,
        vendor: String
    },
    action_performed: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const HttpAuditModel = model<HttpAuditDocument>("HttpLog", httpAuditSchema)

export default HttpAuditModel
