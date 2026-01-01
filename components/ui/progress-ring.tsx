import * as React from "react"
import { cn } from "@/lib/utils/cn"

interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  circleClassName?: string
  indicatorClassName?: string
  showValue?: boolean
}

const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  ({
    className,
    value,
    max = 100,
    size = 60,
    strokeWidth = 4,
    circleClassName,
    indicatorClassName,
    showValue = false,
    children,
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100)
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            className={cn("text-secondary", circleClassName)}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={cn("text-primary transition-all duration-300 ease-in-out", indicatorClassName)}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset
            }}
          />
        </svg>
        {(showValue || children) && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
            {children ? children : `${Math.round(percentage)}%`}
          </div>
        )}
      </div>
    )
  }
)
ProgressRing.displayName = "ProgressRing"

export { ProgressRing }
