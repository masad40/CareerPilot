import { Db, MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI!; // 👈 important fix (! added)
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing");
}
// const uri = `mongodb://localhost:27017`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db: Db;

const connectDB = async (): Promise<Db> => {
  if (!db) {
    const connectedClient = await client.connect();
    db = connectedClient.db("careerpilotDB");
  }

  return db;
};

export default connectDB;