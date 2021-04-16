import React, { Suspense, useEffect, useState, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { Canvas } from 'react-three-fiber'
import Draggable from './draggable'
import Tile from './components/tile'
import { TILES } from './constants';
import Grid from './components/grid';
import { useControls } from "leva"

import './styles.css'

const randomProperty = (obj) => {
  const keys = Object.keys(obj);
  return obj[keys[keys.length * Math.random() << 0]];
};

const Scene = () => {
  const [draggingPiece, setDraggingPiece] = useState();
  const [draggables, setDraggables] = useState();
  const DRAGGABLE_PLACES = [{ x: -8, y: 6 }, { x: -8, y: 3 }, { x: -8, y: 0 }, { x: -8, y: -3 }]
  const [lastGeneratedIndex, setLastGeneratedIndex] = useState(DRAGGABLE_PLACES.length);
  const { rotationX, rotationY } = useControls({ rotationX: {
    value: Math.PI / 4,
    min: - Math.PI,
    max: Math.PI,
    step: Math.PI / 16,
  }, rotationY:{
    value: Math.PI / 4,
    min: - Math.PI,
    max: Math.PI,
    step: Math.PI / 16,
  } })

  useEffect(() => {
    const updatedDraggables = {...draggables };
    DRAGGABLE_PLACES.forEach((draggable, index) => {
      const { x, y } = draggable;
      const randomTile = randomProperty(TILES);
      const { type, rotation } = randomTile;
      updatedDraggables[index] = {
        index, x, y, tileType: { type, rotation }
      };
    });
    setDraggables(updatedDraggables);
  }, []);

  const resetDraggable = (index) => {
    const updatedDraggables = { ...draggables };
    const { x, y } = DRAGGABLE_PLACES[index];
    const { type, rotation } = randomProperty(TILES);
    updatedDraggables[index] = { ...updatedDraggables[index], x, y, draggableIndex: lastGeneratedIndex + 1, tileType: { type, rotation } , rotation };
    setLastGeneratedIndex(lastGeneratedIndex + 1)
    setDraggables(updatedDraggables);
  };

  const gridSize = 5
  const tileScale = 1
  const rotation = [rotationX, rotationY, 0]
  const startX = useMemo(() => Math.floor(Math.random() * gridSize), []);
  return (
    <>
      <group position={[-gridSize, 0, 0]} rotation={rotation}>
        <Tile
          key={`initial-tile`}
          {...{ x: startX, y: -1, state: null, piece: null, color: 'yellow' }}
          draggingPiece={draggingPiece}
          setDraggingPiece={setDraggingPiece}
          tileScale={tileScale}
          resetDraggable={resetDraggable}
        />
        <Grid
          x={gridSize}
          y={gridSize}
          draggingPiece={draggingPiece}
          setDraggingPiece={setDraggingPiece}
          resetDraggable={resetDraggable}
          tileScale={tileScale}
        />
        <Tile
          key={`finish-tile`}
          {...{ x: startX, y: gridSize, state: null, piece: null, color: 'yellow' }}
          draggingPiece={draggingPiece}
          setDraggingPiece={setDraggingPiece}
          tileScale={tileScale}
          resetDraggable={resetDraggable}
        />
      </group>
      <ambientLight intensity={0.1} />
      <spotLight intensity={0.8} position={[300, 300, 400]} />
      <rectAreaLight intensity={0.8} attr={['white', 1, 1, 1]} />
      {draggables && Object.entries(draggables).map(([key, value]) =>
        <Draggable
          setDraggingPiece={setDraggingPiece}
          draggableIndex={value.draggableIndex}
          tileScale={tileScale}
          key={value.draggableIndex || value.index}
          index={key}
          x={value.x}
          y={value.y}
          tileType={value.tileType}
          defaultRotation={{ rotationX, rotationY }}
        />
      )}
    </>
  );
}

const App = () => {
  return (
    <div className="container">
      <Canvas camera={{ zoom: 10, position: [0, 0, 200] }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
ReactDOM.render(<App />, document.getElementById('root'))
