"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Instances } from "@react-three/drei"
import { useRef, useMemo, useState } from "react"
import * as THREE from "three"
import { Toggle } from "@/components/ui/toggle"

function createWorldMapTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const context = canvas.getContext("2d")
  if (context) {
    // Base color
    context.fillStyle = "#111111"
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Simplified world map
    context.fillStyle = "#333333"
    // North America
    context.beginPath()
    context.moveTo(200, 120)
    context.lineTo(280, 120)
    context.lineTo(300, 200)
    context.lineTo(250, 250)
    context.lineTo(200, 220)
    context.fill()
    // South America
    context.beginPath()
    context.moveTo(300, 250)
    context.lineTo(320, 350)
    context.lineTo(280, 400)
    context.lineTo(260, 350)
    context.fill()
    // Europe and Africa
    context.beginPath()
    context.moveTo(480, 140)
    context.lineTo(520, 140)
    context.lineTo(540, 200)
    context.lineTo(500, 350)
    context.lineTo(460, 350)
    context.lineTo(440, 200)
    context.fill()
    // Asia and Australia
    context.beginPath()
    context.moveTo(600, 140)
    context.lineTo(750, 140)
    context.lineTo(800, 250)
    context.lineTo(750, 350)
    context.lineTo(700, 300)
    context.lineTo(650, 350)
    context.fill()
    context.beginPath()
    context.moveTo(800, 300)
    context.lineTo(850, 350)
    context.lineTo(800, 380)
    context.fill()
  }
  return new THREE.CanvasTexture(canvas)
}

function Earth() {
  const earthRef = useRef<THREE.Group>(null)
  const gridRef = useRef<THREE.LineSegments>(null)

  const earthTexture = useMemo(() => createWorldMapTexture(), [])

  // Earth rotation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0002
    }
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.0002
    }
  })

  return (
    <group ref={earthRef}>
      {/* Earth sphere */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={earthTexture} color="#444444" roughness={1} metalness={0} />
      </mesh>

      {/* Grid lines */}
      <lineSegments ref={gridRef}>
        <sphereGeometry args={[1.001, 48, 24]} />
        <lineBasicMaterial color="#666666" transparent opacity={0.3} />
      </lineSegments>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshStandardMaterial color="#9333ea" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

interface AINodeType {
  name: string
  color: string
  count: number
}

const aiNodeTypes: AINodeType[] = [
  { name: "Inference", color: "#9333ea", count: 1000 },
  { name: "Training", color: "#22c55e", count: 500 },
  { name: "Research", color: "#3b82f6", count: 500 },
]

function AINodes({ visibleTypes }: { visibleTypes: string[] }) {
  const nodesRef = useRef<THREE.InstancedMesh>(null)
  const dummyObject = useMemo(() => new THREE.Object3D(), [])

  const nodeData = useMemo(() => {
    return aiNodeTypes.flatMap((type) =>
      Array.from({ length: type.count }, () => ({
        position: new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2)
          .normalize()
          .multiplyScalar(1.05 + Math.random() * 0.3),
        speed: Math.random() * 0.001 + 0.0005,
        axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        type: type.name,
        color: new THREE.Color(type.color),
      })),
    )
  }, [])

  useFrame(() => {
    if (nodesRef.current) {
      let visibleCount = 0
      nodeData.forEach((node, i) => {
        if (visibleTypes.includes(node.type)) {
          node.position.applyAxisAngle(node.axis, node.speed)
          dummyObject.position.copy(node.position)
          dummyObject.updateMatrix()
          nodesRef.current!.setMatrixAt(visibleCount, dummyObject.matrix)
          nodesRef.current!.setColorAt(visibleCount, node.color)
          visibleCount++
        }
      })
      nodesRef.current.count = visibleCount
      nodesRef.current.instanceMatrix.needsUpdate = true
      if (nodesRef.current.instanceColor) nodesRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <Instances limit={nodeData.length} ref={nodesRef}>
      <sphereGeometry args={[0.002, 8, 8]} />
      <meshBasicMaterial />
    </Instances>
  )
}

function AINodeControls({
  visibleTypes,
  setVisibleTypes,
}: {
  visibleTypes: string[]
  setVisibleTypes: (types: string[]) => void
}) {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 bg-black/50 p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-2">AI Node Types</h2>
      {aiNodeTypes.map((type) => (
        <Toggle
          key={type.name}
          pressed={visibleTypes.includes(type.name)}
          onPressedChange={(pressed) => {
            if (pressed) {
              setVisibleTypes([...visibleTypes, type.name])
            } else {
              setVisibleTypes(visibleTypes.filter((t) => t !== type.name))
            }
          }}
          aria-label={`Toggle ${type.name} nodes`}
          className="data-[state=on]:bg-primary"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
            <span>{type.name}</span>
          </div>
        </Toggle>
      ))}
    </div>
  )
}

export default function AINetwork() {
  const [visibleTypes, setVisibleTypes] = useState<string[]>(aiNodeTypes.map((t) => t.name))

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{
          position: [0, 0, 2.5],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <color attach="background" args={["#000000"]} />

        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        {/* Scene elements */}
        <Earth />
        <AINodes visibleTypes={visibleTypes} />

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={4}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
        />
      </Canvas>
      <AINodeControls visibleTypes={visibleTypes} setVisibleTypes={setVisibleTypes} />
    </div>
  )
}

