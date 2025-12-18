"use client"

import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface TimelineTableProps {
	projects: (Project & { clients: { name: string } })[]
}

export function TimelineTable({ projects }: TimelineTableProps) {
	const sortedProjects = useMemo(() => {
		return [...projects].sort((a, b) => {
			const dateA = new Date(a.due_date).getTime()
			const dateB = new Date(b.due_date).getTime()
			return dateA - dateB
		})
	}, [projects])

	return (
		<Card>
			<CardHeader>
				<CardTitle>Línea de Tiempo de Proyectos</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Proyecto</TableHead>
								<TableHead>Cliente</TableHead>
								<TableHead>Fecha de Inicio</TableHead>
								<TableHead>Fecha de Vencimiento</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Progreso</TableHead>
								<TableHead>Tiempo Restante</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedProjects.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
										No hay proyectos activos
									</TableCell>
								</TableRow>
							) : (
								sortedProjects.map((project) => {
									const hoursUntil = getHoursUntil(project.due_date)
									const isUrgent = isWithin7Days(project.due_date)
									const isOverdue = hoursUntil < 0
									const timeUntil = getTimeUntilFormatted(project.due_date)

									// Formato condicional para resaltar proyectos próximos a vencer
									const rowClassName = isOverdue
										? "bg-red-50 dark:bg-red-950/20 border-l-4 border-l-red-500"
										: isUrgent
											? "bg-amber-50 dark:bg-amber-950/20 border-l-4 border-l-amber-500"
											: ""

									return (
										<TableRow key={project.id} className={rowClassName}>
											<TableCell className="font-medium">{project.name}</TableCell>
											<TableCell>{project.clients.name}</TableCell>
											<TableCell>{formatDate(project.start_date)}</TableCell>
											<TableCell>
												<span
													className={
														isOverdue
															? "font-semibold text-red-600"
															: isUrgent
																? "font-semibold text-amber-600"
																: ""
													}
												>
													{formatDate(project.due_date)}
												</span>
											</TableCell>
											<TableCell>
												<Badge className={statusColors[project.status]}>{statusLabels[project.status]}</Badge>
											</TableCell>
											<TableCell>{project.completion_percentage}%</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													{isUrgent && <AlertTriangle className="h-4 w-4 text-amber-600" />}
													{isOverdue && <Clock className="h-4 w-4 text-red-600" />}
													<span
														className={
															isOverdue
																? "font-semibold text-red-600"
																: isUrgent
																	? "font-semibold text-amber-600"
																	: ""
														}
													>
														{timeUntil}
													</span>
												</div>
											</TableCell>
										</TableRow>
									)
								})
							)}
						</TableBody>
					</Table>
				</div>

				{/* Leyenda */}
				<div className="mt-4 flex flex-wrap gap-4 text-sm">
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded border-l-4 border-l-red-500 bg-red-50"></div>
						<span>Proyecto vencido</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded border-l-4 border-l-amber-500 bg-amber-50"></div>
						<span>Vence en menos de 7 días</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

