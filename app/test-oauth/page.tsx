'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestOAuthPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [supabaseUrl, setSupabaseUrl] = useState<string>('')
  const [supabaseKey, setSupabaseKey] = useState<string>('')
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    setSupabaseUrl(url || 'NOT SET')
    setSupabaseKey(key ? `${key.substring(0, 20)}...` : 'NOT SET')
    addLog(`Environment check: URL=${!!url}, KEY=${!!key}`)
  }, [])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`])
    console.log(message)
  }

  const testOAuth = async () => {
    try {
      addLog('Starting OAuth test...')
      const supabase = createClient()
      addLog('Supabase client created')
      
      const baseUrl = window.location.origin
      const callbackUrl = `${baseUrl}/auth/callback`
      addLog(`Base URL: ${baseUrl}`)
      addLog(`Callback URL: ${callbackUrl}`)

      addLog('Calling signInWithOAuth...')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            next: '/dashboard',
          },
          scopes: 'email profile',
        },
      })

      if (error) {
        addLog(`ERROR: ${error.message}`)
        addLog(`Error status: ${error.status}`)
        addLog(`Error name: ${error.name}`)
        setTestResult({ error: error.message, fullError: error })
      } else if (data?.url) {
        addLog(`SUCCESS: Got OAuth URL`)
        addLog(`URL: ${data.url.substring(0, 150)}...`)
        setTestResult({ success: true, url: data.url })
        addLog('Redirecting to OAuth provider...')
        window.location.href = data.url
      } else {
        addLog('WARNING: No error but also no URL')
        setTestResult({ warning: 'No URL returned' })
      }
    } catch (err) {
      addLog(`EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setTestResult({ exception: err })
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">OAuth Debug Test Page</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Environment Variables:</h2>
        <p>SUPABASE_URL: {supabaseUrl}</p>
        <p>SUPABASE_KEY: {supabaseKey}</p>
      </div>

      <button
        onClick={testOAuth}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
      >
        Test OAuth Flow
      </button>

      {testResult && (
        <div className="mb-4 p-4 bg-yellow-100 rounded">
          <h2 className="font-semibold mb-2">Test Result:</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Logs:</h2>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

