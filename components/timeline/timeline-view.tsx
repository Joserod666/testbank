"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, AlertCircle, Clock, CheckCircle, List, GanttChart, CalendarDays } from "lucide-react"
import type { Project } from "@/lib/types"
import { getDaysUntil, getDateStatus, formatDate } from "@/lib/utils/date-helpers"
import { TimelineCalendar } from "./timeline-calendar"
import { TimelineGantt } from "./timeline-gantt"

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

const priorityColors = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-blue-100 text-blue-700 border-blue-200",
  high: "bg-amber-100 text-amber-700 border-amber-200",
  urgent: "bg-red-100 text-red-700 border-red-200",
}

const priorityLabels = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
}

interface GroupedProjects {
  overdue: (Project & { clients: { name: string } })[]
  today: (Project & { clients: { name: string } })[]
  thisWeek: (Project & { clients: { name: string } })[]
  nextWeek: (Project & { clients: { name: string } })[]
  later: (Project & { clients: { name: string } })[]
}

interface TimelineViewProps {
	projects: (Project & { clients: { name: string } })[]
}

type ViewType = "list" | "calendar" | "gantt"

export function TimelineView({ projects: initialProjects }: TimelineViewProps) {
	const [viewType, setViewType] = useState<ViewType>("list")
	const projects = initialProjects.filter((p) => ["pending", "in_progress"].includes(p.status))

	if (!projects || projects.length === 0) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center justify-center py-12">
					<Calendar className="h-12 w-12 text-muted-foreground mb-4" />
					<p className="text-lg font-medium mb-2">No hay proyectos activos</p>
					<p className="text-sm text-muted-foreground">Crea proyectos para ver el timeline</p>
				</CardContent>
			</Card>
		)
	}

	// Agrupar proyectos por vencimiento
	const grouped: GroupedProjects = {
		overdue: [],
		today: [],
		thisWeek: [],
		nextWeek: [],
		later: [],
	}

	const today = new Date()
	today.setHours(0, 0, 0, 0)

	projects.forEach((project: Project & { clients: { name: string } }) => {
		const daysUntil = getDaysUntil(project.due_date)

		if (daysUntil < 0) {
			grouped.overdue.push(project)
		} else if (daysUntil === 0) {
			grouped.today.push(project)
		} else if (daysUntil <= 7) {
			grouped.thisWeek.push(project)
		} else if (daysUntil <= 14) {
			grouped.nextWeek.push(project)
		} else {
			grouped.later.push(project)
		}
	})

	function isUrgent(project: Project & { clients: { name: string } }): boolean {
		const daysUntil = getDaysUntil(project.due_date)
		return daysUntil >= 0 && daysUntil < 7
	}

	const urgentProjects = projects.filter(isUrgent)

	return (
		<div className="space-y-6">
			{/* Selector de vista y alerta de proyectos urgentes */}
			<div className="flex items-center justify-between flex-wrap gap-4">
				<div className="flex items-center gap-2">
					{urgentProjects.length > 0 && (
						<Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
							<CardContent className="py-3 px-4">
								<div className="flex items-center gap-2">
									<AlertCircle className="h-5 w-5 text-red-600" />
									<span className="text-sm font-medium text-red-900 dark:text-red-100">
										{urgentProjects.length} proyecto{urgentProjects.length !== 1 ? "s" : ""} próximo{urgentProjects.length !== 1 ? "s" : ""} a vencer (menos de 7 días)
									</span>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant={viewType === "list" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewType("list")}
					>
						<List className="h-4 w-4 mr-2" />
						Lista
					</Button>
					<Button
						variant={viewType === "calendar" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewType("calendar")}
					>
						<CalendarDays className="h-4 w-4 mr-2" />
						Calendario
					</Button>
					<Button
						variant={viewType === "gantt" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewType("gantt")}
					>
						<GanttChart className="h-4 w-4 mr-2" />
						Gantt
					</Button>
				</div>
			</div>

			{/* Vista según el tipo seleccionado */}
			{viewType === "calendar" && <TimelineCalendar projects={projects} />}
			{viewType === "gantt" && <TimelineGantt projects={projects} />}
			{viewType === "list" && (
				<div className="space-y-8">
      {/* Proyectos vencidos */}
      {grouped.overdue.length > 0 && (
        <TimelineSection
          title="Proyectos Vencidos"
          icon={<AlertCircle className="h-5 w-5 text-red-600" />}
          iconBgColor="bg-red-100"
          projects={grouped.overdue}
        />
      )}

      {/* Proyectos para hoy */}
      {grouped.today.length > 0 && (
        <TimelineSection
          title="Hoy"
          icon={<Calendar className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-100"
          projects={grouped.today}
        />
      )}

      {/* Esta semana */}
      {grouped.thisWeek.length > 0 && (
        <TimelineSection
          title="Esta Semana"
          icon={<Clock className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-100"
          projects={grouped.thisWeek}
        />
      )}

      {/* Próxima semana */}
      {grouped.nextWeek.length > 0 && (
        <TimelineSection
          title="Próxima Semana"
          icon={<Clock className="h-5 w-5 text-slate-600" />}
          iconBgColor="bg-slate-100"
          projects={grouped.nextWeek}
        />
      )}

      {/* Más adelante */}
      {grouped.later.length > 0 && (
        <TimelineSection
          title="Más Adelante"
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          iconBgColor="bg-green-100"
          projects={grouped.later}
        />
					)}
				</div>
			)}
		</div>
	)
}

function TimelineSection({
	title,
	icon,
	iconBgColor,
	projects,
}: {
	title: string
	icon: React.ReactNode
	iconBgColor: string
	projects: (Project & { clients: { name: string } })[]
}) {
	function isUrgent(project: Project & { clients: { name: string } }): boolean {
		const daysUntil = getDaysUntil(project.due_date)
		return daysUntil >= 0 && daysUntil < 7
	}

	return (
		<div>
			<div className="mb-4 flex items-center gap-3">
				<div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBgColor}`}>{icon}</div>
				<div>
					<h3 className="text-xl font-semibold">{title}</h3>
					<p className="text-sm text-muted-foreground">
						{projects.length} {projects.length === 1 ? "proyecto" : "proyectos"}
					</p>
				</div>
			</div>

			<div className="space-y-3 pl-[52px]">
				{projects.map((project) => {
					const daysUntil = getDaysUntil(project.due_date)
					const dateStatus = getDateStatus(project.due_date)
					const urgent = isUrgent(project)

					return (
						<Card
							key={project.id}
							className={`relative border-l-4 ${
								urgent
									? "border-l-red-500 bg-red-50 dark:bg-red-950/20 ring-2 ring-red-500/30"
									: "border-l-primary"
							}`}
						>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1 space-y-2">
										<div className="flex items-center gap-2 flex-wrap">
											<CardTitle className="text-base">{project.name}</CardTitle>
											{urgent && (
												<Badge variant="destructive" className="animate-pulse">
													<AlertCircle className="h-3 w-3 mr-1" />
													Urgente
												</Badge>
											)}
											<div className={`h-2 w-2 rounded-full ${statusColors[project.status]}`} />
											<Badge variant="outline" className={priorityColors[project.priority]}>
												{priorityLabels[project.priority]}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">{project.clients.name}</p>
									</div>
									<div className="text-right space-y-1">
										<div
											className={`text-sm font-medium ${
												urgent
													? "text-red-600 font-bold"
													: dateStatus === "overdue"
														? "text-red-600"
														: dateStatus === "urgent"
															? "text-amber-600"
															: "text-foreground"
											}`}
										>
											{daysUntil < 0
												? `${Math.abs(daysUntil)} días atrasado`
												: daysUntil === 0
													? "Hoy"
													: daysUntil === 1
														? "Mañana"
														: `${daysUntil} días`}
										</div>
										<p className="text-xs text-muted-foreground">{formatDate(project.due_date)}</p>
									</div>
								</div>
							</CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Inicio:</span>
                    <span className="font-medium">{formatDate(project.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Progreso:</span>
                    <span className="font-medium">{project.completion_percentage}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Estado:</span>
                    <span className="font-medium">{statusLabels[project.status]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
