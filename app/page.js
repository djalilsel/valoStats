import { redirect } from "next/navigation";
import React from "react";

const page = () => {
    redirect("/home/leaderboard");
    return <main>Loading...</main>;
};

export default page;
