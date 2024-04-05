import mongoose from "mongoose";
import { UserModel } from "../interfaces";
import bcrypt from "bcryptjs";

const userSchema: mongoose.Schema = new mongoose.Schema<UserModel>({
    username: {
        type: String,
        trim: true,
        required: [true, 'username is required'],
        unique: true,
        lowercase: true,
        minlength: [2, 'Username must be at least 2 characters'],
        maxlength: [20, 'Username must be at most 20 characters']
    },
    name: {
        type: String,
        trim: true,
        require: [true, 'name is required'],
        lowercase: true,
        minlength: [2, 'name min length must be 2'],
        maxlength: [50, 'name max length must be 50']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'password is required'],
        minlength: [6, 'too short password'],
        maxlength: [14, 'too long password']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        trim: true,
        enum: ['manager', 'admin', 'user'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }],
    adminUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    passwordChangedAt: { type: Date },
    passwordResetCode: { type: String },
    passwordResetCodeExpires: { type: Date },
    passwordResetCodeVerify: { type: Boolean },
}, { timestamps: true });



userSchema.pre<UserModel>('save', async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) return next();
    const hashedPassword = await bcrypt.hash(this.password, 13);
    this.password = hashedPassword;
    next();
});

export default mongoose.model<UserModel>("users", userSchema);