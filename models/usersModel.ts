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
        required: [true, 'name is required'],
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
    phone: [{ type: String }],
    address: [{
        governorate: { type: mongoose.Schema.Types.ObjectId, ref: "governorates" },
        city: { type: mongoose.Schema.Types.ObjectId, ref: "cities" },
        street: { type: String }
    }],
    role: {
        type: String,
        trim: true,
        enum: ['manager', 'admin', 'user', 'customer']
    },
    active: {
        type: Boolean,
        default: true,
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shops"
    },
    passwordChangedAt: { type: Date },
    passwordResetCode: { type: String },
    passwordResetCodeExpires: { type: Date },
    passwordResetCodeVerify: { type: Boolean },
}, { timestamps: true });



userSchema.pre<UserModel>('save', async function (next: mongoose.CallbackWithoutResultAndOptionalError): Promise<void> {
    if (!this.isModified('password')) return next();
    const hashedPassword = await bcrypt.hash(this.password, 13);
    this.password = hashedPassword;
    next();
});

userSchema.pre<UserModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'address.governorate' });
    this.populate({ path: 'address.cities' });
    next();
});

export default mongoose.model<UserModel>("users", userSchema);