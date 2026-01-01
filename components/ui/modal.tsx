import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Button } from "./button"

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  width?: string
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, isOpen, onClose, title, description, width = "max-w-lg", children, ...props }, ref) => {

    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isOpen])

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Content */}
        <div
          ref={ref}
          className={cn(
            "relative z-50 w-full overflow-hidden rounded-lg bg-bg-elevated border border-border p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200",
            width,
            className
          )}
          {...props}
        >
          <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
            {title && (
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-text-muted">
                {description}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          {children}
        </div>
      </div>
    )
  }
)
Modal.displayName = "Modal"

export { Modal }
