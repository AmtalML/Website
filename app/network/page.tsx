import { Navigation } from "../components/navigation"
import dynamic from "next/dynamic"

// Dynamically import the components that use Three.js with no SSR
const AINetwork = dynamic(() => import("./components/ai-network"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-zinc-900" />,
})

const ModelTable = dynamic(() => import("./components/model-table"), {
  ssr: false,
  loading: () => <div className="w-full h-32 bg-zinc-900" />,
})

export default function NetworkPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <Navigation />
      <div className="h-[70vh] relative">
        <AINetwork />
        <div className="absolute top-8 left-8 z-10">
          <h1 className="text-2xl font-bold">AmtalML Global AI Network</h1>
          <p className="text-zinc-400">Active inference nodes</p>
        </div>
      </div>
      <ModelTable />
    </div>
  )
}

