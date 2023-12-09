import { data, allMatches } from "./data.js";
import { asTree } from "treeify";
import axios from "axios";
export default function Home() {
  function compareWinRate(a, b) {
    if (
      (
        (a.matchesWon / a.matchesPlayed) *
        2 *
        (a.matchesPlayed / allMatches)
      ).toFixed(2) *
        100 <
      (
        (b.matchesWon / b.matchesPlayed) *
        2 *
        (b.matchesPlayed / allMatches)
      ).toFixed(2) *
        100
    ) {
      return 1;
    }
    if (
      (
        (a.matchesWon / a.matchesPlayed) *
        2 *
        (a.matchesPlayed / allMatches)
      ).toFixed(2) *
        100 >
      (
        (b.matchesWon / b.matchesPlayed) *
        2 *
        (b.matchesPlayed / allMatches)
      ).toFixed(2) *
        100
    ) {
      return -1;
    }
    return 0;
  }
  const getData = async () => {
    const dataa = await axios.get(
      "https://api.henrikdev.xyz/valorant/v1/account/Djalti/SYNC"
    );
    const puuid = dataa.data.data.puuid;
    const data = await axios.get(
      `https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/eu/${puuid}?size=1`
    );
    const team_red_win = data.data.data[0].teams.red.has_won;
    const team_blue_win = data.data.data[0].teams.blue.has_won;
    console.log(team_blue_win, team_red_win);
    const blue_team = data.data.data[0].players.blue;
    const red_team = data.data.data[0].players.red;
    console.log(blue_team, red_team);
  };
  getData();
  data.sort(compareWinRate);
  const PLAYERS = data.map((stats, index) => {
    return (
      <li className="flex justify-around w-full my-4">
        <p className="w-20 text-center border-x-1 border-x-white">
          {index + 1}
        </p>
        <p className="w-full text-center border-x-1 border-x-white">
          {stats.name}
        </p>
        <p className="w-full text-center border-x-1 border-x-white">
          {stats.matchesPlayed}
        </p>
        <p className="w-full text-center border-x-1 border-x-white">
          {stats.matchesWon}
        </p>
        <p className="w-full text-center border-x-1 border-x-white">
          {stats.matchesLost}
        </p>
        <p className="w-full text-center border-x-1 border-x-white">
          {stats.matchesDrawn}
        </p>
        <p className="w-full text-center border-x-1 border-x-white">
          {(stats.matchesWon / stats.matchesPlayed).toFixed(2) * 100}%
        </p>
        <p className="w-full text-center border-x-1 border-x-white">
          {(
            (stats.matchesWon / stats.matchesPlayed) *
            2 *
            (stats.matchesPlayed / allMatches)
          ).toFixed(2) * 100}
        </p>
      </li>
    );
  });
  return (
    <main className="bg-slate-900 h-full min-h-screen w-full text-white py-24 px-80">
      <ul>
        <li className="flex justify-between w-full my-4">
          <p className="w-14 text-center border-x-1 border-x-white text-green-500"></p>
          <p className="w-full text-center border-x-1 border-x-white text-green-500">
            Name
          </p>
          <p className="w-full text-center border-x-1 border-x-white text-green-500">
            Matches
          </p>
          <p className="w-full text-center border-x-1 border-x-white text-green-500">
            Won
          </p>
          <p className="w-full text-center border-x-1 border-x-white text-green-500">
            Lost
          </p>
          <p className="w-full text-center border-x-1 border-x-white text-green-500">
            Drawn
          </p>
          <p className="w-full text-center border-x-1 border-x-white text-green-500">
            Winrate
          </p>
          <p className="w-full text-center border-x-1 border-x-white text-green-500">
            Ranking points
          </p>
        </li>
        {PLAYERS}
      </ul>
    </main>
  );
}
