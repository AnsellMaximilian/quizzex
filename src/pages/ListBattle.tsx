import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import { SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { v } from "convex/values";
import { Id } from "convex/_generated/dataModel";
import { format } from "date-fns";

export default function ListBattle() {
  const { id } = useParams();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [startDateTime, setStartDateTime] = useState(new Date());

  const { listBattle, categoryList } =
    useQuery(api.listBattles.getListBattle, {
      id: (id || "") as Id<"listBattles">,
    }) ?? {};

  const endDateTime = new Date(startDateTime.getTime() + 5 * 60000);

  const totalTimeBetween = endDateTime.getTime() - startDateTime.getTime();

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timeoutId);
    };
  }, []);

  useEffect(() => {
    (async () => {})().catch((e) => {});
  }, []);
  const timeLeft = endDateTime.getTime() - currentDate.getTime();
  const percent = (timeLeft / totalTimeBetween) * 100;

  console.log({
    totalTimeBetween,
    percent,
  });
  return (
    <div className="grow container mx-auto p-8 flex flex-col">
      {listBattle && categoryList ? (
        <div className="grid grid-cols-12 gap-8 h-full grow">
          <section className="col-span-8 bg-white rounded-md overflow-hidden flex flex-col gap-4">
            <header className="p-4 bg-paletteMain-yellow font-semibold text-lg text-center">
              {categoryList.title}
            </header>
            <div className="grow text-black px-4 flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <div className="flex gap-2 items-center text-sm" key={index}>
                    <div className="p-2 grow border-border border">
                      Till I Collapse
                    </div>
                    <div className="bg-green-400 text-white p-2 rounded-md">
                      +20
                    </div>
                  </div>
                );
              })}
            </div>
            <form className="flex gap-4 p-4">
              <Input />
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
                  style={{ width: `${percent}%` }}
                ></div>
                <span className="relative block">
                  {format(new Date(timeLeft), "mm:ss")}
                </span>
              </div>
              <div className="mt-4 rounded-md bg-paletteMain-yellow p-2 text-right text-white font-semibold relative overflow-hidden">
                <span className="block">2000 points</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md grow flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  return (
                    <div
                      className="flex gap-2 items-center text-xs"
                      key={index}
                    >
                      <div className="p-1 grow border-border border h-full rounded-md flex flex-col justify-center">
                        <div className="w-full bg-black rounded-full h-1 "></div>
                      </div>
                      <div className="bg-green-400 text-white p-1 rounded-md">
                        +20
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-auto p-2 bg-paletteMain-red rounded-md text-white text-right">
                1500 points
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grow">
          <div>Loading...</div>
        </div>
      )}
    </div>
  );
}
