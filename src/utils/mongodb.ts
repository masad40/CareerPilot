import { Db, MongoClient, ServerApiVersion } from "mongodb";
const uri = `mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}@cluster0.czus8kq.mongodb.net/?appName=Cluster0`;

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
