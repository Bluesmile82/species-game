import React, { useRef, useState, useMemo } from 'react';
import { useThree, useLoader } from 'react-three-fiber';
import { useGesture } from 'react-use-gesture';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function Draggable({
  setDraggingPiece,
  draggableIndex,
  handleRotatePiece,
  tileScale,
  index,
  x = 0,
  y = 0,
  tileType,
  defaultRotation
}) {
  const ref = useRef();
  const [dragging, setDragging] = useState();

  // Just for click vs. drag interaction
  const isDragging = React.useRef(false);

  const textureUrl =
    {
      jungle: '/jungle.jpg',
      straight: '/road-1.jpg',
      turn: '/road-2.jpg'
    }[tileType.type] || '/jungle.jpg';
  const texture = useMemo(
    () => new THREE.TextureLoader().load(textureUrl),
    [textureUrl]
  );
  const gltf = useLoader(GLTFLoader, '/cube.glb');
  const {
    nodes: {
      Cube: { geometry, material }
    }
  } = gltf;

  const [position, setPosition] = useState([0, 0, tileScale * 3]);
  const { size, viewport } = useThree();
  const aspect = (size.width * 10) / viewport.width;
  const gestureBinds = useGesture(
    {
      onDrag: (e) => {
        const { offset, first, last } = e;
        const [xOffset, yOffset] = offset;
        const [, , pz] = position;
        if (first) {
          isDragging.current = true;
          setDragging(true);
          setDraggingPiece({ tileType, index, draggableIndex });
        } else if (last) {
          requestAnimationFrame(() => {
            isDragging.current = false;
          });
          setDragging(false);
          setDraggingPiece(null);
        }
        setPosition([xOffset / aspect, -yOffset / aspect, pz]);
      },
      onClick: (e) => {
        if (isDragging.current) return;
        handleRotatePiece({ tileType, index, draggableIndex, x, y });
      }
    },
    {
      drag: {
        delay: true,
        threshold: 10
      },
      pointerEvents: true
    }
  );
  const rotation = [defaultRotation.rotationX, defaultRotation.rotationY, 0];
  return (
    <group rotation={rotation} position={position}>
      <mesh
        {...gestureBinds()}
        ref={ref}
        position={[x, 1, y]}
        rotation={[0, (tileType.rotation * Math.PI) / 2, 0]}
        scale={[tileScale * 2, (tileScale * 2) / 4, tileScale * 2]}
        material={material}
        geometry={geometry}
      >
        <boxBufferGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={texture}
          color="lightblue"
          opacity={dragging ? 0.5 : 1}
          transparent
        />
      </mesh>
    </group>
  );
}

export default Draggable;
