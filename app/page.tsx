"use client";

import Navbar from "@/components/Navbar";
import CGCashedOutBetRow from "@/domains/crash-games/components/CGCashedOutBetRow";
import CGPlayerRow from "@/domains/crash-games/components/CGPlayerRow";
import CGStateDisplay from "@/domains/crash-games/components/CGStateDisplay";
import { staticCrashGameData } from "@/domains/crash-games/data/static-crash-game.data";
import { CrashGameBetStateEnum } from "@/domains/crash-games/enums/crash-game-bet-state.enum";
import { CrashGameBetMinified } from "@/domains/crash-games/types/crash-game-bet-minified.type";
import { CrashGameMinified } from "@/domains/crash-games/types/crash-game-minified.type";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [value, setValue] = useState(100);

  const [currentCrashGame] = useState<CrashGameMinified>(
    staticCrashGameData.currentCrashGame
  );
  const [bets] = useState<CrashGameBetMinified[]>(staticCrashGameData.bets);

  const crashValueRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      // if (startTimeRef.current === null) startTimeRef.current = timestamp;

      if (startTimeRef.current) {
        const elapsedTime = timestamp - startTimeRef.current;

        setValue(Math.floor(Math.exp(0.0578 * (elapsedTime / 1000)) * 100));
      }

      crashValueRef.current = requestAnimationFrame(animate);
    };

    crashValueRef.current = requestAnimationFrame(animate);

    return () => {
      if (crashValueRef.current !== null)
        cancelAnimationFrame(crashValueRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full min-h-screen flex pt-16">
        <div className="w-3/4 flex flex-col items-center justify-around m-4">
          <div className="w-full h-96 relative mb-8">
            <div className="absolute inset-0 z-0">
              {/** Will add background graph here, need to know how I do it. */}
            </div>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
              <CGStateDisplay
                remainingTime={200}
                value={value}
                state={currentCrashGame.state}
              />
            </div>
          </div>

          <div className="flex flex-row space-x-8 w-full p-4 rounded-lg"></div>
        </div>
        <div className="w-1/4 m-4 space-y-8">
          <div className="rounded-xl p-4 px-16 bg-[#1B1D23]">
            <p className="text-center pb-4 text-xl font-extrabold">
              BETS ENREGISTRÉS / EN COURS
            </p>
            <div className="flex flex-col items-center">
              {bets
                .filter((bet) => bet.state !== CrashGameBetStateEnum.CASHED_OUT)
                .map((bet) => (
                  <CGPlayerRow
                    key={bet.uuid}
                    user_name={bet.user_name}
                    state={bet.state}
                    amount={bet.amount}
                  />
                ))}
            </div>
          </div>
          <div className="rounded-xl p-4 px-16 bg-[#1B1D23]">
            <p className="text-center pb-4 text-xl font-extrabold">
              BETS VALIDÉS
            </p>
            <div className="flex flex-col items-center">
              {bets
                .filter((bet) => bet.state === CrashGameBetStateEnum.CASHED_OUT)
                .map((bet) => (
                  <CGCashedOutBetRow
                    key={bet.uuid}
                    user_name={bet.user_name}
                    amount={bet.amount}
                    cashedOutAt={bet.cashedOutAt}
                  />
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
