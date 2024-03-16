import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WaitingRoom() {
  const foundListBattle = useQuery(api.listBattles.findListBattle);

  const joinListBattle = useMutation(api.listBattles.joinListBattle);

  const createListBattle = useMutation(api.listBattles.createListBattle);

  const navigate = useNavigate();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      (async () => {
        if (!foundListBattle) {
          // in 10 seconds, no list has been found, then create one
          const newListBattleId = await createListBattle();

          navigate(`/list-battle/${newListBattleId}`);
          console.log("NOT FOUND IN 10 seconds");
        } else {
          await joinListBattle({ id: foundListBattle._id });
          navigate(`/list-battle/${foundListBattle._id}`);
          console.log("FOUND IN TEN SECONDS");
        }
      })().catch((e) => {});
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
            Waiting for another player...
          </h1>
        </div>
        {/* <Button className="bg-[#F3B01C] hover:bg-[#f3a11c] px-8">Test</Button> */}
      </main>
    </main>
  );
}
