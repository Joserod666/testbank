import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Bell } from "lucide-react"

export async function AlertsStats() {
  const supabase = await createClient()

  const [{ count: totalAlerts }, { count: unreadAlerts }, { count: overdueAlerts }] = await Promise.all([
    supabase.from("alerts").select("*", { count: "exact", head: true }),
    supabase.from("alerts").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase
      .from("alerts")
      .select("*", { count: "exact", head: true })
      .eq("alert_type", "overdue")
      .eq("is_read", false),
  ])

  const stats = [
    {
      title: "Total Alertas",
      value: totalAlerts || 0,
      icon: Bell,
      description: "Todas las alertas",
    },
    {
      title: "Sin Leer",
      value: unreadAlerts || 0,
      icon: AlertCircle,
      description: "Alertas pendientes",
    },
    {
      title: "Proyectos Vencidos",
      value: overdueAlerts || 0,
      icon: CheckCircle,
      description: "Requieren atención",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
