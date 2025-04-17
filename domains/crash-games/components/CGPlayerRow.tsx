import Coin from "@/components/icons/Coin";
import { CrashGameBetStateEnum } from "@/domains/crash-games/enums/crash-game-bet-state.enum";

export interface Props {
  user_name: string;
  state: CrashGameBetStateEnum;
  amount: number;
}

export default function CGPlayerRow({ user_name, state, amount }: Props) {
  return (
    <div
      className={`w-full flex flex-row ${
        state === CrashGameBetStateEnum.CRASHED ? "text-[#E73A38]" : ""
      }`}
    >
      <p className="w-1/3 text-left">{user_name}</p>
      <div className="w-2/3 flex flex-row justify-end space-x-4">
        <div className="flex items-center space-x-1">
          <p>{amount}</p>
          <Coin style={{ height: 20, width: 20 }} />
        </div>
      </div>
    </div>
  );
}
