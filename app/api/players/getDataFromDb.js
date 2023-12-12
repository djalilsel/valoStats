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
    const dataset = await client
      .db("players")
      .collection("players")
      .find()
      .toArray();
    return dataset;
  } finally {
    await client.close();
  }
}

// export async function newPlayer(data) {
//   try {
//     await client.connect();
//     await client.db("players").collection("players").insertOne(data);
//   } finally {
//     await client.close();
//   }
// }

// export async function updatePlayer(puuid, data) {
//   try {
//     await client.connect();
//     await client
//       .db("players")
//       .collection("players")
//       .updateOne(
//         { puuid: puuid },
//         { $set: data, $currentDate: { lastModified: true } }
//       );
//   } finally {
//     await client.close();
//   }
// }
