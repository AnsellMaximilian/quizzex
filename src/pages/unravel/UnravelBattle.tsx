import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { format } from "date-fns";
import waitingSvg from "@/assets/waiting.svg";
import { useToast } from "@/components/ui/use-toast";
import { ALPHABET } from "@/constants";

export default function UnravelBattle() {
  const { id } = useParams();

  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [wordGuess, setWordGuess] = useState("");

  const guessCharacter = useMutation(api.unravelBattles.guessCharacter);
  const guessWord = useMutation(api.unravelBattles.guessWord);

  const { unravelBattle, userToken } =
    useQuery(api.unravelBattles.getUnravelBattle, {
      id: (id || "") as Id<"unravelBattles">,
    }) ?? {};

  const startDateTime = unravelBattle?.startDateTime
    ? new Date(unravelBattle.startDateTime)
    : null;

  const endDateTime = unravelBattle?.endDateTime
    ? new Date(unravelBattle.endDateTime)
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

  const isPlayerOne = userToken === unravelBattle?.playerOneToken;

  const currentUserGuessString = isPlayerOne
    ? "playerOneGuesses"
    : "playerTwoGuesses";
  const opponentGuessString = isPlayerOne
    ? "playerTwoGuesses"
    : "playerOneGuesses";

  const onGuessCharacter = (char: string) => {
    void (async () => {
      if (unravelBattle) {
        const res = await guessCharacter({
          unravelBattleId: unravelBattle._id,
          guess: char,
        });
        toast({ title: res.message, duration: 1000 });
      }
    })();
  };

  const onGuessWord = (word: string) => {
    void (async () => {
      if (unravelBattle) {
        const res = await guessWord({
          unravelBattleId: unravelBattle._id,
          guess: word,
        });
        toast({ title: res.message, duration: 1000 });
        setWordGuess("");
      }
    })();
  };

  if (
    (unravelBattle &&
      unravelBattle.endDateTime &&
      unravelBattle.endDateTime < new Date().toISOString()) ||
    unravelBattle?.winnerToken
  ) {
    return <Navigate to={`/unravel-battle/result/${unravelBattle._id}`} />;
  }

  const isPlayerTurn = userToken === unravelBattle?.playerOnTurnToken;

  return (
    <div className="grow container mx-auto p-8 flex flex-col">
      {unravelBattle &&
      unravelBattle.playerTwoToken &&
      unravelBattle.wordToGuess ? (
        <div className="grid grid-cols-12 gap-8 h-full grow">
          <section className="col-span-8 bg-white rounded-md overflow-hidden flex flex-col gap-4">
            <header className="p-4 bg-paletteMain-yellow font-semibold text-lg text-center">
              Guess a Character
            </header>
            <div className="grow text-black px-4 flex flex-col gap-4">
              <div className="flex gap-2 justify-center">
                {unravelBattle.wordToGuess.split("").map((c, index) => {
                  const allGuesses = [
                    ...unravelBattle.playerOneGuesses,
                    ...unravelBattle.playerTwoGuesses,
                  ];
                  const isGuessed = allGuesses.includes(c);
                  return (
                    <div
                      key={c + index}
                      className="border-black border rounded-md p-2 w-12 h-12 flex items-center justify-center font-bold text-lg"
                    >
                      {isGuessed && c.toUpperCase()}
                    </div>
                  );
                })}
              </div>
            </div>
            <form
              className="px-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                onGuessWord(wordGuess);
              }}
            >
              <Input
                placeholder="Guess Word!"
                className="grow text-black"
                value={wordGuess}
                onChange={(e) => setWordGuess(e.target.value)}
              />
              <Button>
                <SendHorizonal />
              </Button>
            </form>
            <div className="flex flex-wrap gap-2 justify-center p-4 text-black">
              {ALPHABET.map((c, index) => {
                return (
                  <button
                    onClick={() => onGuessCharacter(c)}
                    key={c + index}
                    className="hover:bg-gray-100 border-black border rounded-md p-2 w-12 h-12 flex items-center justify-center font-bold text-lg"
                  >
                    {c.toUpperCase()}
                  </button>
                );
              })}
            </div>
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
              <div className="mt-4">
                <div className="font-semibold">Turn</div>

                <div className="flex gap-2">
                  <div
                    className={`px-2 py-1 rounded-md font-bold text-muted-foreground ${
                      isPlayerTurn ? "bg-green-500 text-white" : "bg-muted"
                    }`}
                  >
                    YOU
                  </div>
                  <div
                    className={`px-2 py-1 rounded-md font-bold text-muted-foreground ${
                      !isPlayerTurn ? "bg-green-500 text-white" : "bg-muted"
                    }`}
                  >
                    OPPONENT
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-semibold">Guesses</div>
                <div className="flex gap-4 justify-start mt-2">
                  {unravelBattle[currentUserGuessString].length <= 0 &&
                    "No guesses"}
                  {unravelBattle[currentUserGuessString].map((g) => {
                    const isCorrect = unravelBattle.wordToGuess?.includes(g);
                    return (
                      <div
                        key={g}
                        className={`h-6 w-6 rounded-md text-xs font-bold text-white flex items-center justify-center uppercase ${
                          isCorrect ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {g}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md grow flex flex-col gap-4 text-xs">
              <div className="font-semibold text-lg">Opponent</div>
              <div className="flex gap-4 justify-start mt-2">
                {unravelBattle[opponentGuessString].map((g) => {
                  const isCorrect = unravelBattle.wordToGuess?.includes(g);
                  return (
                    <div
                      key={g}
                      className={`h-6 w-6 rounded-md text-xs font-bold text-white flex items-center justify-center uppercase ${
                        isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {g}
                    </div>
                  );
                })}
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
