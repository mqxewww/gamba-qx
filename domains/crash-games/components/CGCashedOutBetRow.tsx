import Coin from "@/components/icons/Coin";
import { getBetColor } from "@/helpers/getBetColor";

export interface Props {
  user_name: string;
  amount: number;
  cashedOutAt: number;
}

export default function CGCashedOutBetRow({
  user_name,
  amount,
  cashedOutAt,
}: Props) {
  const color = getBetColor(cashedOutAt);

  return (
    <div className="w-full flex flex-row">
      <p className="w-1/3 text-left">{user_name}</p>
      <div
        className={`w-2/3 flex flex-row justify-end space-x-4 text-[${color}]`}
      >
        <div className="flex items-center space-x-1">
          <p>{amount}</p>
          <Coin style={{ height: 20, width: 20 }} />
        </div>
        <p>x{(cashedOutAt / 100).toFixed(2)}</p>
      </div>
    </div>
  );
}
