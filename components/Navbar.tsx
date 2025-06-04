"use client";

import CoinIcon from "@/components/icons/CoinIcon";
import { useSocket } from "@/lib/socket-context";

const Navbar: React.FC = () => {
  const { userData } = useSocket();

  return (
    <nav className="fixed top-0 w-full flex justify-end p-4 bg-background-300">
      <div className="flex items-center space-x-4">
        {userData ? (
          <>
            <p>{userData.name}</p>
            <div className="flex items-center">
              <p>{userData.coins}</p>
              <div className="rounded-full h-8 w-8 flex items-center justify-center">
                <CoinIcon style={{ height: 20, width: 20 }} />
              </div>
            </div>
          </>
        ) : (
          <div className="px-5 py-1 rounded-xl hover:cursor-pointer bg-background-100">
            <p>Log in</p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
