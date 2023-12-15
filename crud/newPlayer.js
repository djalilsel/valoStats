import { client } from "@/config/db";

export async function newPlayer(data) {
    try {
        await client.connect();
        if (data.length == 1) {
            await client.db("players").collection("players").insertOne(data[0]);
        } else {
            await client.db("players").collection("players").insertMany(data);
        }
    } catch (err) {
        console.error(err);
    }
}
