import React, { Suspense, useEffect, useState, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { Canvas } from 'react-three-fiber'
import Draggable from './draggable'
import Tile from './components/tile'
import useSetInterval from 'use-set-interval'

import './styles.css'

const TILE_TYPES = { straight: 'straight', turn: 'turn' };
const TILES = {
  '1010' : {
    type: TILE_TYPES.straight,
    rotation: 0
  },
  '0101' : {
    type: TILE_TYPES.straight,
    rotation: 1
  },
  '1100' : {
    type: TILE_TYPES.turn,
    rotation: 0
  },
  '0110' : {
    type: TILE_TYPES.turn,
    rotation: 1
  },
  '0011' : {
    type: TILE_TYPES.turn,
    rotation: 2
  },
  '1001' : {
    type: TILE_TYPES.turn,
    rotation: 3
  }
};

const Grid = ({ x, y, draggingPiece, setDraggingPiece, tileScale, resetDraggable }) => {
  const createArray = (n) =>
    Array(n)
      .fill(null)
      .map((_, i) => i)
  const setInitialTiles = () =>
    createArray(x)
      .map((i) => createArray(y).map((j) => ({ x: i, y: j, state: null, piece: null, highlighted: false })))
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
      if (tiles.some((t) => !t.positioned)) {
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

const randomProperty = (obj) => {
  const keys = Object.keys(obj);
  return obj[keys[keys.length * Math.random() << 0]];
};

const Scene = () => {
  const [draggingPiece, setDraggingPiece] = useState();
  const [draggables, setDraggables] = useState();
  const DRAGGABLE_PLACES = [{ x: -8, y: 0 }, { x: -8, y: -2 }, { x: -8, y: -4 }, { x: -8, y: -6 }]
  const [lastGeneratedIndex, setLastGeneratedIndex] = useState(DRAGGABLE_PLACES.length);

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
  const rotation = [Math.PI / 4, Math.PI / 4, 0]
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
