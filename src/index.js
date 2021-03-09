import React, { Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Canvas } from 'react-three-fiber'
import Draggable from './draggable'
import Tile from './components/tile'
import useSetInterval from 'use-set-interval'
import sample from 'lodash/sample';

import './styles.css'

const TILE_TYPES = ['straight', 'turn'];

const Grid = ({ x, y, draggingPiece, setDraggingPiece, tileScale, resetDraggable }) => {
  const createArray = (n) =>
    Array(n)
      .fill(null)
      .map((_, i) => i)
  const setInitialTiles = () =>
    createArray(x)
      .map((i) => createArray(y).map((j) => ({ x: i, y: j, state: null, piece: null, color: 'gray', highlighted: false })))
      .flat()

  const [tiles, setTiles] = useState(setInitialTiles())

  const changeTileState = (tile) => {
    const updatedTile = tiles.find((t) => t.x === tile.x && t.y === tile.y)
    const tileIndex = tiles.indexOf(updatedTile)
    const updatedTiles = [...tiles]
    updatedTiles[tileIndex] = tile
    setTiles(updatedTiles)
  }

  const getRandomTile = () => tiles[Math.floor(Math.random() * tiles.length)]

  const blockTile = () => {
    const randomTile = getRandomTile()
    if (!randomTile.state) {
      randomTile.state = 'blocked'
      randomTile.positioned = true
      changeTileState(randomTile)
    } else {
      if (tiles.some((t) => t.state !== 'blocked')) {
        blockTile()
      }
    }
  }

  useSetInterval(() => {
    blockTile()
  }, 5000)

  return (
    <group>
      {tiles.map((tileProperties) => (
        <Tile
          key={`${tileProperties.x}-${tileProperties.y}`}
          {...tileProperties}
          draggingPiece={draggingPiece}
          setDraggingPiece={setDraggingPiece}
          changeTileState={changeTileState}
          tileScale={tileScale}
          resetDraggable={resetDraggable}
        />
      ))}
    </group>
  )
}

const Scene = () => {
  let lastGeneratedIndex = 0;
  const [draggingPiece, setDraggingPiece] = useState();
  const [draggables, setDraggables] = useState();

  const createDraggable = () => {
    lastGeneratedIndex += 1;
    setDraggables({ ...draggables, [lastGeneratedIndex]: { index: lastGeneratedIndex, x: Math.random() * -8, y: 0, tileType: sample(TILE_TYPES) }});
  };

  useEffect(() => {
    createDraggable();
    createDraggable();
  }, []);

  const resetDraggable = (index) => {
    const updatedDraggables = { ...draggables };
    delete updatedDraggables[index];
    setDraggables(updatedDraggables);
    createDraggable();
  };

  const gridSize = 6
  const tileScale = 1
  const rotation = [Math.PI / 4, Math.PI / 4, 0]
  return (
    <>
      <group position={[-gridSize, 0, 0]} rotation={rotation}>
        <Grid
          x={gridSize}
          y={gridSize}
          draggingPiece={draggingPiece}
          setDraggingPiece={setDraggingPiece}
          resetDraggable={resetDraggable}
          tileScale={tileScale}
        />
      </group>
      <ambientLight intensity={0.1} />
      <spotLight intensity={0.8} position={[300, 300, 400]} />
      <rectAreaLight intensity={0.8} attr={['white', 1, 1, 1]} />
      {draggables && Object.entries(draggables).map(([key, value]) =>
        <Draggable
          setDraggingPiece={setDraggingPiece}
          tileScale={tileScale}
          key={value.index}
          index={key}
          x={value.x}
          y={value.y}
          tileType={value.tileType}
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
