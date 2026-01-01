
'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle2, Target, BookOpen, Star, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface MonthlySummaryProps {
  stats: {
    habitCompletions: number
    goalsCompleted: number
    learningMinutes: number
    bucketItemsAchieved: number
  }
}

export const MonthlySummary = ({ stats }: MonthlySummaryProps) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    return `${hours}h ${mins}m`
  }

  const items = [
    {
      label: 'Habit Completions',
      value: stats.habitCompletions,
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      label: 'Goals Achieved',
      value: stats.goalsCompleted,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: 'Learning Time',
      value: formatTime(stats.learningMinutes),
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      label: 'Bucket List Items',
      value: stats.bucketItemsAchieved,
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-4 flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${item.bgColor}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium">{item.label}</p>
              <h3 className="text-2xl font-bold text-white">{item.value}</h3>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
