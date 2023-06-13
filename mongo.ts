const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_SECRET;
export const client = new MongoClient(uri);
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();
