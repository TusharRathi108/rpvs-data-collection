//* package imports
import { Request } from "express";
import { UAParser } from "ua-parser-js";

function inferDeviceTypeFromModel(model: string | undefined, osName: string | undefined): string {
    if (!model && !osName) return "unknown";

    const m = (model || "").toLowerCase();
    const os = (osName || "").toLowerCase();

    if (m.includes("ipad")) return "tablet";
    if (m.includes("iphone") || m.includes("pixel") || m.includes("android")) return "mobile";
    if (m.includes("mac") || m.includes("macintosh")) return "desktop";
    if (m.includes("windows") || os.includes("windows")) return "desktop";
    if (m.includes("linux") || os.includes("linux")) return "desktop";
    if (m.includes("tv")) return "smarttv";
    if (m.includes("watch")) return "wearable";

    // Fallback based on OS
    if (["ios", "android"].includes(os)) return "mobile";
    if (["windows", "mac os", "linux", "chrome os"].includes(os)) return "desktop";
    if (["tvos", "fireos"].includes(os)) return "smarttv";
    if (["wear os", "watchos"].includes(os)) return "wearable";

    return "unknown";
}

export function parseDevice(req: Request) {
    const ua = new UAParser(req.headers["user-agent"] || "");
    const device = ua.getDevice();
    const os = ua.getOS();
    const browser = ua.getBrowser();

    const model = (device.model || "unknown").toLowerCase();
    const vendor = (device.vendor || "unknown").toLowerCase();
    const osName = (os.name || "unknown").toLowerCase();
    const osVersion = (os.version || "").toLowerCase();
    const browserName = (browser.name || "unknown").toLowerCase();
    const browserVersion = (browser.version || "").toLowerCase();
    const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        req.socket.remoteAddress?.toLowerCase() ||
        "unknown";

    const d_type = inferDeviceTypeFromModel(device.model, os.name).toLowerCase();

    return {
        ip_address: ip,
        user_agent: req.headers["user-agent"]?.toLowerCase() || "unknown",
        browser: {
            name: browserName,
            version: browserVersion,
        },
        os: {
            name: osName,
            version: osVersion,
        },
        device: {
            model,
            d_type,
            vendor,
        }
    };
}
