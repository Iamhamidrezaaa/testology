interface ProgressBarProps {
  percent: number
}

export default function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
} 