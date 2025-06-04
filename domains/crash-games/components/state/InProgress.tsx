import { useEffect, useRef, useState } from "react";

import { CrashGameState } from "@/domains/crash-games/enums/crash-game-state.enum";
import { CrashGame } from "@/domains/crash-games/types/crash-game.type";
import { getCrashColor } from "@/helpers/getCrashColor";

interface Props {
  crashGame: CrashGame;
}

const InProgress: React.FC<Props> = ({ crashGame }) => {
  const [crashValue, setCrashValue] = useState<number>(100);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (crashGame.state !== CrashGameState.IN_PROGRESS) {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);

        animationRef.current = null;
      }

      return;
    }

    const startTimestamp = new Date(crashGame.created_at).getTime() + 20_000;

    const animate = () => {
      const now = Date.now();
      const elapsedTime = (now - startTimestamp) / 1_000;

      if (elapsedTime >= 0) {
        const crashVal = Math.floor(Math.exp(0.0578 * elapsedTime) * 100);

        setCrashValue(crashVal);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [crashGame]);

  return (
    <p
      className="text-9xl font-mono transition-colors duration-500"
      style={{ color: getCrashColor(crashValue) }}
    >
      {`x${(crashValue / 100).toFixed(2)}`}
    </p>
  );
};

export default InProgress;
