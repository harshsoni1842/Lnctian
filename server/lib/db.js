import mongoose from "mongoose";

//function to connect to the mongoose database
export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('MongoDB successfully connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/Lnctian`);
    } catch (error) {
        console.log( 'MongoDB Not connected '+error);
    }
}
