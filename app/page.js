"use client";
import { data, allMatches } from "./data.js";
import { asTree } from "treeify";
import axios from "axios";
import { useEffect } from "react";
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
  data.sort(compareWinRate);
  const PLAYERS = data.map((stats, index) => {
    return (
      <li className="flex justify-around w-full my-4" key={index}>
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
  useEffect(() => {
    const fetching = async () => {
      const players = (await axios.get("http://localhost:3000/api/players"))
        .data.data;
      console.log(players);
    };
    fetching();
  }, []);
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
