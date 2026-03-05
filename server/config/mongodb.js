import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database connected"));
  mongoose.connection.on("error", (err) =>
    console.log(`Database connection error: ${err}`)
  );

  const uri = process.env.MONGODB_URI.replace(/\/$/, ''); // Remove trailing slash if present
  await mongoose.connect(`${uri}/MERN-Auth`);
};
export default connectDB;
