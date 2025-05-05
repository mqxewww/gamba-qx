import CoinIcon from "@/components/icons/CoinIcon";
import { getBetColor } from "@/helpers/getBetColor";

export interface Props {
  user_name: string;
  amount: number;
  cashedOutAt: number | null;
}

export default function CGCashedOutBetRow({
  user_name,
  amount,
  cashedOutAt,
}: Props) {
  return (
    <>
      {cashedOutAt && (
        <div className="w-full flex flex-row">
          <p className="w-1/3 text-left">{user_name}</p>
          <div
            className={`w-2/3 flex flex-row justify-end space-x-4`}
            style={{ color: getBetColor(cashedOutAt) }}
          >
            <div className="flex items-center space-x-1">
              <p>{amount}</p>
              <CoinIcon style={{ height: 20, width: 20 }} />
            </div>
            <p>x{(cashedOutAt / 100).toFixed(2)}</p>
          </div>
        </div>
      )}
    </>
  );
}
