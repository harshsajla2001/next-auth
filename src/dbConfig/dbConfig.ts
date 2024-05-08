import mongoose from "mongoose";

export async function connectDB() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log('Mongoose connected to: ', process.env.MONGO_URI);
        });
        connection.on('error', (err) => {
            console.log('Mongoose connection error: ', err);
            process.exit(1)
        });
    } catch (error) {
        console.log('error:\n',error)
    }
}