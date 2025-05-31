import { BetStatus } from "@/domains/crash-games/enums/bet-status.enum";

export type Bet = {
  uuid: string;
  status: BetStatus;
  amount: number;
  cashedOutAt: number | null;
  username: string;
};
