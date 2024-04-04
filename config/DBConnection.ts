import mongoose from "mongoose";

const DBConnection = async () => {
    await mongoose.connect(process.env['mongoDB_URL']!)
        .then(() => { console.log(`Database Connected to : ${process.env.mongoDB_URL}`); })
        .catch((err: Error) => { console.error(`Error Connecting to Database: ${err.message}`); });
};

export default DBConnection;