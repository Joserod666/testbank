import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Clock, AlertTriangle, Info } from "lucide-react"
import type { Alert } from "@/lib/types"
import Link from "next/link"

const alertIcons = {
  deadline_approaching: Clock,
  overdue: AlertCircle,
  status_change: Info,
  custom: AlertTriangle,
}

const alertColors = {
  deadline_approaching: "text-amber-500",
  overdue: "text-red-500",
  status_change: "text-blue-500",
  custom: "text-purple-500",
}

export async function RecentAlerts() {
  const supabase = await createClient()

  const { data: alerts } = await supabase
    .from("alerts")
    .select("*, projects(name)")
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas Recientes</CardTitle>
        <CardDescription>Notificaciones y recordatorios importantes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts && alerts.length > 0 ? (
            alerts.map((alert: Alert & { projects: { name: string } }) => {
              const Icon = alertIcons[alert.alert_type]
              return (
                <div key={alert.id} className="flex gap-3 rounded-lg border p-3">
                  <Icon className={`h-5 w-5 flex-shrink-0 ${alertColors[alert.alert_type]}`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm leading-snug">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.created_at).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">No hay alertas pendientes</p>
          )}
        </div>
        {alerts && alerts.length > 0 && (
          <Link href="/alerts" className="mt-4 block text-center text-sm text-primary hover:underline">
            Ver todas las alertas
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
