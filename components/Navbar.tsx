"use client";

import Link from "next/link";
import { useState } from "react";

import { Coin } from "@/components/icons/Coin";

export default function Navbar() {
  const [coins] = useState<number>(200);

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-[#0D0F10] rounded-b-2xl">
      <div className="flex space-x-4">
        <Link href="/">Crash Game</Link>
        <Link href="/auctions">Auctions</Link>
      </div>

      <div className="flex items-center space-x-4">
        <p>Maxence</p>
        <div className="flex items-center text-[#FFE8A3]">
          <p>{coins}</p>
          <div className="rounded-full h-8 w-8 flex items-center justify-center">
            <Coin style={{ height: 20, width: 20 }} />
          </div>
        </div>
      </div>
    </nav>
  );
}
