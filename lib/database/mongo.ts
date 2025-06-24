import { MongoClient, ServerApiVersion } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "[mongo.ts]: Please define the MONGODB_URI environment variable",
  );
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(MONGODB_URI, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(MONGODB_URI, options);
}

export default client;
