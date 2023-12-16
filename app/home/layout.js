import Link from "next/link";

export default function HomeLayout({ children }) {
    return (
        <section className="bg-slate-900 flex flex-col items-center text-white min-h-screen h-full py-24 px-80">
            <nav className="flex gap-24 pb-10">
                <Link href="/home/leaderboard" className="text-3xl font-bold hover:text-green-400">
                    Leaderboard
                </Link>
                <Link href="/home/addmatch" className="text-3xl font-bold hover:text-green-400">
                    Add Match
                </Link>
            </nav>
            {children}
        </section>
    );
}
