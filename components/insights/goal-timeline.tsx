
'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle2, Flag } from 'lucide-react'
import { motion } from 'framer-motion'

interface GoalTimelineProps {
  timeline: {
    date: string
    title: string
    goalId: string
  }[]
  averageTime: number
}

export const GoalTimeline = ({ timeline, averageTime }: GoalTimelineProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 p-6">
        <h3 className="text-lg font-bold text-white mb-6">Milestone Completion Timeline</h3>
        <div className="relative">
          {timeline.length > 0 ? (
            <div className="space-y-8">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-800" />

              {timeline.map((item, index) => (
                <motion.div
                  key={`${item.goalId}-${item.title}-${index}`}
                  className="flex items-start space-x-4 relative zim-10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-slate-900 ring-2 ring-slate-800 rounded-full p-1 z-10">
                    <CheckCircle2 className="h-3 w-3 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{item.date}</p>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Flag className="h-12 w-12 mb-4 opacity-20" />
              <p>No completed milestones yet</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-6">Efficiency Stats</h3>
        <div className="space-y-8">
          <div>
            <p className="text-sm text-slate-400 font-medium">Avg. Goal Completion Time</p>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-white">{averageTime}</span>
              <span className="text-slate-400">days</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Based on your last 5 completed goals.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <h4 className="text-sm font-bold text-purple-400">Momentum Insight</h4>
            <p className="text-sm text-slate-300 mt-1">
              You&apos;re completing goals **20% faster** than last month. Keep it up!
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
