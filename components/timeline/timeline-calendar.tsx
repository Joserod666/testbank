"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import type { Project } from "@/lib/types"
import { getDaysUntil } from "@/lib/utils/date-helpers"

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export function TimelineCalendar({ projects }: { projects: (Project & { clients: { name: string } })[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const projectsByDate = new Map<string, (Project & { clients: { name: string } })[]>()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  projects.forEach((project) => {
    const dueDate = new Date(project.due_date)
    if (dueDate.getFullYear() === year && dueDate.getMonth() === month) {
      const dateKey = dueDate.getDate().toString()
      if (!projectsByDate.has(dateKey)) {
        projectsByDate.set(dateKey, [])
      }
      projectsByDate.get(dateKey)?.push(project)
    }
  })

  function isUrgent(project: Project & { clients: { name: string } }): boolean {
    const daysUntil = getDaysUntil(project.due_date)
    return daysUntil >= 0 && daysUntil < 7
  }

  function previousMonth() {
    setCurrentDate(new Date(year, month - 1))
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {monthNames[month]} {year}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayProjects = projectsByDate.get(day.toString()) || []
            const hasProjects = dayProjects.length > 0
            const hasUrgentProjects = dayProjects.some(isUrgent)
            const isToday =
              day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

            return (
              <div
                key={day}
                className={`relative p-2 text-center rounded-lg border min-h-[60px] ${
                  hasUrgentProjects
                    ? "bg-red-100 dark:bg-red-900/20 border-red-500 ring-2 ring-red-500/50"
                    : hasProjects
                      ? "bg-primary/10 border-primary"
                      : "bg-background"
                } ${isToday ? "ring-2 ring-primary" : ""}`}
              >
                <div className={`text-sm font-medium ${isToday ? "text-primary font-bold" : ""}`}>{day}</div>
                {hasProjects && (
                  <div className="mt-1 space-y-1">
                    {dayProjects.map((project) => {
                      const urgent = isUrgent(project)
                      return (
                        <div
                          key={project.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${
                            urgent
                              ? "bg-red-500 text-white font-semibold"
                              : "bg-primary/20 text-primary"
                          }`}
                          title={project.name}
                        >
                          {project.name}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
