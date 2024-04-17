import { Link } from "react-router-dom";
import icon from "@/assets/quizzex-icon.svg";
import listBattleIcon from "@/assets/list-battle.svg";
import triviaIcon from "@/assets/trivia.svg";
import unravelIcon from "@/assets/unravel.svg";

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
        <Link
          to={"/waiting-room"}
          className="bg-paletteMain-red rounded-lg border-4 border-white p-4 hover:bg-paletteMain-red/90 flex flex-col"
        >
          <div className="p-4 flex justify-center rounded-lg grow">
            <img src={listBattleIcon} className="w-32" />
          </div>
          <hr />
          <div className="mt-2">
            <div className="text-xl font-bold">List Battles</div>
            <p className="leading-5 tracking-tight">
              Compete to submit the most items belonging in a category before
              the time runs out!
            </p>
          </div>
        </Link>
        <Link
          to="/trivia-battle/waiting-room"
          className="bg-paletteMain-yellow rounded-lg border-4 border-white p-4 hover:bg-paletteMain-yellow/90 flex flex-col"
        >
          <div className="p-4 flex justify-center rounded-lg grow">
            <img src={triviaIcon} className="w-32" />
          </div>
          <hr />
          <div className="mt-2">
            <div className="text-xl font-bold">Trivia Battles</div>
            <p className="leading-5 tracking-tight">
              Answer a series of fun trivia questions and get more right than
              your opponent!
            </p>
          </div>
        </Link>
        <Link
          to="/unravel-battle/waiting-room"
          className="bg-paletteMain-green rounded-lg border-4 border-white p-4 hover:bg-paletteMain-green/90 flex flex-col"
        >
          <div className="p-4 flex justify-center rounded-lg grow">
            <img src={unravelIcon} className="w-32" />
          </div>
          <hr />
          <div className="mt-2">
            <div className="text-xl font-bold">Unravel Battle</div>
            <p className="leading-5 tracking-tight">
              Guess the randomly generated word letter-by-letter or guess the
              whole word!
            </p>
          </div>
        </Link>
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
