import { MongoClient, ServerApiVersion } from "mongodb";
import { getDatabaseURI } from "@/lib/database/getDatabaseURI";

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  const uri = getDatabaseURI();

  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  const uri = getDatabaseURI();

  client = new MongoClient(uri, options);
}

export default client;
