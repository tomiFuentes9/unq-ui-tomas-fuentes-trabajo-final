import { useCallback, useState } from "react";
import { checkWord } from "../../services/wordService";
import Timer from "../Timer/Timer.tsx";
import "./GameInput.css";

export default function GameInput() {
  const [value, setValue] = useState("");
  const [lastWord, setLastWord] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");

  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleFinish = useCallback(() => {
    setRunning(false);
    setFinished(true);
  }, []);

  // para resetear si ingreso una palabra correcta
  const handleReset = () => {
    setValue("");
    setResetKey((prev) => prev + 1);
    setRunning(true);
  };

  const handleValidWord = (word: string) => {
    setScore((prev) => prev + word.length);
    setWords((prev) => [...prev, word]);
    setLastWord(word);
    handleReset();
  };

  const startsWithLastLetter = (word: string) => {
    if (!lastWord) return true;
    return word[0] === lastWord[lastWord.length - 1];
  };

  const alredyUsed = (word: string) => {
    return words.find((w) => w === word);
  };

  const handleCheck = async (word: string) => {
    if (finished) return;

    // para no tener problemas con acentos
    const newWord = word.trim().toLowerCase();
    if (!newWord) return;

    if (!startsWithLastLetter(newWord)) {
      setError(
        `La palabra no respeta la regla de encadenamiento. Tiene que empezar con "${lastWord[lastWord.length - 1]}"`,
      );
      return;
    }

    if (alredyUsed(newWord)) {
      setError(`La palabra ya fue utilizada"`);
      return;
    }

    const response = await checkWord(newWord);

    if (response.exists) {
      setError("");
      handleValidWord(newWord);
    } else {
      setError("La palabra no existe");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCheck(value);
  };

  return (
    <div className="game_input">
      <div className="pointsContainer">
        <span className="points">Puntos: {score}</span>
      </div>

      {error && <p className="input_error">{error}</p>}

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

      <Timer
        duration={15}
        running={running}
        resetKey={resetKey}
        onFinish={handleFinish}
      />
    </div>
  );
}
