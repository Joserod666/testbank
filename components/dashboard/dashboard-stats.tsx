import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, Clock, CheckCircle2 } from "lucide-react"

export async function DashboardStats() {
  const supabase = await createClient()

  // Obtener estadísticas en paralelo
  const [{ count: totalProjects }, { count: activeProjects }, { count: totalClients }, { count: completedProjects }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }).in("status", ["in_progress", "review"]),
      supabase.from("clients").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "completed"),
    ])

  const stats = [
    {
      title: "Proyectos Totales",
      value: totalProjects || 0,
      icon: Briefcase,
      description: "Todos los proyectos",
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "En Progreso",
      value: activeProjects || 0,
      icon: Clock,
      description: "Proyectos activos",
      gradient: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Clientes",
      value: totalClients || 0,
      icon: Users,
      description: "Total de clientes",
      gradient: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Completados",
      value: completedProjects || 0,
      icon: CheckCircle2,
      description: "Proyectos finalizados",
      gradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="border-0 shadow-md bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:shadow-lg"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">{stat.title}</CardTitle>
            <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
