import { useEffect, useRef } from "react";
import "./App.css";
import { Game } from "./Game";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    new Game(canvas);
  }, []);
  return (
    <div id="container" className="border-8 border-purple-800">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
