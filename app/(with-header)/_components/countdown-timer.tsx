"use client";

import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";

interface CountdownTimerProps {
  targetTime: number;
  className?: string;
}

export function CountdownTimer({ targetTime, className }: CountdownTimerProps) {
  return (
    <FlipClockCountdown to={targetTime} renderOnServer className={className} />
  );
}
