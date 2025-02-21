"use client"

import { useEffect, useState } from "react"

interface Stat {
  name: string
  value: string
  price: string
  trend: number
}

export function StatsBar() {
  const [stats, setStats] = useState<Stat[]>([
    { name: "GPT-4", value: "175B", price: "$0.06", trend: 0.02 },
    { name: "BERT", value: "340M", price: "$0.02", trend: -0.01 },
    { name: "T5", value: "11B", price: "$0.03", trend: 0.01 },
    { name: "LLaMA", value: "65B", price: "$0.04", trend: -0.02 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((stats) =>
        stats.map((stat) => {
          const priceTrend = Number((Math.random() * 0.04 - 0.02).toFixed(2))
          const currentPrice = Number.parseFloat(stat.price.slice(1))
          const newPrice = Math.max(0.01, currentPrice + currentPrice * priceTrend).toFixed(2)
          return {
            ...stat,
            trend: priceTrend,
            price: `$${newPrice}`,
          }
        }),
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-zinc-900/50 border-b border-zinc-800 overflow-x-auto whitespace-nowrap">
      <div className="flex divide-x divide-zinc-800">
        {stats.map((stat, i) => (
          <div key={stat.name} className="px-4 py-2 flex items-center space-x-2">
            <span className="text-purple-400 font-semibold">{stat.name}</span>
            <span className="text-white">{stat.value}</span>
            <span className="text-sm text-zinc-500">Price: {stat.price}/1K tokens</span>
            <span className={`text-sm ${stat.trend < 0 ? "text-green-500" : "text-red-500"}`}>
              {stat.trend < 0 ? "▼" : "▲"}
              {Math.abs(stat.trend * 100).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

