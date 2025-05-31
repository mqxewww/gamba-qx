import { Bet } from "@/domains/crash-games/types/bet.type";
import { CrashGame } from "@/domains/crash-games/types/crash-game.type";

export type CrashGameAndBets = {
  crashGame: CrashGame | null;
  bets: Bet[];
};
