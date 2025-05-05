import { CrashGameStateEnum } from "@/domains/crash-games/enums/crash-game-state.enum";
import { CrashGame } from "@/domains/crash-games/types/crash-game.type";

export const defaultCrashGameData: CrashGame = {
  uuid: "2b905f7b-95ce-4115-af78-e90a1c5f5c78",
  created_at: "2025-01-01T00:00:00.000Z",
  state: CrashGameStateEnum.PENDING,
};
