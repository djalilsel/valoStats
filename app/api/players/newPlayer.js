import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

export async function newPlayer(data) {
    try {
        await client.connect();
        if (data.length == 1) {
            await client.db("players").collection("players").insertOne(data[0]);
        } else {
            await client.db("players").collection("players").insertMany(data);
        }
    } finally {
        await client.close();
    }
}
