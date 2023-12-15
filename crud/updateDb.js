import { client } from "@/config/db";

export async function updatePlayer(puuid, updatedMatches) {
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
    } catch (err) {
        console.error(err);
    }
}
