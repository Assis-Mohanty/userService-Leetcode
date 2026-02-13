import mongoose from "mongoose";
import { serverConfig } from ".";
import { InternalServerError } from "../utils/errors/app.error";

export async function connectDb() {
    try {
        const mongoDbUrl = serverConfig.MONGO_DB_URL
        if(!mongoDbUrl){
            throw new InternalServerError("mongoDb connection string required")
        }
        await mongoose.connect(mongoDbUrl);
        console.log("MongoDb connected successfully");
    } catch (error) {
        throw error
    }
}