import { NextResponse } from "next/server";
import axios from "axios";
import { fetchPlayers } from "../../../crud/getDataFromDb.js";
import { newPlayer } from "../../../crud/newPlayer.js";
import { updatePlayer } from "../../../crud/updateDb.js";

const getPlayerInfo = (player, matchId) => {
    const { puuid, name, tag, ...matchInfo } = player;
    const { team, has_won, stats } = matchInfo;

    return {
        puuid,
        name,
        tag,
        matchesPlayed: [
            {
                matchId,
                team,
                has_won,
                kills: stats.kills,
                deaths: stats.deaths,
                assists: stats.assists,
            },
        ],
    };
};

const updatePlayers = async (matchId, matchPlayers) => {
    const existentPlayers = await fetchPlayers();

    if (!existentPlayers.length) {
        const savedPlayers = matchPlayers.map((player) => getPlayerInfo(player, matchId));
        await newPlayer(savedPlayers);
        return NextResponse.json({ message: "Done" }, { status: 200 });
    }
    if (existentPlayers.some((player) => player.matchesPlayed.some((match) => match.matchId === matchId))) {
        return NextResponse.json({ message: "Match already exists" }, { status: 200 });
    }

    for (const player of matchPlayers) {
        const playerInDB = existentPlayers.find((ep) => ep.puuid === player.puuid);

        const { team, has_won, stats } = player;
        const newMatch = {
            matchId,
            team,
            has_won,
            kills: stats.kills,
            deaths: stats.deaths,
            assists: stats.assists,
        };

        if (playerInDB) {
            await updatePlayer(player.puuid, [...playerInDB.matchesPlayed, newMatch]);
        } else {
            await newPlayer([getPlayerInfo(player)]);
        }
    }
    return NextResponse.json({ message: "Done" }, { status: 200 });
};

export const POST = async (request) => {
    try {
        const { matchId } = await request.json();
        const match = await axios.get(`https://api.henrikdev.xyz/valorant/v2/match/${matchId}`);

        const red_team = match.data.data.players.red.map(({ puuid, name, tag, stats, team }) => ({
            puuid,
            name,
            tag,
            stats,
            team,
            has_won: match.data.data.teams.red.has_won,
        }));

        const blue_team = match.data.data.players.blue.map(({ puuid, name, tag, stats, team }) => ({
            puuid,
            name,
            tag,
            stats,
            team,
            has_won: match.data.data.teams.blue.has_won,
        }));

        return updatePlayers(matchId, [...red_team, ...blue_team]);
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    }
};

export const GET = async () => {
    try {
        const players = await fetchPlayers();
        return NextResponse.json(players, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    }
};
