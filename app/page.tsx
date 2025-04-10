"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

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
      <main className="pt-16 p-6">
        <div className="m-6">
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
      </main>
    </div>
  );
}
