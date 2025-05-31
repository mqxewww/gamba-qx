import { CrashGameState } from "@/domains/crash-games/enums/crash-game-state.enum";

export type CrashGame = {
  uuid: string;
  created_at: string;
  state: CrashGameState;
};
