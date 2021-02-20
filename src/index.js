import React, { Suspense, useState } from 'react'
import ReactDOM from 'react-dom'
import { Canvas } from 'react-three-fiber'
import Draggable from './draggable'
import Tile from './components/tile'
import useSetInterval from 'use-set-interval'


import './styles.css'


const Grid = ({ x, y, draggingPiece, setDraggingPiece, tileScale }) => {
  const createArray = (n) =>
    Array(n)
      .fill(null)
      .map((_, i) => i)
  const setInitialTiles = () =>
    createArray(x)
      .map((i) => createArray(y).map((j) => ({ x: i, y: j, state: null, piece: null, color: 'gray' })))
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
    if (randomTile.state !== 'highlighted') {
      randomTile.state = 'blocked'
      changeTileState(randomTile)
    } else {
      if (tiles.some((t) => t.state !== 'blocked')) blockTile()
    }
  }

  useSetInterval(() => {
    blockTile()
  }, 1000)

  return (
    <group>
      {tiles.map((coords) => (
        <Tile
          key={`${coords.x}-${coords.y}`}
          {...coords}
          draggingPiece={draggingPiece}
          setDraggingPiece={setDraggingPiece}
          changeTileState={changeTileState}
          tileScale={tileScale}
        />
      ))}
    </group>
  )
}

const Scene = () => {
  const [draggingPiece, setDraggingPiece] = useState()
  const gridSize = 6
  const tileScale = 1
  const rotation = [Math.PI / 4, Math.PI / 4, 0]
  return (
    <>
      <group position={[-gridSize, 0, 0]} rotation={rotation}>
        <Grid x={gridSize} y={gridSize} draggingPiece={draggingPiece} setDraggingPiece={setDraggingPiece} tileScale={tileScale} />
      </group>
      <ambientLight intensity={0.1} />
      <spotLight intensity={0.8} position={[300, 300, 400]} />
      <rectAreaLight intensity={0.8} attr={['white', 1, 1, 1]} />
      <Draggable setDraggingPiece={setDraggingPiece} tileScale={tileScale} />
    </>
  )
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
