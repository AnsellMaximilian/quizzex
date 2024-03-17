import { GAME_STATE_STRINGS } from "@/constants";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UnravelWaitingRoom() {
  const foundUnravelBattle = useQuery(api.unravelBattles.findUnravelBattle);

  const joinUnravelBattle = useMutation(api.unravelBattles.joinUnravelBattle);

  const createUnravelBattle = useMutation(
    api.unravelBattles.createUnravelBattle
  );

  const [gameState, setGameState] = useState<"SEARCH" | "CREATE" | "JOIN">(
    "SEARCH"
  );

  const navigate = useNavigate();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      (async () => {
        if (!foundUnravelBattle) {
          // in 10 seconds, no list has been found, then create one
          setGameState("CREATE");
          const newListBattleId = await createUnravelBattle();

          navigate(`/unravel-battle/${newListBattleId}`);
          console.log("NOT FOUND IN 10 seconds");
        } else {
          setGameState("JOIN");
          await joinUnravelBattle({ id: foundUnravelBattle._id });
          navigate(`/unravel-battle/${foundUnravelBattle._id}`);
          console.log("FOUND IN TEN SECONDS");
        }
      })().catch((e) => {});
    }, 5000);

    return () => {
      console.log("CLEAAR");
      clearTimeout(timeoutId);
    };
  }, [foundUnravelBattle]);

  return (
    <main className="grow flex flex-col justify-center">
      <main className="text-white">
        <div className="container max-w-2xl flex flex-col gap-8">
          <h1 className="text-4xl font-extrabold my-8 text-center">
            {GAME_STATE_STRINGS[gameState]}
          </h1>
        </div>
        {/* <Button className="bg-[#F3B01C] hover:bg-[#f3a11c] px-8">Test</Button> */}
      </main>
    </main>
  );
}
