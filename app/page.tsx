"use client";

import Navbar from "@/components/Navbar";
import { Coin } from "@/components/icons/Coin";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const bet = 70;
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

  const getValueColor = () => {
    switch (true) {
      case value < 200:
        return "text-[#F59451]";
      case value < 300:
        return "text-[#A1E4F9]";
      case value < 500:
        return "text-[#DECCFB]";
      default:
        return "text-[#FFE8A3]";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex flex-col items-center pt-16 p-6 m-6">
        <div className="py-32">
          <h1>
            La value du crash game est :
            <span className={getValueColor()}>{` x${(value / 100).toFixed(
              2
            )}`}</span>
          </h1>
          <h2>
            Retrait en cours :
            <span className={getValueColor()}>{` ${(
              bet *
              (value / 100)
            ).toFixed(0)}`}</span>
          </h2>
        </div>
        <div className="flex flex-row space-x-96">
          <div className="border rounded-xl p-4">
            <p className="text-center">Bets en cours</p>
            <div className="flex flex-row space-x-4 items-center justify-center">
              <p>User</p>
              <div className="flex items-center">
                <p className="">200</p>
                <Coin style={{ height: 20, width: 20 }} />
              </div>
            </div>
            <div className="flex flex-row space-x-4 items-center justify-center">
              <p>User</p>
              <div className="flex items-center">
                <p className="">300</p>
                <Coin style={{ height: 20, width: 20 }} />
              </div>
            </div>
          </div>
          <div className="border rounded-xl p-4">
            <p className="text-center">Bets validés</p>
            <div className="flex flex-row space-x-4 items-center justify-center">
              <p>User</p>
              <div className="flex items-center text-[#FFE8A3]">
                <p className="">600</p>
                <Coin color="#FFE8A3" style={{ height: 20, width: 20 }} />
              </div>
              <p className="text-[#FFE8A3]">x6.00</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
