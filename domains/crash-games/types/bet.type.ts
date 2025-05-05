import { BetStateEnum } from "@/domains/crash-games/enums/bet-state.enum";

export type Bet = {
  uuid: string;
  user_name: string;
  state: BetStateEnum;
  amount: number;
  cashedOutAt: number | null;
};
