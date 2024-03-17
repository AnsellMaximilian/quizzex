import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const auth = useUser();
  const { listBattles, triviaBattles, unravelBattles, userToken } =
    useQuery(api.users.getUserHistories) ?? {};
  return (
    <div className="grow container mx-auto p-8 flex flex-col gap-4">
      {/* <h1 className="text-2xl font-semibold">Profile</h1> */}

      {auth.user && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 text-black">
            {/* <h1 className="text-xl font-bold mb-4">Profile</h1> */}
            <div className="flex gap-4">
              <div>
                <img src={auth.user.imageUrl} className="w-32 rounded-full" />
              </div>
              <div className="grow">
                <div className="text-3xl font-bold">{auth.user.username}</div>
                <div className="mt-4 space-y-2">
                  <div>
                    <div className="text-muted-foreground text-sm">Email</div>
                    <div>{auth.user.emailAddresses[0]?.emailAddress}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 text-black">
            <h2 className="text-2xl font-bold">Scores and History</h2>
            <Separator className="my-4" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">List Battles</h3>
                <div className="flex flex-col gap-2">
                  {listBattles?.map((lb) => {
                    const isPlayerOne = userToken === lb.playerOneToken;

                    const currentUserGuessString = isPlayerOne
                      ? "playerOneGuesses"
                      : "playerTwoGuesses";
                    const opponentGuessString = isPlayerOne
                      ? "playerTwoGuesses"
                      : "playerOneGuesses";

                    const playerPoints = lb
                      ? lb[currentUserGuessString].reduce(
                          (total, { points }) => total + points,
                          0
                        )
                      : 0;

                    const opponentPoints = lb
                      ? lb[opponentGuessString].reduce(
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
                    return (
                      <div
                        key={lb._id}
                        className="p-2 border border-border rounded-md flex gap-2 items-center"
                      >
                        <div className="font-semibold text-sm">
                          YOU vs. {lb.opponent?.name}
                        </div>
                        <div className="ml-auto text-sm font-bold">
                          {playerPoints} vs {opponentPoints}{" "}
                        </div>
                        <div
                          className={`text-xs p-1 text-white rounded-md font-bold ${
                            resultString === "DRAW"
                              ? "bg-gray-500"
                              : resultString === "VICTORY"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {resultString}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="">
                <h3 className="text-lg font-semibold mb-2">Trivia Battles</h3>
                <div className="flex flex-col gap-2">
                  {triviaBattles?.map((tb) => {
                    const isPlayerOne = userToken === tb?.playerOneToken;

                    const currentUserGuessString = isPlayerOne
                      ? "playerOneResults"
                      : "playerTwoResults";
                    const opponentGuessString = isPlayerOne
                      ? "playerTwoResults"
                      : "playerOneResults";

                    const playerPoints = tb
                      ? tb[currentUserGuessString].reduce(
                          (total, { isCorrect }) => total + (isCorrect ? 1 : 0),
                          0
                        )
                      : 0;

                    const opponentPoints = tb
                      ? tb[opponentGuessString].reduce(
                          (total, { isCorrect }) => total + (isCorrect ? 1 : 0),
                          0
                        )
                      : 0;

                    const resultString =
                      playerPoints === opponentPoints
                        ? "DRAW"
                        : playerPoints > opponentPoints
                        ? "VICTORY"
                        : "DEFEAT";
                    return (
                      <div
                        key={tb._id}
                        className="p-2 border border-border rounded-md flex gap-2 items-center"
                      >
                        <div className="font-semibold text-sm">
                          YOU vs. {tb.opponent?.name}
                        </div>
                        <div className="ml-auto text-sm font-bold">
                          {playerPoints} vs {opponentPoints}{" "}
                        </div>
                        <div
                          className={`text-xs p-1 text-white rounded-md font-bold ${
                            resultString === "DRAW"
                              ? "bg-gray-500"
                              : resultString === "VICTORY"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {resultString}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Unravel Battles</h3>
                <div className="flex flex-col gap-2">
                  {unravelBattles?.map((ub) => {
                    const isPlayerOne = userToken === ub.playerOneToken;

                    const currentUserGuessString = isPlayerOne
                      ? "playerOneGuesses"
                      : "playerTwoGuesses";
                    const opponentGuessString = isPlayerOne
                      ? "playerTwoGuesses"
                      : "playerOneGuesses";

                    const resultString =
                      ub.winnerToken === userToken ? "VICTORY" : "DEFEAT";
                    return (
                      <div
                        key={ub._id}
                        className="p-2 border border-border rounded-md flex gap-2 items-center"
                      >
                        <div className="font-semibold text-sm">
                          YOU vs. {ub.opponent?.name}
                        </div>
                        <div
                          className={`ml-auto text-xs p-1 text-white rounded-md font-bold ${
                            resultString === "VICTORY"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {resultString}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
