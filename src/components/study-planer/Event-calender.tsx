'use client'

import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createViewMonthGrid, createViewWeek } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useMemo, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface Activity {
  _id: string
  title: string
  description?: string
  status?: string
  start: string
  end: string
  timezone?: string
}

function toZDT(iso: string, tz?: string): Temporal.ZonedDateTime {
  const zone = tz ?? 'UTC'
  try {
    return Temporal.Instant.from(iso).toZonedDateTimeISO(zone)
  } catch {
    return Temporal.Instant.fromEpochMilliseconds(new Date(iso).getTime()).toZonedDateTimeISO('UTC')
  }
}

const STATUS_COLOR: Record<string, string> = {
  todo: 'orange', process: 'cyan', done: 'green',
}

export default function CalendarApp() {
  const { user } = useAuth()
  const [isDark, setIsDark] = useState(true)

  // Sync with the app's data-theme attribute
  useEffect(() => {
    const update = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ['activities', user?.uid],
    queryFn: async () => {
      const url = user ? `/api/activities?userId=${user.uid}` : '/api/activities'
      const { data } = await axios.get<Activity[]>(url)
      return data
    },
    refetchInterval: 5000,
    enabled: !!user,
  })

  const eventsService = useMemo(() => createEventsServicePlugin(), [])

  const calendar = useNextCalendarApp({
    views: [createViewMonthGrid(), createViewWeek()],
    defaultView: 'month-grid',
    events: [],
    isDark,
    calendars: {
      orange: {
        colorName: 'orange',
        lightColors: { main: '#ED8936', container: '#FEF3C7', onContainer: '#92400E' },
        darkColors:  { main: '#ED8936', container: '#78350F', onContainer: '#FDE68A' },
      },
      cyan: {
        colorName: 'cyan',
        lightColors: { main: '#38BDF8', container: '#E0F2FE', onContainer: '#0C4A6E' },
        darkColors:  { main: '#38BDF8', container: '#0C4A6E', onContainer: '#BAE6FD' },
      },
      green: {
        colorName: 'green',
        lightColors: { main: '#22C55E', container: '#DCFCE7', onContainer: '#14532D' },
        darkColors:  { main: '#22C55E', container: '#14532D', onContainer: '#BBF7D0' },
      },
    },
    plugins: [eventsService, createEventModalPlugin()],
  })

  // Keep isDark in sync after initial mount (calendar is memoized)
  useEffect(() => {
    if (calendar) {
      calendar.setTheme(isDark ? 'dark' : 'light')
    }
  }, [isDark, calendar])

  useEffect(() => {
    if (!eventsService || activities.length === 0) return
    try {
      eventsService.set(
        activities
          .filter(a => a.start && a.end)
          .map(a => ({
            id: a._id,
            title: a.title,
            start: toZDT(a.start, a.timezone),
            end: toZDT(a.end, a.timezone),
            description: a.description ?? '',
            calendarId: STATUS_COLOR[a.status ?? 'todo'] ?? 'orange',
          }))
      )
    } catch (err) {
      console.error('[Calendar] Failed to parse events:', err)
    }
  }, [activities, eventsService])

  return (
    <div className="h-full w-full">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
