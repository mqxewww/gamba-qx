"use client";

import BetTable from "@/domains/crash-games/components/BetTable";
import CrashGameDisplay from "@/domains/crash-games/components/CrashGameDisplay";
import { BetStatus } from "@/domains/crash-games/enums/bet-status.enum";
import { CrashGameState } from "@/domains/crash-games/enums/crash-game-state.enum";
import { Bet } from "@/domains/crash-games/types/bet.type";
import { CrashGameAndBets } from "@/domains/crash-games/types/crash-game-and-bets.type";
import { CrashGame } from "@/domains/crash-games/types/crash-game.type";
import { useSocket } from "@/lib/socket-context";
import { useSocketEvent } from "@/lib/use-socket-event";

import { useState } from "react";

const Home: React.FC = () => {
  const { crashGamesSocket } = useSocket();

  const [crashGame, setCrashGame] = useState<CrashGame | null>(null);
  const [bets, setBets] = useState<Map<string, Bet>>(new Map());

  const [crashedAt, setCrashedAt] = useState<number | null>(null);

  useSocketEvent<CrashGameAndBets>(
    crashGamesSocket,
    "server/game_data",
    (data) => {
      const map: Map<string, Bet> = new Map();

      for (const bet of data.bets) map.set(bet.uuid, bet);

      setCrashGame(data.crashGame);
      setBets(map);
    }
  );

  useSocketEvent<boolean>(crashGamesSocket, "server/game_started", (data) => {
    if (crashGame) {
      if (!data || crashGame.state !== CrashGameState.PENDING) return;

      const updatedCrashGame = {
        ...crashGame,
        state: CrashGameState.IN_PROGRESS,
      };

      setCrashGame(updatedCrashGame);
    }
  });

  useSocketEvent<Bet>(crashGamesSocket, "server/game_bet_update", (data) => {
    bets.set(data.uuid, data);
  });

  useSocketEvent<number>(crashGamesSocket, "server/game_ended", (data) => {
    if (crashGame) {
      if (crashGame.state !== CrashGameState.IN_PROGRESS) return;

      const updatedCrashGame: CrashGame = {
        ...crashGame,
        state: CrashGameState.FINISHED,
      };

      setCrashGame(updatedCrashGame);
      setCrashedAt(data);
    }
  });

  return (
    <main className="w-full min-h-screen flex pt-16">
      <div className="w-3/4 flex flex-col items-center justify-around mx-16 my-8">
        <CrashGameDisplay crashGame={crashGame} crashedAt={crashedAt} />

        <div className="flex flex-row space-x-8 p-4 rounded-lg bg-[#1B1D23]"></div>
      </div>
      <div className="w-1/4 mx-16 my-8 space-y-8">
        <BetTable
          title={`BETS EN ${
            crashGame?.state === CrashGameState.PENDING ? "ATTENTE" : "COURS"
          }`}
          bets={[...bets.values()].filter(
            (bet) => bet.status !== BetStatus.CASHED_OUT
          )}
        />
        {crashGame && crashGame.state !== CrashGameState.PENDING && (
          <BetTable
            title="BETS VALIDÉS"
            bets={[...bets.values()].filter(
              (bet) => bet.status === BetStatus.CASHED_OUT
            )}
          />
        )}
      </div>
    </main>
  );
};

export default Home;
