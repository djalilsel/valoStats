import { client } from "@/config/db";

export async function fetchPlayers() {
    try {
        await client.connect();
        const dataset = await client.db("players").collection("players").find().toArray();
        return dataset;
    } catch (err) {
        console.error(err);
    }
}
