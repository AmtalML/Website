import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-white font-bold text-xl">
              AmtalML
            </Link>

            <div className="hidden md:flex space-x-1">
              <Link href="/network">
                <Button variant="ghost" className="text-zinc-400 hover:text-white">
                  <span className="text-zinc-600 mr-2">01</span>
                  AI Network
                </Button>
              </Link>
              {["Models", "Research"].map((item, i) => (
                <Button key={item} variant="ghost" className="text-zinc-400 hover:text-white">
                  <span className="text-zinc-600 mr-2">0{i + 2}</span>
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Docs
            </Button>
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Blog
            </Button>
            <Button className="bg-purple-700 hover:bg-purple-600">Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

