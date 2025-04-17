import { CrashGameBetStateEnum } from "@/domains/crash-games/enums/crash-game-bet-state.enum";
import { CrashGameStateEnum } from "@/domains/crash-games/enums/crash-game-state.enum";
import { CurrentCrashGame } from "@/domains/crash-games/types/current-crash-game.type";

export const staticCrashGameData: CurrentCrashGame = {
  currentCrashGame: {
    uuid: "2b905f7b-95ce-4115-af78-e90a1c5f5c78",
    created_at: "2025-04-17T14:15:31.000Z",
    state: CrashGameStateEnum.IN_PROGRESS,
  },
  bets: [
    {
      uuid: "261f8184-5dbd-4318-ab60-cdb10faf913b",
      user_name: "User 5",
      state: CrashGameBetStateEnum.PENDING,
      amount: 231,
      cashedOutAt: null,
    },
    {
      uuid: "fff2a5c3-66a8-4cc0-9fd1-63d8f2ceff19",
      user_name: "User 2",
      state: CrashGameBetStateEnum.PENDING,
      amount: 170,
      cashedOutAt: null,
    },
    {
      uuid: "a2b36cf2-2212-4972-8e78-703d263af7eb",
      user_name: "User 4",
      state: CrashGameBetStateEnum.CASHED_OUT,
      amount: 1279,
      cashedOutAt: 531,
    },
    {
      uuid: "e5468dbd-aadf-4ee4-bf91-4d8eb8e81a1d",
      user_name: "User 1",
      state: CrashGameBetStateEnum.CASHED_OUT,
      amount: 306,
      cashedOutAt: 218,
    },
    {
      uuid: "bde78b06-e570-440d-8249-febd02762c49",
      user_name: "User 3",
      state: CrashGameBetStateEnum.CASHED_OUT,
      amount: 291,
      cashedOutAt: 120,
    },
  ],
};
