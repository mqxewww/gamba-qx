"use client";

import Navbar from "@/components/Navbar";
import CGCashedOutBetRow from "@/domains/crash-games/components/CGCashedOutBetRow";
import CGPlayerRow from "@/domains/crash-games/components/CGPlayerRow";
import { getBetColor } from "@/helpers/getBetColor";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [value, setValue] = useState(100);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      // if (startTimeRef.current === null) startTimeRef.current = timestamp;

      if (startTimeRef.current) {
        const currentTime = timestamp - startTimeRef.current;

        setValue(Math.floor(Math.exp(0.0578 * (currentTime / 1000)) * 100));

        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full min-h-screen flex pt-16">
        <div className="w-3/4 flex items-center justify-center m-4">
          <h1>
            La value du crash game est :
            <span className={`text-[${getBetColor(value)}]`}>{` x${(
              value / 100
            ).toFixed(2)}`}</span>
          </h1>
        </div>
        <div className="w-1/4 m-4 space-y-8">
          <div className="rounded-xl p-4 px-16 bg-[#1B1D23]">
            <p className="text-center pb-4 text-xl font-extrabold">
              BETS ENREGISTRÉS / EN COURS
            </p>
            <div className="flex flex-col items-center">
              <CGPlayerRow user_name="User 5" amount={231} />
              <CGPlayerRow user_name="User 2" amount={170} />
            </div>
          </div>
          <div className="rounded-xl p-4 px-16 bg-[#1B1D23]">
            <p className="text-center pb-4 text-xl font-extrabold">
              BETS VALIDÉS
            </p>
            <div className="flex flex-col items-center">
              <CGCashedOutBetRow
                user_name="User 4"
                amount={1279}
                cashedOutAt={531}
              />
              <CGCashedOutBetRow
                user_name="User 1"
                amount={306}
                cashedOutAt={218}
              />
              <CGCashedOutBetRow
                user_name="User 3"
                amount={291}
                cashedOutAt={120}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
