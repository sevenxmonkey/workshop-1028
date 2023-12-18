import React, { useRef, useState } from 'react';
import './App.css';
import * as Tone from 'tone';
import { setUpPinano } from './utils/music';

export interface Location {
  x: number,
  y: number,
}

function App() {
  const [ballLocation, setBallLocaiton] = useState<Location>({ x: 300, y: 300 });
  const [isBallDragging, setIsBallDragging] = useState<boolean>(false);
  const playGroundRef = useRef<HTMLDivElement | null>(null);
  const ballLocationRef = useRef<Location>(ballLocation);

  return (
    <div className="App"
      onMouseUp={() => setIsBallDragging(false)}
    >
      <button
        onClick={() => {
          setUpPinano(ballLocationRef);
          Tone.Transport.start();
        }}
      >Start</button>
      <div className='playground'
        ref={playGroundRef}
        onMouseMove={(e: React.MouseEvent) => {
          if (playGroundRef.current && isBallDragging) {
            const { x, y } = playGroundRef.current.getBoundingClientRect();
            setBallLocaiton({ x: e.clientX - x, y: e.clientY - y });
            ballLocationRef.current = { x: e.clientX - x, y: e.clientY - y };
          }
        }}
      >
        <div
          className='ball'
          onMouseDown={() => setIsBallDragging(true)}
          style={{ left: `${ballLocation.x - 25}px`, top: `${ballLocation.y - 25}px` }}
        ></div>
      </div>
    </div>
  );
}

export default App;
