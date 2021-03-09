import React, { useMemo } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useLoader } from 'react-three-fiber'
import * as THREE from 'three'

const Tile = ({
  x = 0,
  y = 0,
  color,
  draggingPiece,
  state,
  positioned,
  changeTileState,
  tileScale,
  highlighted,
  resetDraggable,
}) => {
  const gltf = useLoader(GLTFLoader, "/cube.glb");
  const textureUrl =
    {
      blocked: "/lava.png",
      straight: "/road-1.jpg",
      turn: "/road-2.jpg",
    }[state] || "/jungle.jpg";
  const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [
    textureUrl,
  ]);
  const {
    nodes: {
      Cube: { geometry, material },
    },
  } = gltf;
  const scale = tileScale;
  const currentTile = { x, y, color, state, positioned };
  const setHighlighted = (highlighted) => {
    if (!highlighted && !currentTile.positioned) {
      changeTileState({
        ...currentTile,
        highlighted: false,
        state: null,
      });
    }
    if (!currentTile.state) {
      changeTileState({
        ...currentTile,
        highlighted,
        state: highlighted ? draggingPiece.type : null,
      });
    }
  };
  return (
    <mesh
      attach="mesh"
      scale={[scale, scale / 4, scale]}
      position={[x * 2 * scale, 0, y * 2 * scale]}
      onPointerOver={() => {
        if (draggingPiece) {
          setHighlighted(true);
        }
      }}
      onPointerUp={() => {
        if (draggingPiece) {
          resetDraggable(draggingPiece.index);
          changeTileState({
            ...currentTile,
            state: draggingPiece.type,
            positioned: true,
          });
        }
      }}
      material={material}
      geometry={geometry}
      onPointerOut={() => setHighlighted(false)}
    >
      <meshPhongMaterial
        attach="material"
        opacity={highlighted || state ? 1 : 0.2}
        transparent
        map={texture}
      />
    </mesh>
  );
};

export default Tile;
