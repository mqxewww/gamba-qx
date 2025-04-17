import { CrashGameStateEnum } from "@/domains/crash-games/enums/crash-game-state.enum";

export type CrashGameMinified = {
  uuid: string;
  created_at: string;
  state: CrashGameStateEnum;
};
