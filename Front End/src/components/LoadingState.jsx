import { Loader2 } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg p-6">
      <Loader2 className="h-8 w-8 animate-spin text-sky-600 mb-4" />
      <p className="text-gray-600">Loading lesson content...</p>
    </div>
  )
}

