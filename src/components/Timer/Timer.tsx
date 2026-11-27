import { useEffect, useState } from "react";
import "./Timer.css";

interface TimerProps {
  duration: number;
  running: boolean;
  resetKey: number;
  onFinish: () => void;
}

const formatTime = (total: number): string => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default function Timer({
  duration,
  running,
  resetKey,
  onFinish,
}: TimerProps) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    setRemaining(duration);
  }, [resetKey, duration]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, resetKey]);

  useEffect(() => {
    if (running && remaining === 0) onFinish();
  }, [remaining, running, onFinish]);

  return (
    <div className="container">
      <span className="timer">{formatTime(remaining)}</span>
    </div>
  );
}
