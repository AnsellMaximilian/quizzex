import { Outlet } from "react-router-dom";
import Header from "../Header";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="grow bg-[#8D2676] flex flex-col text-white">
        <Outlet />
      </div>
    </div>
  );
}
