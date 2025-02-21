export function BackedBy() {
    const mlTerms = ["Deep Learning", "Neural Networks", "Transformer", "Reinforcement Learning", "Computer Vision"]
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {mlTerms.map((term) => (
          <div
            key={term}
            className="h-12 flex items-center justify-center px-6 rounded-lg bg-zinc-900/50 border border-purple-800"
          >
            <span className="text-purple-400 text-sm font-medium">{term}</span>
          </div>
        ))}
      </div>
    )
  }
  
  