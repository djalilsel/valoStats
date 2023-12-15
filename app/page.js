async function getData() {
    const res = await import("./api/players/route");
    const data = await (await res.GET()).json();
    return data;
}

export default async function Home() {
    const playersData = await getData();

    const totalMatches = Array.from(
        new Set(playersData.map((player) => player.matchesPlayed.map((match) => match.matchId)).flat()),
    ).length;

    const matchesWon = (player) => player.matchesPlayed.filter((match) => match.has_won).length;
    const matchesLost = (player) => player.matchesPlayed.filter((match) => !match.has_won).length;
    const rankingPoints = (player) =>
        (
            (matchesWon(player) / player.matchesPlayed.length) *
            2 *
            (player.matchesPlayed.length / totalMatches)
        ).toFixed(2) * 100;

    function compareWinRate(a, b) {
        if (rankingPoints(a) < rankingPoints(b)) {
            return 1;
        }
        if (rankingPoints(a) > rankingPoints(b)) {
            return -1;
        }
        return 0;
    }

    return (
        <main className="bg-slate-900 h-full min-h-screen w-full text-white py-24 px-80">
            <ul>
                <li className="flex justify-between w-full my-4">
                    <p className="w-14 text-center border-x-1 border-x-white text-green-500"></p>
                    <p className="w-full text-center border-x-1 border-x-white text-green-500">Name</p>
                    <p className="w-full text-center border-x-1 border-x-white text-green-500">Matches</p>
                    <p className="w-full text-center border-x-1 border-x-white text-green-500">Won</p>
                    <p className="w-full text-center border-x-1 border-x-white text-green-500">Lost</p>
                    <p className="w-full text-center border-x-1 border-x-white text-green-500">Win rate</p>
                    <p className="w-full text-center border-x-1 border-x-white text-green-500">
                        Ranking points
                    </p>
                </li>
                {playersData.sort(compareWinRate).map((player, index) => {
                    return (
                        <li className="flex justify-around w-full my-4" key={index}>
                            <p className="w-20 text-center border-x-1 border-x-white">{index + 1}</p>
                            <p className="w-full text-center border-x-1 border-x-white">
                                {player.name} #{player.tag}
                            </p>
                            <p className="w-full text-center border-x-1 border-x-white">
                                {player.matchesPlayed.length}
                            </p>
                            <p className="w-full text-center border-x-1 border-x-white">
                                {matchesWon(player)}
                            </p>
                            <p className="w-full text-center border-x-1 border-x-white">
                                {matchesLost(player)}
                            </p>
                            <p className="w-full text-center border-x-1 border-x-white">
                                {(matchesWon(player) / player.matchesPlayed.length).toFixed(2) * 100}%
                            </p>
                            <p className="w-full text-center border-x-1 border-x-white">
                                {(
                                    (matchesWon(player) / player.matchesPlayed.length) *
                                    2 *
                                    (player.matchesPlayed.length / totalMatches)
                                ).toFixed(2) * 100}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </main>
    );
}
