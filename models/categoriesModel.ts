import mongoose from "mongoose";
const categorySchema: mongoose.Schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: [true, 'Category name is required'],
        minlength: [2, 'min length must be 2'],
        maxlength: [50, 'max length must be 50']
    },
    adminUser: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: true });

export default mongoose.model("categories", categorySchema)