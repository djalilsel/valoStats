import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function updatePlayer(puuid, data, matchesPlayed) {
  try {
    await client.connect();
    matchesPlayed.push(data);
    await client
      .db("players")
      .collection("players")
      .updateOne(
        { puuid: puuid },
        {
          $set: { matchesPlayed: matchesPlayed },
          $currentDate: { lastModified: true },
        }
      );
  } finally {
    await client.close();
  }
}
