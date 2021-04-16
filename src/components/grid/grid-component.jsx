import useSetInterval from 'use-set-interval';
import React, { useState } from 'react';
import Tile from '../tile';

const Grid = ({
  x,
  y,
  draggingPiece,
  setDraggingPiece,
  tileScale,
  onFitPiece
}) => {
  const createArray = (n) =>
    Array(n)
      .fill(null)
      .map((_, i) => i);
  const setInitialTiles = () =>
    createArray(x)
      .map((i) =>
        createArray(y).map((j) => ({
          x: i,
          y: j,
          state: null,
          piece: null,
          highlighted: false
        }))
      )
      .flat();

  const [tiles, setTiles] = useState(setInitialTiles());

  const changeTileState = (tile) => {
    const updatedTile = tiles.find((t) => t.x === tile.x && t.y === tile.y);
    const tileIndex = tiles.indexOf(updatedTile);
    const updatedTiles = [...tiles];
    updatedTiles[tileIndex] = tile;
    setTiles(updatedTiles);
  };

  const getRandomTile = () => tiles[Math.floor(Math.random() * tiles.length)];

  const blockTile = () => {
    const randomTile = getRandomTile();
    if (!randomTile.state) {
      randomTile.state = 'blocked';
      randomTile.positioned = true;
      changeTileState(randomTile);
    } else {
      if (tiles.some((t) => !t.positioned)) {
        blockTile();
      }
    }
  };

  useSetInterval(() => {
    blockTile();
  }, 10000);

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
          onFitPiece={onFitPiece}
        />
      ))}
    </group>
  );
};

export default Grid;
