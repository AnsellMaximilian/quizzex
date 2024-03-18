import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const stateStrings = {
  SEARCH: "Searching for available battles...",
  CREATE: "No battle found. Creating a new one...",
  JOIN: "Battle found! Joining battle...",
};

export default function WaitingRoom() {
  const foundListBattle = useQuery(api.listBattles.findListBattle);

  const joinListBattle = useMutation(api.listBattles.joinListBattle);

  const createListBattle = useMutation(api.listBattles.createListBattle);

  const [gameState, setGameState] = useState<"SEARCH" | "CREATE" | "JOIN">(
    "SEARCH"
  );

  const navigate = useNavigate();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void (async () => {
        if (!foundListBattle) {
          // in 10 seconds, no list has been found, then create one
          setGameState("CREATE");
          const newListBattleId = await createListBattle();

          navigate(`/list-battle/${newListBattleId}`);
          console.log("NOT FOUND IN 10 seconds");
        } else {
          setGameState("JOIN");
          await joinListBattle({ id: foundListBattle._id });
          navigate(`/list-battle/${foundListBattle._id}`);
          console.log("FOUND IN TEN SECONDS");
        }
      })();
    }, 5000);

    return () => {
      console.log("CLEAAR");
      clearTimeout(timeoutId);
    };
  }, [foundListBattle]);

  return (
    <main className="grow flex flex-col justify-center">
      <main className="text-white">
        <div className="container max-w-2xl flex flex-col gap-8">
          <h1 className="text-4xl font-extrabold my-8 text-center">
            {stateStrings[gameState]}
          </h1>
        </div>
        {/* <Button className="bg-[#F3B01C] hover:bg-[#f3a11c] px-8">Test</Button> */}
      </main>
    </main>
  );
}
