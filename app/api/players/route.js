import { NextResponse } from "next/server";
import axios from "axios";
import { fetchPlayers } from "./getDataFromDb.js";
import { newPlayer } from "./newPlayer.js";
import { updatePlayer } from "./updateDb.js";
const uri = process.env.MONGODB_URI;

const getPlayers = async () => {
  const players = await fetchPlayers();
  return players;
};

const updatePlayers = async (team, matchId) => {
  const players = await getPlayers();
  console.log(team);
  const newPlayers = [];
  players.length == 0
    ? team.map((player) => {
        newPlayers.push({
          puuid: player.puuid,
          name: player.name,
          tag: player.tag,
          matchesPlayed: [
            {
              matchId: matchId,
              team: player.team,
              matchResult: player.has_won ? 1 : 0,
              kills: player.stats.kills,
              deaths: player.stats.deaths,
              assists: player.stats.assists,
            },
          ],
        });
      })
    : team.map((player) => {
        let found = false;
        players.map((p) => {
          if (p.puuid === player.puuid) {
            found = true;
            updatePlayer(
              player.puuid,
              {
                matchId: matchId,
                team: player.team,
                matchResult: player.has_won ? 1 : 0,
                kills: player.stats.kills,
                deaths: player.stats.deaths,
                assists: player.stats.assists,
              },
              p.matchesPlayed
            );
          }
        });
        if (!found) {
          newPlayers.push({
            puuid: player.puuid,
            name: player.name,
            tag: player.tag,
            matchesPlayed: [
              {
                matchId: matchId,
                team: player.team,
                matchResult: player.has_won ? 1 : 0,
                kills: player.stats.kills,
                deaths: player.stats.deaths,
                assists: player.stats.assists,
              },
            ],
          });
        }
      });
  await newPlayer(newPlayers);
};
export const GET = async (request) => {
  const playerss = await getPlayers();
  try {
    return NextResponse.json(
      { message: "OK", data: playerss },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};
export const POST = async (request) => {
  try {
    const { matchId } = await request.json();
    const match = await axios.get(
      `https://api.henrikdev.xyz/valorant/v2/match/${matchId}`
    );
    let red_team = match.data.data.players.red;
    let blue_team = match.data.data.players.blue;
    const red_teamm = red_team.map((player) => {
      const { puuid, name, tag, stats, team } = player;
      return {
        puuid,
        name,
        tag,
        stats,
        team,
        has_won: match.data.data.teams.red.has_won,
      };
    });
    const blue_teamm = blue_team.map((player) => {
      const { puuid, name, tag, stats, team } = player;
      return {
        puuid,
        name,
        tag,
        stats,
        team,
        has_won: match.data.data.teams.blue.has_won,
      };
    });
    await updatePlayers([...red_teamm, ...blue_teamm], matchId);

    return NextResponse.json({ message: "Done" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};
