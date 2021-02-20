import React, { useRef, useState } from 'react'
import { useThree } from 'react-three-fiber'
import { useDrag } from 'react-use-gesture'

function DraggableMesh({ setDraggingPiece, color, tileScale }) {
  const ref = useRef()
  const [position, setPosition] = useState([0, 0, tileScale * 3])
  const { size, viewport } = useThree()
  const aspect = (size.width * 10) / viewport.width
  const bind = useDrag(
    ({ offset: [x, y], first, last }) => {
      const [, , pz] = position
      if (first) setDraggingPiece('dragging')
      if (last) setDraggingPiece(null)
      if (last) setDraggingPiece(null)
      setPosition([x / aspect, -y / aspect, pz])
    },
    { pointerEvents: true }
  )
  const rotation = [Math.PI / 4, Math.PI / 4, 0]
  return (
    <group rotation={rotation} position={position}>
      <mesh {...bind()} ref={ref} scale={[tileScale * 2, tileScale * 2 / 4, tileScale * 2]}>
        <boxBufferGeometry attach="geometry" />
        <meshBasicMaterial attach="material" linewidth={1} color={color || 'blue'} />
      </mesh>
    </group>
  )
}

export default DraggableMesh
