import CoinIcon from "@/components/icons/CoinIcon";
import { BetStateEnum } from "@/domains/crash-games/enums/bet-state.enum";

export interface Props {
  user_name: string;
  state: BetStateEnum;
  amount: number;
}

export default function CGPlayerRow({ user_name, state, amount }: Props) {
  return (
    <div
      className={`w-full flex flex-row ${
        state === BetStateEnum.CRASHED ? "text-[#E73A38]" : ""
      }`}
    >
      <p className="w-1/3 text-left">{user_name}</p>
      <div className="w-2/3 flex flex-row justify-end space-x-4">
        <div className="flex items-center space-x-1">
          <p>{amount}</p>
          <CoinIcon style={{ height: 20, width: 20 }} />
        </div>
      </div>
    </div>
  );
}
