"use client";

import CGCashedOutBetRow from "@/domains/crash-games/components/CGCashedOutBetRow";
import CGPlayerRow from "@/domains/crash-games/components/CGPlayerRow";
import CGStateDisplay from "@/domains/crash-games/components/CGStateDisplay";
import { defaultCrashGameData } from "@/domains/crash-games/data/default-crash-game.data";
import { BetStateEnum } from "@/domains/crash-games/enums/bet-state.enum";
import { CrashGameStateEnum } from "@/domains/crash-games/enums/crash-game-state.enum";
import { Bet } from "@/domains/crash-games/types/bet.type";
import { CrashGameAndBets } from "@/domains/crash-games/types/crash-game-and-bets.type";
import { CrashGame } from "@/domains/crash-games/types/crash-game.type";
import { useSocket } from "@/lib/socket-context";
import { useSocketEvent } from "@/lib/use-socket-event";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { crashGamesSocket } = useSocket();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [crashValue, setCrashValue] = useState<number>(100);

  const [crashGame, setCrashGame] = useState<CrashGame>(defaultCrashGameData);
  const [bets, setBets] = useState<Map<string, Bet>>(new Map());

  const [lastCrashTick, setLastCrashTick] = useState<number | undefined>();

  const animationRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  useEffect(() => {
    if (!crashGame || crashGame.state !== CrashGameStateEnum.IN_PROGRESS) {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);

        animationRef.current = null;
      }

      return;
    }

    const startTimestamp = new Date(crashGame.created_at).getTime() + 20000;

    const animate = () => {
      const now = Date.now();
      const elapsedTime = (now - startTimestamp) / 1000;

      if (elapsedTime >= 0) {
        const crashVal = Math.floor(Math.exp(0.0578 * elapsedTime) * 100);

        setCrashValue(crashVal);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [crashGame]);

  useEffect(() => {
    if (!crashGame || crashGame.state !== CrashGameStateEnum.PENDING) {
      if (countdownRef.current !== null) {
        cancelAnimationFrame(countdownRef.current);

        countdownRef.current = null;
        setCountdown(null);
      }
      return;
    }

    const startTimestamp = new Date(crashGame.created_at).getTime();
    const endTimestamp = startTimestamp + 20_000;

    const updateCountdown = () => {
      const now = Date.now();
      const remainingMs = endTimestamp - now;
      const remaining = Math.max(0, remainingMs / 1000);
      setCountdown(remaining);

      if (remaining > 0)
        countdownRef.current = requestAnimationFrame(updateCountdown);
    };

    countdownRef.current = requestAnimationFrame(updateCountdown);

    return () => {
      if (countdownRef.current !== null) {
        cancelAnimationFrame(countdownRef.current);

        countdownRef.current = null;
      }
    };
  }, [crashGame]);

  useSocketEvent<CrashGameAndBets>(
    crashGamesSocket,
    "server/game_data",
    (data) => {
      setCrashGame(data.crashGame);

      const map: Map<string, Bet> = new Map();

      for (const bet of data.bets) map.set(bet.uuid, bet);

      setBets(map);
    }
  );

  useSocketEvent<boolean>(crashGamesSocket, "server/game_started", (data) => {
    if (!data || crashGame.state !== CrashGameStateEnum.PENDING) return;

    const updatedCrashGame = {
      ...crashGame,
      state: CrashGameStateEnum.IN_PROGRESS,
    };

    setCrashGame(updatedCrashGame);
  });

  useSocketEvent<number>(crashGamesSocket, "server/game_ended", (data) => {
    if (crashGame.state !== CrashGameStateEnum.IN_PROGRESS) return;

    const updatedCrashGame = {
      ...crashGame,
      state: CrashGameStateEnum.FINISHED,
    };

    setCrashGame(updatedCrashGame);

    setLastCrashTick(data);
  });

  useSocketEvent<Bet>(crashGamesSocket, "server/game_bet_update", (data) => {
    bets.set(data.uuid, data);
  });

  return (
    <main className="w-full min-h-screen flex pt-16">
      <div className="w-3/4 flex flex-col items-center justify-around mx-16 my-8">
        <div className="w-full h-96 relative mb-8">
          <div className="absolute inset-0 z-0 bg-[#1B1D23]">
            {/** Will add background graph here, need to know how I do it. */}
          </div>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            {crashGame && (
              <CGStateDisplay
                countdown={countdown}
                value={crashValue}
                state={crashGame.state}
                crashTick={lastCrashTick}
              />
            )}
          </div>
        </div>

        <div className="flex flex-row space-x-8 p-4 rounded-lg bg-[#1B1D23]"></div>
      </div>
      <div className="w-1/4 mx-16 my-8 space-y-8">
        <div className="rounded-xl p-4 px-16 bg-[#1B1D23]">
          <p className="text-center pb-4 text-xl font-extrabold">
            {crashGame.state === CrashGameStateEnum.PENDING
              ? "BETS EN ATTENTE"
              : "BETS EN COURS"}
          </p>
          <div className="flex flex-col items-center">
            {[...bets.values()]
              .filter((bet) => bet.state !== BetStateEnum.CASHED_OUT)
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
            {[...bets.values()]
              .filter((bet) => bet.state === BetStateEnum.CASHED_OUT)
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
  );
}
