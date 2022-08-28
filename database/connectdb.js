import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.URI_MONGO);
  console.log("Mongo DB connection established");
} catch (error) {
  console.log(" MongoDB connection error: " + error.message);
}
