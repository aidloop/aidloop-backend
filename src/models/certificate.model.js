import mongoose from "mongoose"
import User from "../models/User"
const certificateSchema = new mongoose.schema({
    certificateNumber: {
        type: String,
        unique: true,
        required: true
    },
    
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    verificationCode: {
        type: String
    },

    issuedAt: {
        type: Date ,
        default: Date.now
    },

    pdfUrl: {
        type: String
    }
})
export default mongoose.model("certificate", certificateSchema)