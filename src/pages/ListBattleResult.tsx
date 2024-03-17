import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";
import { useParams } from "react-router-dom";
import CountUp from "react-countup";
import { Button } from "@/components/ui/button";
import waitingSvg from "@/assets/waiting.svg";

export default function ListBattleResult() {
  const { id } = useParams();
  const { listBattle, categoryList, userToken } =
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

  return (
    <div className="grow container mx-auto p-8 flex flex-col justify-center">
      {listBattle && categoryList ? (
        <div>
          <header className="text-center">
            <div className="text-2xl font-semibold mb-2">
              {categoryList?.title}
            </div>
            <div className="text-6xl font-bold text-paletteMain-yellow">
              VICTORY!
            </div>
          </header>
          <div className="flex gap-4 mt-16 items-center">
            <div className="text-center grow">
              <div className="text-3xl font-semibold mb-2">Player One</div>
              <div className="text-5xl font-bold">
                <CountUp
                  end={listBattle[currentUserGuessString].reduce(
                    (total, { points }) => total + points,
                    0
                  )}
                  duration={1}
                />{" "}
                points
              </div>
            </div>
            <div className="text-6xl font-bold">VS</div>
            <div className="text-center grow">
              <div className="text-3xl font-semibold mb-2">Player One</div>
              <div className="text-5xl font-bold">
                <CountUp
                  end={listBattle[opponentGuessString].reduce(
                    (total, { points }) => total + points,
                    0
                  )}
                  duration={1}
                />{" "}
                points
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-16">
            <Button className="bg-paletteMain-yellow text-2xl px-6 py-2 h-auto">
              Home
            </Button>
          </div>
        </div>
      ) : (
        <div className="grow flex items-center justify-center flex-col">
          <img src={waitingSvg} className="w-96" />
          <div className="text-3xl font-bold mt-8">
            Waiting for another player to join...
          </div>
        </div>
      )}
    </div>
  );
}
