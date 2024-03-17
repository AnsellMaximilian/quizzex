import Header from "@/components/Header";
import React from "react";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="grow bg-[#8D2676] flex flex-col text-white justify-center items-center">
        <h1 className="text-5xl font-bold">Something Went Wrong!</h1>
      </div>
    </div>
  );
}
