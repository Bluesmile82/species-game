import React, { Suspense, useEffect, useState, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { Canvas } from 'react-three-fiber'
import Draggable from './draggable'
import Tile from './components/tile'
import { TILES } from './constants';
import Grid from './components/grid';
import { useControls } from "leva"

import './styles.css'

const randomFromArray = (array) => array[Math.floor(Math.random() * array.length)];

const Scene = () => {
  const [draggingPiece, setDraggingPiece] = useState();
  const [finishRoad, setFinishRoad] = useState();
  const [fittedPieces, setFittedPieces] = useState([]);
  const [draggables, setDraggables] = useState();
  const DRAGGABLE_PLACES = [{ x: -8, y: 6 }, { x: -8, y: 3 }, { x: -8, y: 0 }, { x: -8, y: -3 }]
  const [lastGeneratedIndex, setLastGeneratedIndex] = useState(DRAGGABLE_PLACES.length);
  const { rotationX, rotationY } = useControls({ rotationX: {
    value: Math.PI / 5.75,
    min: - Math.PI,
    max: Math.PI,
    step: Math.PI / 16,
  }, rotationY:{
    value: Math.PI / 4,
    min: - Math.PI,
    max: Math.PI,
    step: Math.PI / 16,
  } })

  const gridSize = 4;
  const tileScale = 1;
  const rotation = [rotationX, rotationY, 0]
  const startX = useMemo(() => Math.floor(Math.random() * gridSize), []);
  const finishX = useMemo(() => Math.floor(Math.random() * gridSize), []);

  useEffect(() => {
    const updatedDraggables = {...draggables };
    DRAGGABLE_PLACES.forEach((draggable, index) => {
      const { x, y } = draggable;
      const tileType = randomFromArray(TILES);
      updatedDraggables[index] = {
        index, x, y, tileType
      };
    });
    setDraggables(updatedDraggables);
    // eslint-disable-next-line
  }, [DRAGGABLE_PLACES]);

  const checkFinish = (fittedPieces) => {
    const road = [];

    const findExits = (id, enterPosition) => (id.substring(0, enterPosition) + "0" + id.substring(enterPosition + 1, id.length));

    const fromStartPiece = fittedPieces.find(p => p.x === startX && p.y === 0);
    if (fromStartPiece) {
      road.push(fromStartPiece);
      let currentPosition = { x: startX, y: 0 };

      const findNextPiece = (startPiece, currentPosition) => {
        findExits(startPiece.id, 0).split('').forEach((exit, i) => {
          if (exit === '1') {
            let newPosition = { ...currentPosition };

            switch (i) {
              case 0:
                newPosition.y = newPosition.y - 1;
                break;
              case 1:
                newPosition.x = newPosition.x + 1;
                break;
              case 2:
                newPosition.y = newPosition.y + 1;
                  break;
              case 3:
                newPosition.x = newPosition.x - 1;
                break;
              default:
                newPosition = null;
            }

            const followingPiece = newPosition && fittedPieces.find(p => p.x === newPosition.x && p.y === newPosition.y);
            if (followingPiece) {
              if (newPosition.x === finishX && newPosition.y === gridSize - 1) {
                road.push(followingPiece);
                setFinishRoad(road);
              } else {
                road.push(followingPiece);
                findNextPiece(followingPiece, newPosition);
              }
            }
          }
        })
      };

      findNextPiece(fromStartPiece, currentPosition);
    }
  }

  const onFitPiece = ({ index, x, y }) => {
    const fittedPiece = { id: draggables[index].tileType.id, x, y };
    const updatedFittedPieces = [...fittedPieces, fittedPiece];
    setFittedPieces(updatedFittedPieces);
    !finishRoad &&  checkFinish(updatedFittedPieces)
    resetDraggable(index);
  };

  const resetDraggable = (index) => {
    setDraggingPiece(null);
    const updatedDraggables = { ...draggables };
    const { x, y } = DRAGGABLE_PLACES[index];
    updatedDraggables[index] = {
      ...updatedDraggables[index],
      x,
      y,
      draggableIndex: lastGeneratedIndex + 1,
      tileType: randomFromArray(TILES),
      rotation
    };
    setLastGeneratedIndex(lastGeneratedIndex + 1)
    setDraggables(updatedDraggables);
  };
  return (
    <>
      <group position={[-gridSize, 0, 0]} rotation={rotation}>
        <Tile
          key={`initial-tile`}
          x={startX}
          y={-1}
          state="arrow"
          tileScale={tileScale}
        />
        <Grid
          x={gridSize}
          y={gridSize}
          draggingPiece={draggingPiece}
          setDraggingPiece={setDraggingPiece}
          onFitPiece={onFitPiece}
          tileScale={tileScale}
          finishRoad={finishRoad}
        />
        <Tile
          key={`finish-tile`}
          x={finishX}
          y={gridSize}
          state="arrow"
          tileScale={tileScale}
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
      <Canvas camera={{ zoom: 10, position: [0, 0, 100] }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
ReactDOM.render(<App />, document.getElementById('root'))
