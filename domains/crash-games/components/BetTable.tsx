import BetTableItem from "@/domains/crash-games/components/BetTableItem";
import { Bet } from "@/domains/crash-games/types/bet.type";

interface Props {
  title: string;
  bets: Bet[];
}

const BetTable: React.FC<Props> = ({ title, bets }) => {
  return (
    <div className="rounded-xl p-4 px-16 bg-[#1B1D23]">
      <p className="text-center pb-4 text-xl font-extrabold">{title}</p>
      <div className="flex flex-col items-center">
        {bets.map((bet, i) => (
          <BetTableItem key={i} bet={bet} />
        ))}
      </div>
    </div>
  );
};

export default BetTable;
