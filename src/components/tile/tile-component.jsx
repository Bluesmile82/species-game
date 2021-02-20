import React, { useState, useMemo } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useLoader } from 'react-three-fiber'
import * as THREE from 'three'

const Tile = ({ x = 0, y = 0, color, draggingPiece, setDraggingPiece, state, changeTileState, tileScale }) => {
  const gltf = useLoader(GLTFLoader, '/cube.glb')
  const textureUrl = {
    'blocked': '/lava.png',
    'highlighted': '/jungle.jpg'
  }[state] || '';
  const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl])
console.log('-', textureUrl, state)
  const {
    nodes: {
      Cube: { geometry, material }
    }
  } = gltf

  const scale = tileScale
  const currentTile = { x, y, color, state }
  const [highlightedColor, setHighlightedColor] = useState()
  const setHighlighted = (highlighted) => {
    if (highlighted) {
      changeTileState({ ...currentTile, state: 'highlighted' })
    } else {
      changeTileState({ ...currentTile, state: null, color })
    }
  }
  return (
    <mesh
      attach="mesh"
      scale={[scale, scale / 4, scale]}
      position={[x * 2 * scale, 0, y * 2 * scale]}
      onPointerOver={() => {
        setHighlighted(true)
      }}
      onPointerUp={() => {
        if (draggingPiece === 'dragging') {
          setHighlightedColor('white')
          setDraggingPiece(null)
        }
      }}
      material={material}
      geometry={geometry}
      onPointerOut={() => setHighlighted(false)}>
      <meshPhongMaterial
        attach="material"
        opacity={highlightedColor || state === 'highlighted' || state === 'blocked' ? 1 : 0.2}
        transparent
        color={state === 'highlighted' ? 'red' : color}>
        {state && <primitive attach="map" object={texture} />}
      </meshPhongMaterial>
    </mesh>
  )
}

export default Tile;
