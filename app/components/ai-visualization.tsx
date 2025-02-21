"use client"

import dynamic from 'next/dynamic'

// Dynamically import the SpaceVisualization component with no SSR
const SpaceVisualization = dynamic(() => import('./space-visualization'), { ssr: false })

export default function AIVisualization() {
  return (
    <div className="absolute inset-0">
      <SpaceVisualization />
    </div>
  )
}

