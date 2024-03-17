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
import { Choice } from "convex/types";

export default function TriviaBattle() {
  const { id } = useParams();

  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());

  const answer = useMutation(api.triviaBattles.selectTriviaChoice);

  const [currentQuestionId, setCurrentQuestionId] =
    useState<null | Id<"triviaQuestions">>(null);

  const { triviaBattle, triviaQuestions, userToken } =
    useQuery(api.triviaBattles.getTriviaBattle, {
      id: (id || "") as Id<"triviaBattles">,
    }) ?? {};

  const startDateTime = triviaBattle?.startDateTime
    ? new Date(triviaBattle.startDateTime)
    : null;

  const endDateTime = triviaBattle?.endDateTime
    ? new Date(triviaBattle.endDateTime)
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

  const isPlayerOne = userToken === triviaBattle?.playerOneToken;

  const currentUserGuessString = isPlayerOne
    ? "playerOneResults"
    : "playerTwoResults";
  const opponentGuessString = isPlayerOne
    ? "playerTwoResults"
    : "playerOneResults";

  useEffect(() => {
    if (triviaBattle) {
      const userGuesses = triviaBattle[currentUserGuessString];
      let hasSet = false;
      triviaBattle.triviaQuestionIds.forEach((id) => {
        if (!userGuesses.some((g) => g.triviaQuestionId === id) && !hasSet) {
          setCurrentQuestionId(id);
          hasSet = true;
        }
      });
    }
  }, [triviaBattle, currentUserGuessString]);

  const choose = (choice: Choice) => {
    void (async () => {
      if (triviaBattle && currentQuestionId) {
        const res = await answer({
          triviaBattleId: triviaBattle._id,
          selectedChoice: choice,
          triviaQuestionId: currentQuestionId,
        });
        toast({ title: res.message, duration: 1000 });
      }
    })();
  };

  if (
    (triviaBattle &&
      triviaBattle.endDateTime &&
      triviaBattle.endDateTime < new Date().toISOString()) ||
    (triviaBattle &&
      triviaBattle.playerTwoToken &&
      triviaBattle.triviaQuestionIds.length ===
        triviaBattle.playerOneResults.length &&
      triviaBattle.triviaQuestionIds.length ===
        triviaBattle.playerTwoResults.length)
  ) {
    return <Navigate to={`/trivia-battle/result/${triviaBattle._id}`} />;
  }

  const question = triviaQuestions?.find((q) => q._id === currentQuestionId);

  return (
    <div className="grow container mx-auto p-8 flex flex-col">
      {triviaBattle && triviaQuestions && triviaBattle.playerTwoToken ? (
        <div className="grid grid-cols-12 gap-8 h-full grow">
          <section className="col-span-8 bg-white rounded-md overflow-hidden flex flex-col gap-4">
            <header className="p-4 bg-paletteMain-yellow font-semibold text-lg text-center">
              Question
            </header>
            <div className="grow text-black px-4 flex flex-col gap-4">
              {question && (
                <div>
                  <div className="text-2xl font-semibold tracking-tight text-center">
                    {question.questionText}
                  </div>
                  <div className="grid grid-cols-2 text-white gap-4 mt-8">
                    <button
                      className="bg-paletteMain-red hover:bg-paletteMain-red/90 rounded-lg p-4"
                      onClick={() => choose("A")}
                    >
                      {question.choiceA}
                    </button>

                    <button
                      className="bg-paletteMain-green hover:bg-paletteMain-green/90 rounded-lg p-4"
                      onClick={() => choose("B")}
                    >
                      {question.choiceB}
                    </button>

                    <button
                      className="bg-paletteMain-yellow hover:bg-paletteMain-yellow/90 rounded-lg p-4"
                      onClick={() => choose("C")}
                    >
                      {question.choiceC}
                    </button>
                    <button
                      className="bg-paletteMain-purple hover:bg-paletteMain-purple/90 rounded-lg p-4"
                      onClick={() => choose("D")}
                    >
                      {question.choiceD}
                    </button>
                  </div>
                </div>
              )}
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
                <div className="font-semibold">Questions</div>
                <div className="flex gap-4 justify-center mt-2">
                  {triviaQuestions.map((q) => {
                    const isCorrect = triviaBattle[currentUserGuessString].find(
                      (res) => res.triviaQuestionId === q._id
                    )?.isCorrect;
                    return (
                      <div
                        key={q._id}
                        className={`h-4 grow rounded-md ${
                          isCorrect !== undefined
                            ? isCorrect
                              ? "bg-green-500"
                              : "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md grow flex flex-col gap-4 text-xs">
              <div className="font-semibold text-lg">Opponent</div>
              <div className="flex gap-4 justify-center mt-2">
                {triviaQuestions.map((q) => {
                  const isCorrect = triviaBattle[opponentGuessString].find(
                    (res) => res.triviaQuestionId === q._id
                  )?.isCorrect;
                  return (
                    <div
                      key={q._id}
                      className={`h-2 grow rounded-md ${
                        isCorrect !== undefined
                          ? isCorrect
                            ? "bg-green-500"
                            : "bg-red-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
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
