import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { format } from "date-fns";
import waitingSvg from "@/assets/waiting.svg";
import { useToast } from "@/components/ui/use-toast";

export default function ListBattle() {
  const { id } = useParams();

  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());

  const guess = useMutation(api.listBattles.guessListValue);

  const [guessValue, setguessValue] = useState("");

  const { listBattle, categoryList, userToken } =
    useQuery(api.listBattles.getListBattle, {
      id: (id || "") as Id<"listBattles">,
    }) ?? {};

  const startDateTime = listBattle?.startDateTime
    ? new Date(listBattle.startDateTime)
    : null;

  const endDateTime = listBattle?.endDateTime
    ? new Date(listBattle.endDateTime)
    : null;

  const totalTimeBetween =
    startDateTime && endDateTime
      ? endDateTime.getTime() - startDateTime.getTime()
      : null;

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timeoutId);
    };
  }, []);

  const timeLeft = endDateTime
    ? endDateTime.getTime() - currentDate.getTime()
    : null;
  const percent =
    timeLeft && totalTimeBetween ? (timeLeft / totalTimeBetween) * 100 : null;

  const isPlayerOne = userToken === listBattle?.playerOneToken;

  const currentUserGuessString = isPlayerOne
    ? "playerOneGuesses"
    : "playerTwoGuesses";
  const opponentGuessString = isPlayerOne
    ? "playerTwoGuesses"
    : "playerOneGuesses";

  const onGuess: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void (async () => {
      if (listBattle) {
        const res = await guess({
          listBattleId: listBattle._id,
          guess: guessValue,
        });
        toast({ title: res.message, duration: 1000 });
        setguessValue("");
      }
    })();
  };

  if (
    listBattle &&
    listBattle.endDateTime &&
    listBattle.endDateTime < new Date().toISOString()
  ) {
    return <Navigate to={`/list-battle-result/${listBattle._id}`} />;
  }

  return (
    <div className="grow container mx-auto p-8 flex flex-col">
      {listBattle && categoryList ? (
        <div className="grid grid-cols-12 gap-8 h-full grow">
          <section className="col-span-8 bg-white rounded-md overflow-hidden flex flex-col gap-4">
            <header className="p-4 bg-paletteMain-yellow font-semibold text-lg text-center">
              {categoryList.title}
            </header>
            <div className="grow text-black px-4 flex flex-col gap-2">
              {listBattle[currentUserGuessString].map((guess, index) => {
                return (
                  <div className="flex gap-2 items-center text-sm" key={index}>
                    <div className="p-2 grow border-border border">
                      {guess.value}
                    </div>
                    <div className="bg-green-400 text-white p-2 rounded-md">
                      +{guess.points}
                    </div>
                  </div>
                );
              })}
            </div>
            <form className="flex gap-4 p-4" onSubmit={onGuess}>
              <Input
                className="text-black"
                placeholder="Guess"
                value={guessValue}
                onChange={(e) => setguessValue(e.target.value)}
              />
              <Button className="bg-paletteMain-yellow">
                <SendHorizonal />
              </Button>
            </form>
          </section>
          <div className="col-span-4 flex flex-col gap-8 text-black">
            <div className="bg-white p-4 rounded-md">
              <div className="rounded-md bg-gray-500 p-2 text-right text-white font-semibold relative overflow-hidden">
                <div
                  className="absolute left-0 inset-y-0 bg-paletteMain-green"
                  style={{ width: `${percent ?? 0}%` }}
                ></div>
                <span className="relative block">
                  {timeLeft ? format(new Date(timeLeft), "mm:ss") : "00:00"}
                </span>
              </div>
              <div className="mt-4 rounded-md bg-paletteMain-yellow p-2 text-right text-white font-semibold relative overflow-hidden">
                <span className="block">
                  {listBattle[currentUserGuessString].reduce(
                    (total, { points }) => total + points,
                    0
                  )}{" "}
                  points
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md grow flex flex-col gap-4 text-xs">
              <div className="font-semibold text-lg">Opponent</div>
              <div className="flex flex-col gap-2">
                {listBattle[opponentGuessString].map((guess, index) => {
                  return (
                    <div
                      className="flex gap-2 items-center text-xs"
                      key={index}
                    >
                      <div className="p-1 grow border-border border h-full rounded-md flex flex-col justify-center">
                        <div className="w-full bg-black rounded-full h-1 "></div>
                      </div>
                      <div className="bg-green-400 text-white p-1 rounded-md">
                        +{guess.points}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-auto p-2 bg-paletteMain-red rounded-md text-white text-right">
                {listBattle[opponentGuessString].reduce(
                  (total, { points }) => total + points,
                  0
                )}{" "}
                points
              </div>
            </div>
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
