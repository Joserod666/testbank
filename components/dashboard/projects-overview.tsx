import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/lib/types"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const statusColors = {
	pending: "bg-gradient-to-r from-slate-500 to-slate-600",
	in_progress: "bg-gradient-to-r from-blue-500 to-cyan-500",
	completed: "bg-gradient-to-r from-emerald-500 to-teal-500",
	delayed: "bg-gradient-to-r from-red-500 to-red-600",
}

const statusLabels = {
	pending: "Pendiente",
	in_progress: "En Progreso",
	completed: "Completado",
	delayed: "Retrasado",
}

export async function ProjectsOverview() {
  const supabase = await createClient()

	const { data: projects } = await supabase
		.from("projects")
		.select("*, clients(name)")
		.in("status", ["in_progress", "pending", "delayed"])
		.order("due_date", { ascending: true })
		.limit(5)

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          Proyectos Activos
        </CardTitle>
        <CardDescription>Tus proyectos en curso y próximos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projects && projects.length > 0 ? (
            projects.map((project: Project & { clients: { name: string } }) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-card to-card/50 p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ width: `${project.completion_percentage}%` }}
                />

                <div className="relative flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold leading-none">{project.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {statusLabels[project.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                      {project.clients.name}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {project.completion_percentage}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(project.due_date).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${statusColors[project.status]}`}
                    style={{ width: `${project.completion_percentage}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">No hay proyectos activos</p>
          )}
        </div>
        {projects && projects.length > 0 && (
          <Link
            href="/projects"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors group"
          >
            Ver todos los proyectos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
