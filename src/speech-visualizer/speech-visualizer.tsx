import React, { useEffect, useRef, useState } from "react";

interface SpeechVisualizerProps {
  /** The path to the audio file to be visualized */
  audioPath: string;

  /** The size of each dot in the grid. Default is 2px */
  dotSize?: number;

  /** The number of dots along one side of the grid. Default is 25 */
  gridSideLength?: number;

  /** Whether the audio is paused. Default is false */
  paused?: boolean;
}

export default function SpeechVisualizer({
  audioPath,
  dotSize = 2,
  gridSideLength = 25,
  paused = false,
}: SpeechVisualizerProps) {
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const CELL_SIZE = dotSize;
  const GRID_SIZE = gridSideLength;

  useEffect(() => {
    if (audioRef.current) {
      const audioContext = new window.AudioContext();
      const source = audioContext.createMediaElementSource(audioRef.current);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const updateVisualization = () => {
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          setFrequencyData(new Uint8Array(dataArrayRef.current));
          requestAnimationFrame(updateVisualization);
        }
      };
      updateVisualization();
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (paused) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [paused]);

  const getDotIndex = (row: number, col: number) => {
    const center = Math.floor((GRID_SIZE - 1) / 2);
    const distance = Math.sqrt((row - center) ** 2 + (col - center) ** 2);
    const maxDistance = Math.sqrt(2 * center ** 2);
    const normalizedDistance =
      (distance / maxDistance) * (frequencyData ? frequencyData.length - 1 : 0);
    return Math.round(normalizedDistance);
  };

  return (
    <div>
      <audio
        style={{ display: "none" }}
        ref={audioRef}
        src={audioPath}
        autoPlay={!paused}
        controls
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gap: "5px",
          marginTop: "20px",
        }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => {
            const index = getDotIndex(row, col);
            const value = frequencyData ? frequencyData[index] : 0;
            return (
              <div
                key={`${row}-${col}`}
                style={{
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`,
                  borderRadius: "50%",
                  backgroundColor: `rgb( 0, 0, ${value * 3})`,
                }}
              ></div>
            );
          })
        )}
      </div>
    </div>
  );
}
