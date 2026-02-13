import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Sparkles } from '@react-three/drei'

export function Heart(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!)

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0.5)
    shape.bezierCurveTo(0, 0.5, -0.1, 1, -0.5, 1)
    shape.bezierCurveTo(-1.1, 1, -1.1, 0.3, -1.1, 0.3)
    shape.bezierCurveTo(-1.1, -0.1, -0.8, -0.6, -0.1, -1.2)
    shape.lineTo(0, -1.3)
    shape.lineTo(0.1, -1.2)
    shape.bezierCurveTo(0.8, -0.6, 1.1, -0.1, 1.1, 0.3)
    shape.bezierCurveTo(1.1, 0.3, 1.1, 1, 0.5, 1)
    shape.bezierCurveTo(0.2, 1, 0, 0.5, 0, 0.5)
    return shape
  }, [])

  const extrudeSettings = {
    depth: 0.4,
    bevelEnabled: true,
    bevelSegments: 12,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1,
  }

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.2
    meshRef.current.rotation.z = Math.cos(t * 0.3) * 0.1
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh {...props} ref={meshRef} rotation={[0, Math.PI, 0]}>
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color="#720026" /* Deep Burgundy */
          emissive="#3a0010"
          roughness={0.15}
          metalness={0.6} /* More metallic */
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={1}
        />
      </mesh>
    </Float>
  )
}

export function BackgroundHearts() {
  const count = 50
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Generate random positions
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      particle.t += speed
      const s = Math.cos(t)

      dummy.position.set(
        xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <extrudeGeometry args={[new THREE.Shape().moveTo(0, 0.5).bezierCurveTo(0, 0.5, -0.1, 1, -0.5, 1).bezierCurveTo(-1.1, 1, -1.1, 0.3, -1.1, 0.3).bezierCurveTo(-1.1, -0.1, -0.8, -0.6, -0.1, -1.2).lineTo(0, -1.3).lineTo(0.1, -1.2).bezierCurveTo(0.8, -0.6, 1.1, -0.1, 1.1, 0.3).bezierCurveTo(1.1, 0.3, 1.1, 1, 0.5, 1).bezierCurveTo(0.2, 1, 0, 0.5, 0, 0.5), { depth: 0.1, bevelEnabled: false }]} />
      <meshBasicMaterial color="#D4AF37" transparent opacity={0.2} />
    </instancedMesh>
  )
}

// Re-export the original scene content
export function SceneContent({ accepted }: { accepted: boolean }) { // Keep accepted prop to avoid breaking App.tsx but ignore it or use it simply
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#D4AF37" />
      <Heart position={[0, 0, 0]} scale={1.5} />
      <BackgroundHearts />
      <Sparkles
        count={100}
        scale={12}
        size={2}
        speed={0.4}
        opacity={0.5}
        color="#D4AF37"
      />
      <Environment preset="city" />
    </>
  )
}

import { Environment } from '@react-three/drei'
