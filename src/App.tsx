import { Link } from "react-router-dom";
import icon from "@/assets/quizzex-icon.svg";
import listBattleIcon from "@/assets/list-battle.svg";
import comingSoonIcon from "@/assets/coming-soon.svg";
import triviaIcon from "@/assets/trivia.svg";

export default function App() {
  return (
    <div className="grow container mx-auto p-8 flex flex-col">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-white p-8">
            <img src={icon} className="w-32" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-center">
          Realtime Quizz Battles
        </h1>
        <p className="text-xl">
          Fight against other users right from your browser!
        </p>
      </div>
      <div className="grid grid-cols-12 gap-4 mb-8 max-w-3xl mx-auto">
        <Link
          to={"/waiting-room"}
          className="col-span-4 bg-paletteMain-red rounded-lg border-4 border-white p-4 hover:bg-paletteMain-red/90"
        >
          <div className="p-4 flex justify-center rounded-lg  ">
            <img src={listBattleIcon} className="w-32" />
          </div>
          <hr />
          <div className="mt-2">
            <div className="text-xl font-bold">List Battles</div>
            <p className="leading-5 tracking-tight">
              Battle users in a game of category!
            </p>
          </div>
        </Link>
        <Link
          to="/trivia-battle/waiting-room"
          className="col-span-4 bg-paletteMain-yellow rounded-lg border-4 border-white p-4 hover:bg-paletteMain-yellow/90"
        >
          <div className="p-4 flex justify-center rounded-lg  ">
            <img src={triviaIcon} className="w-32" />
          </div>
          <hr />
          <div className="mt-2">
            <div className="text-xl font-bold">Trivia Battles</div>
            <p className="leading-5 tracking-tight">
              Battle users in a game of category!
            </p>
          </div>
        </Link>
        <article className="col-span-4 bg-paletteMain-green rounded-lg border-4 border-white p-4 hover:bg-paletteMain-green/90">
          <div className="p-4 flex justify-center rounded-lg  ">
            <img src={comingSoonIcon} className="w-32" />
          </div>
          <hr />
          <div className="mt-2">
            <div className="text-xl font-bold">Coming Soon!</div>
            <p className="leading-5 tracking-tight">
              Battle users in a game of category!
            </p>
          </div>
        </article>
      </div>
      {/* <Authenticated>
        <div className="text-center">
          <Button
            className="bg-paletteMain-yellow"
            onClick={() => {
              navigate("/waiting-room");
            }}
          >
            To Battle!
          </Button>
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="flex justify-center">
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>
        </div>
      </Unauthenticated> */}
    </div>
  );
}
