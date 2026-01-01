
import { cn } from '@/lib/utils/cn'

interface GoalProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  className?: string
  showText?: boolean
}

export function GoalProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  color = '#3b82f6',
  className,
  showText = true
}: GoalProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] transition-all duration-500 ease-in-out"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {showText && (
        <span className="absolute text-xs font-semibold tabular-nums" style={{ color }}>
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}
