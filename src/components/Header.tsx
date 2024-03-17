import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import logo from "@/assets/quizzex.svg";

import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="p-4">
      <nav className="flex items-center gap-8">
        <Link className="block" to="/">
          <img src={logo} className="w-48" />
        </Link>
        {/* <ul className="flex gap-3 items-center">
          <li>
            <Link to="/list-battle/3434">Battle</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/waiting-room">Waiting Room</Link>
          </li>
        </ul> */}

        <div className="ml-auto">
          <Authenticated>
            <UserButton />
          </Authenticated>
          <Unauthenticated>
            <SignInButton mode="modal">
              <Button className="ml-auto">Sign in</Button>
            </SignInButton>
          </Unauthenticated>
        </div>
      </nav>
    </header>
  );
}
