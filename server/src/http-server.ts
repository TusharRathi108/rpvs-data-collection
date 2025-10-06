import "dotenv/config"

//* package imports
import { createServer } from "http"
import os from "os"

//* file imports
import { env } from "@/configs/env"
import { mongoService } from "@/globals/mongoose-service"
import expressApp from "@/express-app"

async function startServer() {
    try {
        await mongoService.connectDB()

        const PORT = Number(process.env.PORT || env.SERVER_PORT || 3001)
        const server = createServer(expressApp)

        server.listen(PORT, "0.0.0.0", () => {
            console.log(`✅ Server running at: http://localhost:${PORT}`)
            logNetworkAddresses(PORT)
        })

    } catch (error) {
        console.log("❌ Startup failed due to DB connection error")
        process.exit(1)
    }
}

function logNetworkAddresses(port: number) {
    const interfaces = os.networkInterfaces()
    for (const ifaceGroup of Object.values(interfaces)) {
        for (const iface of ifaceGroup || []) {
            if (iface.family === "IPv4" && !iface.internal) {
                console.log(`🌍 Accessible at: http://${iface.address}:${port}`)
            }
        }
    }
}

startServer()