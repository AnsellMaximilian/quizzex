import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import CountUp from "react-countup";
import { Button, buttonVariants } from "@/components/ui/button";
import waitingSvg from "@/assets/waiting.svg";
import { cn } from "@/lib/utils";

export default function ListBattleResult() {
  const { id } = useParams();
  const { listBattle, categoryList, userToken, playerOne, playerTwo } =
    useQuery(api.listBattles.getListBattle, {
      id: (id || "") as Id<"listBattles">,
    }) ?? {};

  const isPlayerOne = userToken === listBattle?.playerOneToken;

  const currentUserGuessString = isPlayerOne
    ? "playerOneGuesses"
    : "playerTwoGuesses";
  const opponentGuessString = isPlayerOne
    ? "playerTwoGuesses"
    : "playerOneGuesses";

  const playerPoints = listBattle
    ? listBattle[currentUserGuessString].reduce(
        (total, { points }) => total + points,
        0
      )
    : 0;

  const opponentPoints = listBattle
    ? listBattle[opponentGuessString].reduce(
        (total, { points }) => total + points,
        0
      )
    : 0;

  const resultString =
    playerPoints === opponentPoints
      ? "DRAW"
      : playerPoints > opponentPoints
      ? "VICTORY"
      : "DEFEAT";

  console.log({
    opponentGuessString,
    opponentPoints,
    currentUserGuessString,
    playerPoints,
    playerOne,
    playerTwo,
    isPlayerOne,
  });

  const currentUser = isPlayerOne ? playerOne : playerTwo;

  const opponent = isPlayerOne ? playerTwo : playerOne;

  return (
    <div className="grow container mx-auto p-8 flex flex-col justify-center">
      {listBattle && categoryList ? (
        <div>
          <header className="text-center">
            <div className="text-2xl font-semibold mb-2">
              {categoryList?.title}
            </div>
            <div className="text-6xl font-bold text-paletteMain-yellow">
              {resultString}!
            </div>
          </header>
          <div className="flex gap-4 mt-16 items-center">
            <div className={`text-center grow order-1`}>
              <div className="mb-2 flex flex-col items-center gap-2">
                <img
                  src={currentUser?.profileUrl}
                  className="w-40 rounded-full"
                />
                <div className="text-3xl font-semibold">
                  {currentUser?.name}
                </div>
              </div>
              <div className="text-5xl font-bold">
                <CountUp end={playerPoints} duration={1} /> points
              </div>
            </div>
            <div className="text-6xl font-bold order-2">VS</div>
            <div className={`text-center grow order-3`}>
              <div className="mb-2 flex flex-col items-center gap-2">
                <img src={opponent?.profileUrl} className="w-40 rounded-full" />
                <div className="text-3xl font-semibold">{opponent?.name}</div>
              </div>
              <div className="text-5xl font-bold">
                <CountUp end={opponentPoints} duration={1} /> points
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-16">
            <Link
              to="/"
              className={cn(
                buttonVariants(),
                "bg-paletteMain-yellow text-2xl px-6 py-2 h-auto hover:bg-paletteMain-yellow/90"
              )}
            >
              Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="grow flex items-center justify-center flex-col">
          <img src={waitingSvg} className="w-96" />
          <div className="text-3xl font-bold mt-8">Loading...</div>
        </div>
      )}
    </div>
  );
}
