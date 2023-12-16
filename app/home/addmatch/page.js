"use client";
import axios from "axios";
import { useEffect, useState } from "react";

async function getHistory({ name, tag, size }) {
    const { puuid } = (await axios.get(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`)).data
        .data;
    const history = await axios.get(
        `https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/eu/${puuid}?mode=custom&size=${size}`,
    );

    return { data: history.data.data.filter((match) => match.metadata.mode === "Custom Game"), puuid };
}

async function addMatch(id, matchid) {
    try {
        document.getElementById(id).disabled = true;
        document.getElementById(id).innerHTML = "Loading...";
        const res = await axios.post("../api/players", { matchId: matchid });
        console.log(res);
        document.getElementById(id).disabled = false;
        document.getElementById(id).innerHTML = res.data.message;
    } catch (err) {
        console.log(err);
    }
}

export default function AddMatch() {
    const [input, setInput] = useState({ name: "", tag: "", size: 1 });
    const [matches, setMatches] = useState([]);
    const [MATCHES, setMATCHES] = useState([]);
    const [playerPuuid, setPlayerPuuid] = useState("");

    useEffect(() => {
        setMATCHES(
            matches.map((match, index) => {
                const team = match.players.all_players
                    .find((player) => player.puuid === playerPuuid)
                    .team.toLowerCase();
                return (
                    <div
                        className="flex gap-5 items-center text-lg my-1 w-full border-2 border-white rounded-md px-5 py-2"
                        key={index}
                    >
                        <div>{match.metadata.map}</div>
                        <div className="flex-1 text-center">
                            {team == "blue" ? match.teams.blue.rounds_won : match.teams.red.rounds_won} -{" "}
                            {team == "blue" ? match.teams.blue.rounds_lost : match.teams.red.rounds_lost}
                        </div>
                        <button
                            id={`add${index}`}
                            className="bg-green-400 text-white text-base font-medium px-2 py-1 rounded-sm justify-self-end"
                            onClick={() => addMatch(`add${index}`, match.metadata.matchid)}
                        >
                            Add
                        </button>
                    </div>
                );
            }),
        );
    }, [matches]);

    function handleChange(e) {
        e.preventDefault();
        if (e.target.name == "size") {
            if (e.target.value < 1 || e.target.value > 10) return;
        }

        setInput((prevInput) => ({
            ...prevInput,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            document.getElementById("submit").disabled = true;
            document.getElementById("submit").innerHTML = "Loading...";
            const { data, puuid } = await getHistory(input);
            setPlayerPuuid(puuid);
            setMatches(data);
            document.getElementById("submit").disabled = false;
            document.getElementById("submit").innerHTML = "Done";
        } catch (err) {
            console.log(err);
            document.getElementById("submit").disabled = false;
            document.getElementById("submit").innerHTML = "Try Again";
        }
    }
    console.log(matches);
    return (
        <section>
            <div className="flex gap-2 mb-2">
                <input
                    name="name"
                    type="text"
                    value={input.name}
                    placeholder="Enter Player Name (ex: John Doe)"
                    className="w-80 text-black px-6 py-2 rounded-sm"
                    onChange={handleChange}
                />
                <input
                    name="tag"
                    type="text"
                    value={input.tag}
                    placeholder="(ex: 1234)"
                    className="w-28 text-black px-2 py-2 rounded-sm"
                    onChange={handleChange}
                />
                <input
                    name="size"
                    type="number"
                    placeholder="(min: 1, max: 10)"
                    value={input.size}
                    className="w-16 text-black px-2 py-2 rounded-sm"
                    onChange={handleChange}
                />
                <button
                    className="bg-green-500 text-white text-lg font-bold px-6 py-2 rounded-sm"
                    disabled={false}
                    id="submit"
                    onClick={handleSubmit}
                >
                    search
                </button>
            </div>
            <div className="flex flex-col gap-2">{MATCHES}</div>
        </section>
    );
}
