import CoinIcon from "@/components/icons/CoinIcon";
import { BetStatus } from "@/domains/crash-games/enums/bet-status.enum";
import { Bet } from "@/domains/crash-games/types/bet.type";

interface Props {
  bet: Bet;
}

const BetTableItem: React.FC<Props> = ({ bet }) => {
  return (
    <div
      className={`w-full flex flex-row ${
        bet.status === BetStatus.CRASHED ? "text-[#E73A38]" : ""
      }`}
    >
      <p className="w-1/3 text-left">{bet.username}</p>
      <div className="w-2/3 flex flex-row justify-end space-x-4">
        <div className="flex items-center space-x-1">
          <p>{bet.amount}</p>
          <CoinIcon style={{ height: 20, width: 20 }} />
        </div>

        {bet.cashedOutAt && <p>x{(bet.cashedOutAt / 100).toFixed(2)}</p>}
      </div>
    </div>
  );
};

export default BetTableItem;
