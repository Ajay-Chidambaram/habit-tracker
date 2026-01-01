
'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/auth/AuthProvider'
import { api as settingsApi } from '@/lib/api/settings'
import { UserPreferences, Theme } from '@/types'
import { useToast } from '@/lib/hooks/use-toast'
import {
  Palette,
  Calendar,
  Download,
  LogOut,
  User,
  Shield,
  Check,
  Moon,
  Sun,
  Trees,
  Circle
} from 'lucide-react'
import { motion } from 'framer-motion'

const THEMES: { id: Theme; name: string; icon: any; color: string }[] = [
  { id: 'midnight', name: 'Midnight Focus', icon: Moon, color: 'bg-[#0a0f14]' },
  { id: 'forest', name: 'Forest Deep', icon: Trees, color: 'bg-[#0a1a10]' },
  { id: 'sunset', name: 'Sunset Glow', icon: Sun, color: 'bg-[#1a0f0a]' },
  { id: 'mono', name: 'Mono Chrome', icon: Circle, color: 'bg-[#111111]' },
]

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const data = await settingsApi.fetchPreferences()
        setPrefs(data)
      } catch (error) {
        console.error('Failed to fetch preferences:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPrefs()
  }, [])

  const handleUpdatePrefs = async (updates: Partial<UserPreferences>) => {
    if (!prefs) return
    try {
      setSaving(true)
      const updated = await settingsApi.updatePreferences(updates)
      setPrefs(updated)
      toast({
        title: 'Settings updated',
        description: 'Your preferences have been saved.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      await settingsApi.exportData()
      toast({
        title: 'Export successful',
        description: 'Your data has been downloaded.'
      })
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Could not export your data.',
        variant: 'destructive'
      })
    } finally {
      setExporting(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out.',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return <div className="p-8"><PageHeader title="Settings" description="Manage your preferences" /></div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <PageHeader title="Settings" description="Manage your experience and data" />

      <section className="space-y-6">
        <div className="flex items-center space-x-2 text-slate-400">
          <Palette className="h-5 w-5" />
          <h2 className="text-lg font-bold text-white">Appearance</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleUpdatePrefs({ theme: theme.id })}
              className={`relative p-4 rounded-xl border-2 transition-all flex items-center space-x-4 text-left ${prefs?.theme === theme.id
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
            >
              <div className={`p-3 rounded-lg ${theme.color} border border-slate-700`}>
                <theme.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">{theme.name}</p>
                <p className="text-xs text-slate-500">Apply the {theme.id} color palette</p>
              </div>
              {prefs?.theme === theme.id && (
                <div className="absolute top-4 right-4 bg-blue-500 rounded-full p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center space-x-2 text-slate-400">
          <Calendar className="h-5 w-5" />
          <h2 className="text-lg font-bold text-white">Calendar & Regional</h2>
        </div>

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Week Starts On</p>
              <p className="text-sm text-slate-400">Choose your preferred first day of the week</p>
            </div>
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
              <button
                onClick={() => handleUpdatePrefs({ week_starts_on: 0 })}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${prefs?.week_starts_on === 0 ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
              >
                Sunday
              </button>
              <button
                onClick={() => handleUpdatePrefs({ week_starts_on: 1 })}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${prefs?.week_starts_on === 1 ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
              >
                Monday
              </button>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex items-center space-x-2 text-slate-400">
          <User className="h-5 w-5" />
          <h2 className="text-lg font-bold text-white">Account</h2>
        </div>

        <Card className="p-6 divide-y divide-slate-800">
          <div className="pb-6">
            <p className="text-xs text-slate-500 mb-1">Signed in as</p>
            <p className="font-bold text-white">{user?.email}</p>
          </div>

          <div className="py-6 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Export My Data</p>
              <p className="text-sm text-slate-400">Download all your habits, goals, and history in JSON format</p>
            </div>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting}
              className="border-slate-700 hover:bg-slate-800"
            >
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export JSON'}
            </Button>
          </div>

          <div className="pt-6">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Card>
      </section>

      <div className="flex items-center justify-center pt-8 text-slate-600 space-x-2">
        <Shield className="h-4 w-4" />
        <span className="text-xs">Your data is stored securely in Supabase with RLS encryption.</span>
      </div>
    </div>
  )
}
