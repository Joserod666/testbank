import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertCircle, Clock, CheckCircle } from "lucide-react"
import type { Project } from "@/lib/types"
import { getDaysUntil, getDateStatus, formatDate, getHoursUntil, getTimeUntilFormatted, isWithin7Days } from "@/lib/utils/date-helpers"
import { TimelineViewSelector } from "./timeline-view-selector"
import { TimelineTable } from "./timeline-table"

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

export async function TimelineView() {
  const supabase = await createClient()

	const { data: projects } = await supabase
		.from("projects")
		.select("*, clients(name)")
		.in("status", ["pending", "in_progress", "delayed"])
		.order("due_date", { ascending: true })

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

	const listView = (
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
	)

	return (
		<TimelineViewSelector
			projects={projects as (Project & { clients: { name: string } })[]}
			listView={listView}
		/>
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
					const hoursUntil = getHoursUntil(project.due_date)
					const daysUntil = getDaysUntil(project.due_date)
					const dateStatus = getDateStatus(project.due_date)
					const isUrgent = isWithin7Days(project.due_date)
					const isOverdue = hoursUntil < 0

					return (
						<Card
							key={project.id}
							className={`relative border-l-4 ${
								isOverdue
									? "border-l-red-500 bg-red-50/50 dark:bg-red-950/20"
									: isUrgent
										? "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-lg ring-2 ring-amber-500/20"
										: "border-l-primary"
							}`}
						>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1 space-y-2">
										<div className="flex items-center gap-2 flex-wrap">
											<CardTitle className="text-base">{project.name}</CardTitle>
											<div className={`h-2 w-2 rounded-full ${statusColors[project.status]}`} />
											<Badge variant="outline" className={priorityColors[project.priority]}>
												{priorityLabels[project.priority]}
											</Badge>
											{isUrgent && (
												<Badge variant="destructive" className="gap-1 text-xs">
													<AlertCircle className="h-3 w-3" />
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
										<p className="text-sm text-muted-foreground">{project.clients.name}</p>
									</div>
									<div className="text-right space-y-1">
										<div
											className={`text-sm font-semibold ${
												dateStatus === "overdue"
													? "text-red-600"
													: dateStatus === "urgent"
														? "text-amber-600"
														: "text-foreground"
											}`}
										>
											{getTimeUntilFormatted(project.due_date)}
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
