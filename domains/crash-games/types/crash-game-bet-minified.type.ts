import { CrashGameBetStateEnum } from "@/domains/crash-games/enums/crash-game-bet-state.enum";

export type CrashGameBetMinified = {
  uuid: string;
  user_name: string;
  state: CrashGameBetStateEnum;
  amount: number;
  cashedOutAt: number | null;
};
