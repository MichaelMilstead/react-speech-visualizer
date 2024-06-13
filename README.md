# React Speech Visualizer

A React component that visualizes speech (or any audio) using a grid of dots that change color based on the audio's frequency data.

![Demo gif](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExazVraXkwZzNwbXNpYnV0YzVjc2cyOTl3bnRxOTFnMHpzcWw5NjNxcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/B6RgVP6z1VdFiQF2ef/giphy.gif)

## Installation

```shell
npm i react-speech-visualizer
```

## Usage

Import and use the SpeechVisualizer component, passing in the audio file path and optional props.

```typescript
import SpeechVisualizer from "react-speech-visualizer";
import "./App.css";

function App() {
  const [paused, setPaused] = useState(true);

  const togglePlayback = () => {
    setPaused((prevPaused) => !prevPaused);
  };

  return (
    <div>
      <SpeechVisualizer audioPath="/path/to/audio/file.mp3" paused={paused} />
      <button onClick={togglePlayback}>{paused ? "Play" : "Pause"}</button>
    </div>
  );
}

export default App;
```

## Props

- `audioPath` (string) **required**: The path to the audio file to be visualized.
- `dotSize` (number): The size of each dot in the grid. Default is 2px width and height.
- `gridSideLength` (number): The number of dots along one side of the grid, where the grid is a square. Default is 25.
- `paused` (boolean): Whether the audio is paused. An initial value of 'false' will act like 'autoplay'. Default is false.

## Issues and Feature Requests

To report a problem or make a feature request, add a GitHub 'issue' [here.](https://github.com/MichaelMilstead/react-speech-visualizer/issues/new)
