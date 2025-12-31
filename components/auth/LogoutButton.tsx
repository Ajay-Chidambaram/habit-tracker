'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'

interface LogoutButtonProps {
  className?: string
  variant?: 'default' | 'ghost' | 'text'
}

export function LogoutButton({ 
  className = '', 
  variant = 'default' 
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Error signing out. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const baseStyles = `
    inline-flex items-center justify-center gap-2
    px-4 py-2
    rounded-lg
    font-medium
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
  `

  const variantStyles = {
    default: `
      bg-secondary text-secondary-foreground
      hover:bg-accent
      focus:ring-primary
    `,
    ghost: `
      bg-transparent text-foreground
      hover:bg-accent
      focus:ring-primary
    `,
    text: `
      bg-transparent text-foreground
      hover:underline
      focus:ring-primary
    `,
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Signing out...
        </>
      ) : (
        <>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign out
        </>
      )}
    </button>
  )
}

