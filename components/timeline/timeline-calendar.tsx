"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock } from "lucide-react"
import type { Project } from "@/lib/types"
import { getHoursUntil, getTimeUntilFormatted, formatDate, isWithin7Days } from "@/lib/utils/date-helpers"

const statusColors = {
	pending: "bg-slate-500 text-white",
	in_progress: "bg-blue-500 text-white",
	completed: "bg-green-500 text-white",
	delayed: "bg-red-500 text-white",
}

const statusLabels = {
	pending: "Pendiente",
	in_progress: "En Progreso",
	completed: "Completado",
	delayed: "Retrasado",
}

interface TimelineCalendarProps {
	projects: (Project & { clients: { name: string } })[]
}

export function TimelineCalendar({ projects }: TimelineCalendarProps) {
	const projectsByDate = useMemo(() => {
		const grouped: Record<string, (Project & { clients: { name: string } })[]> = {}

		projects.forEach((project) => {
			const dueDate = new Date(project.due_date)
			const dateKey = dueDate.toISOString().split("T")[0]

			if (!grouped[dateKey]) {
				grouped[dateKey] = []
			}
			grouped[dateKey].push(project)
		})

		return grouped
	}, [projects])

	const sortedDates = useMemo(() => {
		return Object.keys(projectsByDate).sort()
	}, [projectsByDate])

	const today = new Date().toISOString().split("T")[0]

	return (
		<Card>
			<CardHeader>
				<CardTitle>Vista de Calendario</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{sortedDates.map((dateKey) => {
						const dateProjects = projectsByDate[dateKey]
						const date = new Date(dateKey)
						const isToday = dateKey === today
						const hasUrgentProjects = dateProjects.some((p) => isWithin7Days(p.due_date))

						return (
							<div key={dateKey} className="space-y-3">
								<div className={`flex items-center gap-3 ${isToday ? "font-bold" : ""}`}>
									<div
										className={`flex h-10 w-10 items-center justify-center rounded-lg ${
											isToday ? "bg-primary text-primary-foreground" : "bg-muted"
										}`}
									>
										{date.getDate()}
									</div>
									<div>
										<h3 className="text-lg font-semibold">
											{date.toLocaleDateString("es-ES", {
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</h3>
										{isToday && <p className="text-sm text-primary">Hoy</p>}
									</div>
								</div>

								<div className="space-y-2 pl-[52px]">
									{dateProjects.map((project) => {
										const hoursUntil = getHoursUntil(project.due_date)
										const isUrgent = isWithin7Days(project.due_date)
										const isOverdue = hoursUntil < 0

										return (
											<div
												key={project.id}
												className={`rounded-lg border p-4 transition-all ${
													isUrgent || isOverdue
														? "border-destructive bg-destructive/5 shadow-lg ring-2 ring-destructive/20"
														: "bg-card"
												}`}
											>
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1 space-y-2">
														<div className="flex items-center gap-2 flex-wrap">
															<h4 className="font-semibold">{project.name}</h4>
															<Badge className={statusColors[project.status]}>{statusLabels[project.status]}</Badge>
															{isUrgent && (
																<Badge variant="destructive" className="gap-1">
																	<AlertTriangle className="h-3 w-3" />
																	Menos de 7 días
																</Badge>
															)}
															{isOverdue && (
																<Badge variant="destructive" className="gap-1">
																	<Clock className="h-3 w-3" />
																	Vencido
																</Badge>
															)}
														</div>
														<p className="text-sm text-muted-foreground">{project.clients.name}</p>
														<div className="flex items-center gap-4 text-sm">
															<span className="text-muted-foreground">
																Inicio: <span className="font-medium">{formatDate(project.start_date)}</span>
															</span>
															<span className="text-muted-foreground">
																Progreso: <span className="font-medium">{project.completion_percentage}%</span>
															</span>
														</div>
													</div>
													<div className="text-right">
														<div
															className={`text-sm font-semibold ${
																isOverdue ? "text-destructive" : isUrgent ? "text-amber-600" : "text-muted-foreground"
															}`}
														>
															{getTimeUntilFormatted(project.due_date)}
														</div>
														<div className="text-xs text-muted-foreground">{formatDate(project.due_date)}</div>
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}
