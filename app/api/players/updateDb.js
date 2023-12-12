import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

export async function updatePlayer(puuid, updatedMatches) {
    console.log(puuid, updatedMatches);
    try {
        await client.connect();
        await client
            .db("players")
            .collection("players")
            .updateOne(
                { puuid: puuid },
                {
                    $set: { matchesPlayed: updatedMatches },
                },
            );
    } finally {
        client.close();
    }
}
