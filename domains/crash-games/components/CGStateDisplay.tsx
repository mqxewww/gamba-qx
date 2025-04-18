import { CrashGameStateEnum } from "@/domains/crash-games/enums/crash-game-state.enum";
import { getBetColor } from "@/helpers/getBetColor";

function PendingComponent({ countdown }: { countdown: number | null }) {
  return (
    <>
      {countdown && (
        <>
          <p className="text-4xl">Game will start in :</p>
          <p className="text-7xl">
            <span className="font-crash-value">{countdown.toFixed(2)}</span>s
          </p>
        </>
      )}
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

function FinishedComponent({ crashTick }: { crashTick?: number }) {
  return (
    <>
      {crashTick && (
        <>
          <p className="text-4xl" style={{ color: "#E73A38" }}>
            Game crashed at :
          </p>
          <p className="text-7xl" style={{ color: "#E73A38" }}>
            {`x${(crashTick / 100).toFixed(2)}`}
          </p>
        </>
      )}
    </>
  );
}

interface CGStateDisplayProps {
  state: CrashGameStateEnum;
  value: number;
  countdown: number | null;
  crashTick?: number;
}

export default function CGStateDisplay({
  countdown,
  value,
  state,
  crashTick,
}: CGStateDisplayProps) {
  switch (state) {
    case CrashGameStateEnum.PENDING:
      return <PendingComponent countdown={countdown} />;
    case CrashGameStateEnum.IN_PROGRESS:
      return <ProgressComponent value={value} />;
    case CrashGameStateEnum.FINISHED:
      return <FinishedComponent crashTick={crashTick} />;
  }
}
