import Finished from "@/domains/crash-games/components/state/Finished";
import InProgress from "@/domains/crash-games/components/state/InProgress";
import Pending from "@/domains/crash-games/components/state/Pending";
import { CrashGameState } from "@/domains/crash-games/enums/crash-game-state.enum";
import { CrashGame } from "@/domains/crash-games/types/crash-game.type";

interface Props {
  crashGame: CrashGame | null;
  crashedAt: number | null;
}

const CrashGameDisplay: React.FC<Props> = ({ crashGame, crashedAt }) => {
  const content = () => {
    switch (crashGame?.state) {
      case CrashGameState.PENDING:
        return <Pending crashGame={crashGame} />;

      case CrashGameState.IN_PROGRESS:
        return <InProgress crashGame={crashGame} />;

      case CrashGameState.FINISHED:
        return crashedAt ? <Finished crashedAt={crashedAt} /> : null;

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-96 relative mb-8">
      <div className="absolute inset-0 z-0 bg-background-100">
        {/** Will add background graph here, need to know how I do it. */}
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        {content()}
      </div>
    </div>
  );
};

export default CrashGameDisplay;
