import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Building2, DollarSign } from "lucide-react"
import type { Project } from "@/lib/types"
import { getDaysUntil, getDateStatus, formatDate } from "@/lib/utils/date-helpers"
import { EditProjectDialog } from "./edit-project-dialog"
import { DeleteProjectDialog } from "./delete-project-dialog"

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

export async function ProjectsList({ status, priority }: { status?: string; priority?: string }) {
  const supabase = await createClient()

  let query = supabase.from("projects").select("*, clients(name, company)").order("due_date", { ascending: true })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (priority && priority !== "all") {
    query = query.eq("priority", priority)
  }

  const { data: projects } = await query

  if (!projects || projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No hay proyectos que coincidan</p>
          <p className="text-sm text-muted-foreground">Intenta cambiar los filtros o crea un nuevo proyecto</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project: Project & { clients: { name: string; company: string | null } }) => {
        const daysUntil = getDaysUntil(project.due_date)
        const dateStatus = getDateStatus(project.due_date)

        return (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <Badge className={statusColors[project.status]}>{statusLabels[project.status]}</Badge>
                    <Badge variant="outline" className={priorityColors[project.priority]}>
                      {priorityLabels[project.priority]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>
                      {project.clients.name}
                      {project.clients.company && ` - ${project.clients.company}`}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <EditProjectDialog project={project} />
                  <DeleteProjectDialog projectId={project.id} projectName={project.name} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium">{project.completion_percentage}%</span>
                </div>
                <Progress value={project.completion_percentage} className="h-2" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Inicio</span>
                  </div>
                  <p className="text-sm font-medium">{formatDate(project.start_date)}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Entrega</span>
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      dateStatus === "overdue"
                        ? "text-red-600"
                        : dateStatus === "urgent"
                          ? "text-amber-600"
                          : "text-foreground"
                    }`}
                  >
                    {formatDate(project.due_date)}
                    {project.status !== "completed" && (
                      <span className="ml-2">
                        (
                        {daysUntil < 0
                          ? `${Math.abs(daysUntil)} días atrasado`
                          : daysUntil === 0
                            ? "Hoy"
                            : `${daysUntil} días`}
                        )
                      </span>
                    )}
                  </p>
                </div>

                {project.budget && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Presupuesto</span>
                    </div>
                    <p className="text-sm font-medium">${project.budget.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
