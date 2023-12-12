import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

export async function fetchPlayers() {
    try {
        await client.connect();
        const dataset = await client.db("players").collection("players").find().toArray();
        return dataset;
    } finally {
        await client.close();
    }
}
