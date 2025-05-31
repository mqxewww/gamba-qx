import { useEffect, useRef, useState } from "react";

import { CrashGameState } from "@/domains/crash-games/enums/crash-game-state.enum";
import { CrashGame } from "@/domains/crash-games/types/crash-game.type";

interface Props {
  crashGame: CrashGame;
}

const Pending: React.FC<Props> = ({ crashGame }) => {
  const [countdown, setCountdown] = useState<number>(0);
  const countdownRef = useRef<number | null>(null);

  useEffect(() => {
    if (crashGame.state !== CrashGameState.PENDING) {
      if (countdownRef.current !== null) {
        cancelAnimationFrame(countdownRef.current);

        countdownRef.current = null;
        setCountdown(0);
      }

      return;
    }

    const startTimestamp = new Date(crashGame.created_at).getTime();
    const endTimestamp = startTimestamp + 20_000;

    const updateCountdown = () => {
      const now = Date.now();
      const remainingMs = endTimestamp - now;
      const remaining = Math.max(0, remainingMs / 1_000);
      setCountdown(remaining);

      if (remaining > 0)
        countdownRef.current = requestAnimationFrame(updateCountdown);
    };

    countdownRef.current = requestAnimationFrame(updateCountdown);

    return () => {
      if (countdownRef.current !== null) {
        cancelAnimationFrame(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [crashGame]);

  return (
    <>
      <p className="text-4xl">Game will start in :</p>
      <p className="text-7xl">
        <span className="font-crash-value">{countdown.toFixed(2)}</span>s
      </p>
    </>
  );
};

export default Pending;
