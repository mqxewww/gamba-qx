"use client";

import LoginModal from "@/components/LoginModal";
import { useSocket } from "@/lib/socket-context";
import { useState } from "react";
import CoinIcon from "./icons/CoinIcon";

const Navbar: React.FC = () => {
  const { userData } = useSocket();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <nav className="fixed top-0 w-full flex justify-end p-4 bg-background-300">
      <div className="flex items-center space-x-4">
        {userData ? (
          <div className="flex flex-row items-center gap-4 pl-2 rounded-xl border border-white/10 bg-background-100 hover:cursor-pointer hover:brightness-125 transition">
            <div className="flex gap-1 items-center text-crash-extreme">
              <CoinIcon style={{ height: 20, width: 20 }} />
              <p className="pb-0.5">{userData.coins}</p>
            </div>
            <p className="pb-0.5 pr-4">{userData.name}</p>
          </div>
        ) : (
          <div
            onClick={() => setIsOpen(true)}
            className="px-5 rounded-xl border border-white/10 bg-background-100 hover:cursor-pointer hover:brightness-125 transition"
          >
            <p>Log in</p>
          </div>
        )}
      </div>
      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
};

export default Navbar;
