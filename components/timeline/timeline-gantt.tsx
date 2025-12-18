"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock } from "lucide-react"
import type { Project } from "@/lib/types"
import { getHoursUntil, getTimeUntilFormatted, formatDate, isWithin7Days } from "@/lib/utils/date-helpers"

const statusColors = {
	pending: "bg-slate-500",
	in_progress: "bg-blue-500",
	completed: "bg-green-500",
	delayed: "bg-red-500",
}

const statusLabels = {
	pending: "Pendiente",
	in_progress: "En Progreso",
	completed: "Completado",
	delayed: "Retrasado",
}

interface TimelineGanttProps {
	projects: (Project & { clients: { name: string } })[]
}

export function TimelineGantt({ projects }: TimelineGanttProps) {
	const sortedProjects = useMemo(() => {
		return [...projects].sort((a, b) => {
			const dateA = new Date(a.due_date).getTime()
			const dateB = new Date(b.due_date).getTime()
			return dateA - dateB
		})
	}, [projects])

	const today = new Date()
	const minDate = useMemo(() => {
		if (sortedProjects.length === 0) return today
		const startDates = sortedProjects.map((p) => new Date(p.start_date).getTime())
		return new Date(Math.min(...startDates))
	}, [sortedProjects])

	const maxDate = useMemo(() => {
		if (sortedProjects.length === 0) return today
		const dueDates = sortedProjects.map((p) => new Date(p.due_date).getTime())
		return new Date(Math.max(...dueDates))
	}, [sortedProjects])

	const totalDays = useMemo(() => {
		const diff = maxDate.getTime() - minDate.getTime()
		return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
	}, [minDate, maxDate])

	const getProjectPosition = (startDate: Date, dueDate: Date) => {
		const startDiff = startDate.getTime() - minDate.getTime()
		const dueDiff = dueDate.getTime() - minDate.getTime()
		const startDays = Math.floor(startDiff / (1000 * 60 * 60 * 24))
		const dueDays = Math.floor(dueDiff / (1000 * 60 * 60 * 24))
		const width = dueDays - startDays + 1

		return {
			left: `${(startDays / totalDays) * 100}%`,
			width: `${(width / totalDays) * 100}%`,
		}
	}

	const getTodayPosition = () => {
		const todayDiff = today.getTime() - minDate.getTime()
		const todayDays = Math.floor(todayDiff / (1000 * 60 * 60 * 24))
		return `${(todayDays / totalDays) * 100}%`
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Vista de Línea de Tiempo (Gantt)</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{sortedProjects.map((project) => {
						const startDate = new Date(project.start_date)
						const dueDate = new Date(project.due_date)
						const position = getProjectPosition(startDate, dueDate)
						const hoursUntil = getHoursUntil(dueDate)
						const isUrgent = isWithin7Days(dueDate)
						const isOverdue = hoursUntil < 0

						return (
							<div key={project.id} className="relative">
								<div className="mb-2 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<h4 className="font-semibold">{project.name}</h4>
										<Badge variant="outline" className="text-xs">
											{project.clients.name}
										</Badge>
										{isUrgent && (
											<Badge variant="destructive" className="gap-1 text-xs">
												<AlertTriangle className="h-3 w-3" />
												Urgente
											</Badge>
										)}
										{isOverdue && (
											<Badge variant="destructive" className="gap-1 text-xs">
												<Clock className="h-3 w-3" />
												Vencido
											</Badge>
										)}
									</div>
									<div className="text-sm text-muted-foreground">
										{getTimeUntilFormatted(dueDate)}
									</div>
								</div>
								<div className="relative h-12 rounded-md border bg-muted/30 overflow-hidden">
									{/* Barra del proyecto */}
									<div
										className={`absolute top-0 h-full rounded-md ${
											isOverdue
												? "bg-red-500"
												: isUrgent
													? "bg-amber-500 animate-pulse"
													: statusColors[project.status]
										} transition-all`}
										style={{
											left: position.left,
											width: position.width,
										}}
									>
										<div className="flex h-full items-center justify-center px-2">
											<span className="text-xs font-medium text-white truncate">
												{statusLabels[project.status]}
											</span>
										</div>
									</div>
									{/* Indicador de hoy */}
									<div
										className="absolute top-0 h-full w-0.5 bg-primary"
										style={{ left: getTodayPosition() }}
									>
										<div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary" />
									</div>
								</div>
								<div className="mt-1 flex justify-between text-xs text-muted-foreground">
									<span>{formatDate(startDate)}</span>
									<span className={isUrgent || isOverdue ? "font-semibold text-destructive" : ""}>
										{formatDate(dueDate)}
									</span>
								</div>
							</div>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}

