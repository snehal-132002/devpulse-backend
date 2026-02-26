import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "developer"],
        default: "developer"
    },
    avatar: String,
    isVerified: {
        type: Boolean,
        default: false
    },

    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);