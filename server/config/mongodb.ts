import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database connected"));
  mongoose.connection.on("error", (err) =>
    console.log(`Database connection error: ${err}`)
  );

  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }
  const uri = mongodbUri.replace(/\/$/, ''); // Remove trailing slash if present
  await mongoose.connect(`${uri}/MERN-Auth`);
};
export default connectDB;
