"use client"

import { cn } from "@/lib/utils/cn"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6", className)}
      {...props}
    >
      <div className="space-y-1.5">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-text-muted">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {children}
        </div>
      )}
    </div>
  )
}
