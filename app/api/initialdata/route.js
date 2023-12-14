import { NextResponse } from "next/server";
import { fetchPlayers } from "../players/getDataFromDb.js";

const getPlayers = async () => {
    const players = await fetchPlayers();
    return players;
};

export const GET = async () => {
    const players = await getPlayers();
    try {
        return NextResponse.json(players, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    }
};