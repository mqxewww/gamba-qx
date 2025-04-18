import { CrashGameBetMinified } from "@/domains/crash-games/types/crash-game-bet-minified.type";
import { CrashGameMinified } from "@/domains/crash-games/types/crash-game-minified.type";

export type CurrentCrashGame = {
  currentCrashGame: CrashGameMinified;
  bets: CrashGameBetMinified[];
  crashTick?: number;
};
