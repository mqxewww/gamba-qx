"use client";

import CoinIcon from "@/components/icons/CoinIcon";
import { useSocket } from "@/lib/socket-context";

const Navbar: React.FC = () => {
  const { userData } = useSocket();

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-[#0D0F10] rounded-b-2xl">
      <div className="flex space-x-4"></div>

      <div className="flex items-center space-x-4">
        {userData ? (
          <>
            <p>{userData.name}</p>
            <div className="flex items-center text-[#FFE8A3]">
              <p>{userData.coins}</p>
              <div className="rounded-full h-8 w-8 flex items-center justify-center">
                <CoinIcon style={{ height: 20, width: 20 }} />
              </div>
            </div>
          </>
        ) : (
          <div className="px-4 rounded-2xl bg-[#1B1D23]">
            <p>Log in</p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
