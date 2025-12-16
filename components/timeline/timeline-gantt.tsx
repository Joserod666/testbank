"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import type { Project } from "@/lib/types"
import { getDaysUntil, formatDate } from "@/lib/utils/date-helpers"

interface TimelineGanttProps {
	projects: (Project & { clients: { name: string } })[]
}

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

export function TimelineGantt({ projects }: TimelineGanttProps) {
	const today = new Date()
	today.setHours(0, 0, 0, 0)

	// Calcular el rango de fechas
	const allDates = projects.flatMap((p) => [new Date(p.start_date), new Date(p.due_date)])
	const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
	const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())))

	// Ajustar para mostrar al menos 30 días
	const daysDiff = Math.max(30, Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)))
	const rangeStart = new Date(minDate)
	rangeStart.setDate(rangeStart.getDate() - 7)
	const rangeEnd = new Date(rangeStart)
	rangeEnd.setDate(rangeEnd.getDate() + daysDiff + 14)

	const totalDays = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24))

	function getProjectPosition(project: Project & { clients: { name: string } }) {
		const startDate = new Date(project.start_date)
		const endDate = new Date(project.due_date)

		const startOffset = Math.ceil((startDate.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24))
		const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

		return {
			left: (startOffset / totalDays) * 100,
			width: (duration / totalDays) * 100,
		}
	}

	function isUrgent(project: Project & { clients: { name: string } }): boolean {
		const daysUntil = getDaysUntil(project.due_date)
		return daysUntil >= 0 && daysUntil < 7
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Vista Gantt</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Timeline header */}
					<div className="relative h-8 border-b-2 border-primary/20">
						{Array.from({ length: Math.min(30, totalDays) }).map((_, i) => {
							const date = new Date(rangeStart)
							date.setDate(date.getDate() + Math.floor((i * totalDays) / Math.min(30, totalDays)))
							const isToday =
								date.toDateString() === today.toDateString()

							return (
								<div
									key={i}
									className={`absolute top-0 bottom-0 border-l ${
										isToday ? "border-primary border-l-2" : "border-muted"
									}`}
									style={{ left: `${(i / Math.min(30, totalDays)) * 100}%` }}
								>
									{isToday && (
										<div className="absolute -top-6 left-0 text-xs font-medium text-primary">
											Hoy
										</div>
									)}
								</div>
							)
						})}
					</div>

					{/* Projects */}
					<div className="space-y-3">
						{projects.map((project) => {
							const position = getProjectPosition(project)
							const urgent = isUrgent(project)
							const daysUntil = getDaysUntil(project.due_date)

							return (
								<div key={project.id} className="relative h-16">
									<div className="flex items-center gap-4 h-full">
										<div className="w-48 flex-shrink-0">
											<div className="flex items-center gap-2">
												<span className="font-medium text-sm truncate">{project.name}</span>
												{urgent && (
													<Badge variant="destructive" className="text-xs">
														<AlertTriangle className="h-3 w-3 mr-1" />
														{daysUntil}d
													</Badge>
												)}
											</div>
											<p className="text-xs text-muted-foreground truncate">
												{project.clients.name}
											</p>
										</div>
										<div className="flex-1 relative h-8">
											<div
												className={`absolute h-full rounded-md flex items-center justify-center text-xs font-medium text-white ${
													urgent
														? "bg-red-500 ring-2 ring-red-600 ring-offset-2 animate-pulse"
														: statusColors[project.status]
												}`}
												style={{
													left: `${position.left}%`,
													width: `${Math.max(position.width, 2)}%`,
													minWidth: "40px",
												}}
												title={`${project.name} - ${formatDate(project.start_date)} a ${formatDate(project.due_date)}`}
											>
												{position.width > 5 && (
													<span className="px-2 truncate">{project.name}</span>
												)}
											</div>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

