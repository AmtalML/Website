'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const models = [
  {
    position: 1,
    name: 'AmtalGPT-4',
    type: 'Language Model',
    performance: '98.5 TFLOPS',
    status: 'Active'
  },
  {
    position: 2,
    name: 'AmtalVision-3',
    type: 'Computer Vision',
    performance: '76.2 TFLOPS',
    status: 'Active'
  },
  {
    position: 3,
    name: 'AmtalNLP-2',
    type: 'Natural Language Processing',
    performance: '62.8 TFLOPS',
    status: 'Maintenance'
  },
  {
    position: 4,
    name: 'AmtalRL-1',
    type: 'Reinforcement Learning',
    performance: '54.3 TFLOPS',
    status: 'Active'
  },
]

export default function ModelTable() {
  return (
    <div className="container mx-auto px-4 -mt-20 relative z-10">
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-24 font-mono text-zinc-400">POSITION</TableHead>
              <TableHead className="font-mono text-zinc-400">MODEL</TableHead>
              <TableHead className="font-mono text-zinc-400">TYPE</TableHead>
              <TableHead className="font-mono text-zinc-400">PERFORMANCE</TableHead>
              <TableHead className="font-mono text-zinc-400">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.position} className="hover:bg-white/5">
                <TableCell className="font-mono">{model.position}</TableCell>
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell>{model.type}</TableCell>
                <TableCell>{model.performance}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      model.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    {model.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

