//* package imports
import { connect, disconnect } from "mongoose";

//* file imports
import { env } from "@/configs/env"
// import { softDeletePlugin } from "@/plugins/exclude-soft-deleted.plugin";

// mongoose.plugin(softDeletePlugin)

export function createMongoService() {
    let isConnected = false

    async function connectDB(): Promise<void> {
        if (isConnected) return

        const mongoURI = env.MONGO_DB_URI
        if (!mongoURI) {
            throw new Error("❌ MONGO_DB_URI is not defined in the environment variables")
        }

        try {
            // mongoose.plugin(softDeletePlugin)

            await connect(mongoURI)

            isConnected = true
            console.log("✅ MongoDB connected successfully")
        } catch (error) {
            console.log(error, "❌ MongoDB connection failed:")
            throw error
        }
    }

    async function disconnectDB(): Promise<void> {
        await disconnect()
        isConnected = false
    }

    return {
        connectDB,
        disconnectDB,
    }
}

export const mongoService = createMongoService()
