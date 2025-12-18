import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDaysUntil, getDateStatus } from "@/lib/utils/date-helpers"
import type { Project } from "@/lib/types"

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

export async function UpcomingDeadlines() {
  const supabase = await createClient()

  const today = new Date().toISOString().split("T")[0]
  const nextWeek = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const { data: projects } = await supabase
    .from("projects")
    .select("*, clients(name)")
    .gte("due_date", today)
    .lte("due_date", nextWeek)
    .in("status", ["planning", "in_progress", "review"])
    .order("due_date", { ascending: true })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Vencimientos</CardTitle>
        <CardDescription>Proyectos que vencen en los próximos 14 días</CardDescription>
      </CardHeader>
      <CardContent>
        {projects && projects.length > 0 ? (
          <div className="space-y-3">
            {projects.map((project: Project & { clients: { name: string } }) => {
              const daysUntil = getDaysUntil(project.due_date)
              const dateStatus = getDateStatus(project.due_date)

              return (
                <div key={project.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{project.name}</h4>
                      <Badge variant="outline" className={priorityColors[project.priority]}>
                        {priorityLabels[project.priority]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.clients.name}</p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        dateStatus === "overdue"
                          ? "text-red-600"
                          : dateStatus === "urgent"
                            ? "text-amber-600"
                            : "text-foreground"
                      }`}
                    >
                      {daysUntil === 0 ? "Hoy" : daysUntil === 1 ? "Mañana" : `${daysUntil} días`}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(project.due_date).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-8">No hay proyectos próximos a vencer</p>
        )}
      </CardContent>
    </Card>
  )
}
