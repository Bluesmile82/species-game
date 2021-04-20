import React, { useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from 'react-three-fiber';
import * as THREE from 'three';

const Tile = ({
  x = 0,
  y = 0,
  color,
  draggingPiece,
  state,
  rotation = 0,
  positioned,
  changeTileState,
  tileScale,
  highlighted,
  onFitPiece,
  isPartOfFinishRoad
}) => {
  const gltf = useLoader(GLTFLoader, '/cube.glb');
  const textureUrl =
    {
      blocked: '/lava.png',
      straight: '/road-1.jpg',
      turn: '/road-2.jpg',
      arrow: '/arrow.jpg'
    }[state] || '/jungle.jpg';
  const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [
    textureUrl
  ]);
  const {
    nodes: {
      Cube: { geometry, material }
    }
  } = gltf;
  const scale = tileScale;
  const currentTile = { x, y, color, state, positioned };
  const setHighlighted = (highlighted) => {
    if (!highlighted && !currentTile.positioned) {
      changeTileState({
        ...currentTile,
        highlighted: false,
        state: null
      });
    }
    if (!currentTile.state) {
      changeTileState({
        ...currentTile,
        highlighted,
        state: highlighted ? draggingPiece.tileType.type : null,
        rotation: highlighted && draggingPiece.tileType.rotation
      });
    }
  };
  const scaleY = state ? scale / 4 : scale / 10;
  return (
    <mesh
      attach="mesh"
      scale={[scale, scaleY, scale]}
      rotation={[0, (rotation * Math.PI) / 2, 0]}
      position={[x * 2 * scale, 0, y * 2 * scale]}
      onPointerOver={
        changeTileState &&
        (() => {
          if (draggingPiece) {
            setHighlighted(true);
          }
        })
      }
      onPointerUp={
        changeTileState &&
        onFitPiece &&
        (() => {
          if (draggingPiece) {
            if (!currentTile.positioned) {
              onFitPiece({ index: draggingPiece.index, x, y });
              changeTileState({
                ...currentTile,
                state: draggingPiece.tileType.type,
                rotation: draggingPiece.tileType.rotation,
                positioned: true
              });
            }
          }
        })
      }
      material={material}
      geometry={geometry}
      onPointerOut={changeTileState && (() => setHighlighted(false))}
    >
      <meshPhongMaterial
        attach="material"
        opacity={highlighted || state ? 1 : 0.2}
        transparent
        map={texture}
        color={isPartOfFinishRoad ? 'yellow' : color}
      />
    </mesh>
  );
};

export default Tile;
