
import {
  format,
  isToday as dateFnsIsToday,
  isSameDay as dateFnsIsSameDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays as dateFnsSubDays,
  addDays as dateFnsAddDays,
  startOfDay as dateFnsStartOfDay,
  endOfDay as dateFnsEndOfDay,
  parseISO,
  isValid
} from 'date-fns'

export const formatDate = (date: Date | string | number, pattern: string = 'PP'): string => {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date)
  if (!isValid(d)) return ''
  return format(d, pattern)
}

export const isToday = (date: Date | string | number): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date)
  return dateFnsIsToday(d)
}

export const isSameDay = (dateLeft: Date | string | number, dateRight: Date | string | number): boolean => {
  const d1 = typeof dateLeft === 'string' ? parseISO(dateLeft) : new Date(dateLeft)
  const d2 = typeof dateRight === 'string' ? parseISO(dateRight) : new Date(dateRight)
  return dateFnsIsSameDay(d1, d2)
}

export const getStartOfWeek = (date: Date = new Date(), weekStartsOn: 0 | 1 = 1) => {
  return startOfWeek(date, { weekStartsOn })
}

export const getEndOfWeek = (date: Date = new Date(), weekStartsOn: 0 | 1 = 1) => {
  return endOfWeek(date, { weekStartsOn })
}

export const getStartOfMonth = (date: Date = new Date()) => {
  return startOfMonth(date)
}

export const getEndOfMonth = (date: Date = new Date()) => {
  return endOfMonth(date)
}

export const subDays = (date: Date, amount: number) => {
  return dateFnsSubDays(date, amount)
}

export const addDays = (date: Date, amount: number) => {
  return dateFnsAddDays(date, amount)
}

export const startOfDay = (date: Date) => {
  return dateFnsStartOfDay(date)
}

export const endOfDay = (date: Date) => {
  return dateFnsEndOfDay(date)
}

export const toISODate = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}
