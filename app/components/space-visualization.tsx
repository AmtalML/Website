"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function SpaceVisualization() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const pointsRef = useRef<THREE.Points | null>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 50
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 500
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = (Math.random() - 0.5) * 100
      positions[i3 + 2] = (Math.random() - 0.5) * 100

      // Create colors: purple and green
      if (Math.random() > 0.5) {
        colors[i3] = 0.5 // R
        colors[i3 + 1] = 0 // G
        colors[i3 + 2] = 0.5 // B
      } else {
        colors[i3] = 0 // R
        colors[i3 + 1] = 0.5 // G
        colors[i3 + 2] = 0 // B
      }
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    })

    const points = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(points)
    pointsRef.current = points

    // Create lines between nearby points
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.2,
    })

    function createLines() {
      // Remove old lines
      scene.children = scene.children.filter((child) => child instanceof THREE.Points)

      const positions = points.geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const x1 = positions[i3]
        const y1 = positions[i3 + 1]
        const z1 = positions[i3 + 2]

        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3
          const x2 = positions[j3]
          const y2 = positions[j3 + 1]
          const z2 = positions[j3 + 2]

          const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2))

          if (distance < 20) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(x1, y1, z1),
              new THREE.Vector3(x2, y2, z2),
            ])
            const line = new THREE.Line(lineGeometry, lineMaterial)
            scene.add(line)
          }
        }
      }
    }

    // Animation
    function animate() {
      frameRef.current = requestAnimationFrame(animate)

      // Rotate points
      if (points) {
        points.rotation.y += 0.001
        points.rotation.x += 0.0005

        // Update particle positions with subtle movement
        const positions = points.geometry.attributes.position.array
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.02
          positions[i + 1] += Math.cos(Date.now() * 0.001 + i) * 0.02
          positions[i + 2] += Math.sin(Date.now() * 0.001 + i) * 0.02
        }
        points.geometry.attributes.position.needsUpdate = true

        // Recreate lines periodically
        if (Math.random() < 0.02) {
          createLines()
        }
      }

      controls.update()
      renderer.render(scene, camera)
    }

    createLines()
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full min-h-[500px]" />
}

