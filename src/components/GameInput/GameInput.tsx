import { useEffect, useState } from "react";
import { checkWord } from "../../services/wordService";
import "./GameInput.css";

const formatTime = (total: number): string => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default function GameInput() {
  const [value, setValue] = useState("");
  const [remaining, setRemaining] = useState(15);
  const [running, setRunning] = useState(false);

  const finished = remaining === 0;

  // Logica timer
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const handleCheck = async (newWord: string) => {
    if (finished) return;
    // Aca con newWord chequeamos si es valida y la guardamos si es asi sino tiro error
    const response = await checkWord(newWord);
    if (response.exists) {
      handleValidWord();
      handleReset();
    }
  };

  const handleValidWord = () => {
    // Aca iria la logica de sumar los puntos y agregar la palabra a las ya cargadas
    console.log("valida");
  };

  // para resetear si ingreso una palabra correcta
  const handleReset = () => {
    setValue("");
    setRemaining(15);
    setRunning(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !running) {
      setRunning(true);
    } else if (e.key === "Enter") {
      handleCheck(value);
    }
  };

  return (
    <div className="game_input">
      <input
        className="input_field"
        type="text"
        value={value}
        placeholder={"Escribi una palabra y toca enter para arrancar"}
        disabled={finished}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyPress}
        autoComplete="off"
      />

      <div>
        <span>{formatTime(remaining)}</span>
      </div>
    </div>
  );
}
