// //* package imports
// import geoip from "geoip-lite";
// import { NextFunction, Request, Response } from "express";

// //* file imports
// import { parseDevice } from "@/utils/parse-device";
// import HttpAuditModel from "@/models/http-audit.model";

// export const auditLogger = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const deviceInfo = parseDevice(req);

//         const geo = deviceInfo.ip_address !== "unknown"
//             ? geoip.lookup(deviceInfo.ip_address)
//             : null;

//         let action = `${req.method.toLowerCase()} ${req.originalUrl.toLowerCase()}`;

//         const auditData = {
//             user_agent: deviceInfo.user_agent,
//             ip_address: deviceInfo.ip_address,
//             browser: deviceInfo.browser,
//             os: deviceInfo.os,
//             device: deviceInfo.device,
//             location: {
//                 country: geo?.country?.toLowerCase() || null,
//                 region: geo?.region?.toLowerCase() || null,
//                 city: geo?.city?.toLowerCase() || null,
//             },
//             action_performed: action,
//         };

//         HttpAuditModel.create(auditData).catch((err) => {
//             console.error("Failed to save audit log:", err);
//         });
//     } catch (err) {
//         console.error("Audit logger error:", err);
//     }

//     next();
// };
