import mongoose from "mongoose";
import User from "./userModels";

const TokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    expiredAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    revoked: {
        type: Boolean,
        default: false,
    }
});

const Token = mongoose.models.Token || mongoose.model('Token', TokenSchema);

export default Token;