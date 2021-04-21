import React, { useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from 'react-three-fiber';
import * as THREE from 'three';

const TileButton = ({
  x = 0,
  y = 0,
  color,
  rotation = 0,
  tileScale,
  highlighted,
  state,
  onClick
}) => {
  const gltf = useLoader(GLTFLoader, '/cube.glb');
  const textureUrl = {
    blocked: '/lava.png',
    straight: '/road-1.jpg',
    turn: '/road-2.jpg',
    arrow: '/arrow.jpg',
    rotate: '/rotate.png'
  }[state];

  const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [
    textureUrl
  ]);
  const {
    nodes: {
      Cube: { geometry, material }
    }
  } = gltf;
  // const currentTile = { x, y, color, state };
  const scaleY = state ? tileScale / 4 : tileScale / 10;
  return (
    <mesh
      attach="mesh"
      scale={[tileScale, scaleY, tileScale]}
      rotation={[0, (rotation * Math.PI) / 2, 0]}
      position={[x * 2 * tileScale, 0, y * 2 * tileScale]}
      // onPointerOver={}
      // onPointerUp={changeTileState && onFitPiece}
      onClick={onClick}
      material={material}
      geometry={geometry}
      // onPointerOut={changeTileState && (() => setHighlighted(false))}
    >
      <meshPhongMaterial
        attach="material"
        opacity={highlighted || state ? 1 : 0.2}
        transparent
        map={texture}
        color={color || 'yellow'}
      />
    </mesh>
  );
};

export default TileButton;
