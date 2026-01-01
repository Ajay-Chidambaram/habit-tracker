
'use client'

import { Card } from '@/components/ui/card'
import { DailyStats, DayOfWeekStat } from '@/lib/utils/analytics'
import { motion } from 'framer-motion'

interface HabitAnalyticsProps {
  dailyStats: DailyStats[]
  dayOfWeekStats: DayOfWeekStat[]
}

export const HabitAnalytics = ({ dailyStats, dayOfWeekStats }: HabitAnalyticsProps) => {
  // Simple SVG Line Chart logic
  const maxRate = 100
  const width = 800
  const height = 200
  const padding = 20

  const points = dailyStats.length > 0
    ? dailyStats.map((stat, i) => {
      const x = (i / (dailyStats.length - 1)) * (width - padding * 2) + padding
      const y = height - ((stat.rate / maxRate) * (height - padding * 2) + padding)
      return `${x},${y}`
    }).join(' ')
    : ''

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-6">Completion Rate Over Time</h3>
        <div className="relative h-[200px] w-full">
          {dailyStats.length > 1 ? (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1e293b" strokeWidth="1" />
              <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1e293b" strokeWidth="1" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1e293b" strokeWidth="1" />

              {/* Line */}
              <motion.polyline
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Gradient */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              {/* Data Points */}
              {dailyStats.map((stat, i) => {
                const x = (i / (dailyStats.length - 1)) * (width - padding * 2) + padding
                const y = height - ((stat.rate / maxRate) * (height - padding * 2) + padding)
                return (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#3b82f6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + i * 0.05 }}
                  />
                )
              })}
            </svg>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              Not enough data to display chart
            </div>
          )}
        </div>
        <div className="flex justify-between mt-4 text-xs text-slate-500 px-2">
          {dailyStats.length > 0 && (
            <>
              <span>{dailyStats[0].date}</span>
              <span>{dailyStats[Math.floor(dailyStats.length / 2)].date}</span>
              <span>{dailyStats[dailyStats.length - 1].date}</span>
            </>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">Best Days of Week</h3>
          <div className="space-y-4">
            {dayOfWeekStats
              .sort((a, b) => b.count - a.count)
              .map((stat, i) => (
                <div key={stat.day} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">{stat.day}</span>
                    <span className="text-slate-400">{stat.count} completions ({Math.round(stat.percentage)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">Consistency Insights</h3>
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Most Consistent Habit</p>
              <h4 className="text-xl font-bold text-white">Morning Meditation</h4>
              <div className="mt-2 flex items-center text-green-400 text-sm">
                <span>95% completion rate</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Needs Attention</p>
              <h4 className="text-xl font-bold text-white">Deep Work</h4>
              <div className="mt-2 flex items-center text-red-400 text-sm">
                <span>40% completion rate</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-400">Pro Tip</p>
              <p className="text-sm text-slate-300 mt-1">
                You&apos;re most active on **Tuesdays**. Try scheduling your hardest habits then!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
