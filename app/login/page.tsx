import { LoginButton } from '@/components/auth/LoginButton'
import { getServerUser } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; error?: string }
}) {
  // Redirect if already authenticated
  const user = await getServerUser()
  if (user) {
    redirect('/')
  }

  const redirectTo = searchParams.redirectTo || '/'
  const error = searchParams.error

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to track your weekly habits and goals
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                {decodeURIComponent(error)}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <LoginButton redirectTo={redirectTo} className="w-full" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact support
          </p>
        </div>
      </div>
    </div>
  )
}

