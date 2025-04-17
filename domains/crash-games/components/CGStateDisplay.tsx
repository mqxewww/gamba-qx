import { CrashGameStateEnum } from "@/domains/crash-games/enums/crash-game-state.enum";
import { getBetColor } from "@/helpers/getBetColor";

function PendingComponent({ remainingSeconds }: { remainingSeconds: number }) {
  return (
    <>
      <p className="text-4xl">Game will start in :</p>
      <p className="text-7xl">
        <span className="font-crash-value">
          {(remainingSeconds / 100).toFixed(2)}
        </span>
        s.
      </p>
    </>
  );
}

function ProgressComponent({ value }: { value: number }) {
  return (
    <p
      className="text-9xl font-crash-value"
      style={{ color: getBetColor(value) }}
    >
      {`x${(value / 100).toFixed(2)}`}
    </p>
  );
}

function FinishedComponent({ value }: { value: number }) {
  return (
    <>
      <p className="text-4xl" style={{ color: "#E73A38" }}>
        Game crashed at :
      </p>
      <p className="text-7xl" style={{ color: "#E73A38" }}>
        {`x${(value / 100).toFixed(2)}`}
      </p>
    </>
  );
}

interface CGStateDisplayProps {
  remainingTime: number;
  value: number;
  state: CrashGameStateEnum;
}

export default function CGStateDisplay({
  remainingTime,
  value,
  state,
}: CGStateDisplayProps) {
  switch (state) {
    case CrashGameStateEnum.PENDING:
      return <PendingComponent remainingSeconds={remainingTime} />;
    case CrashGameStateEnum.IN_PROGRESS:
      return <ProgressComponent value={value} />;
    case CrashGameStateEnum.FINISHED:
      return <FinishedComponent value={value} />;
  }
}
