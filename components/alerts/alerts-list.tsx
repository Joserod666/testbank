import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Clock, AlertTriangle, Info, Bell } from "lucide-react"
import type { Alert } from "@/lib/types"
import { MarkAsReadButton } from "./mark-as-read-button"
import { DeleteAlertButton } from "./delete-alert-button"

const alertIcons = {
  deadline_approaching: Clock,
  overdue: AlertCircle,
  status_change: Info,
  custom: AlertTriangle,
}

const alertColors = {
  deadline_approaching: "text-amber-500 bg-amber-50 border-amber-200",
  overdue: "text-red-500 bg-red-50 border-red-200",
  status_change: "text-blue-500 bg-blue-50 border-blue-200",
  custom: "text-purple-500 bg-purple-50 border-purple-200",
}

const alertLabels = {
  deadline_approaching: "Vencimiento Próximo",
  overdue: "Vencido",
  status_change: "Cambio de Estado",
  custom: "Personalizado",
}

export async function AlertsList() {
  const supabase = await createClient()

  const { data: alerts } = await supabase
    .from("alerts")
    .select("*, projects(name, status, clients(name))")
    .order("created_at", { ascending: false })

  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No hay alertas</p>
          <p className="text-sm text-muted-foreground">
            Las alertas aparecerán aquí cuando haya proyectos próximos a vencer
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert: Alert & { projects: { name: string; status: string; clients: { name: string } } }) => {
        const Icon = alertIcons[alert.alert_type]

        return (
          <Card
            key={alert.id}
            className={`border-l-4 transition-colors ${alert.is_read ? "opacity-60" : ""} ${
              alertColors[alert.alert_type]
            }`}
          >
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                    alertColors[alert.alert_type]
                  }`}
                >
                  <Icon className={`h-5 w-5 ${alert.is_read ? "opacity-50" : ""}`} />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{alertLabels[alert.alert_type]}</h4>
                        {!alert.is_read && (
                          <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <p className={`text-sm ${alert.is_read ? "text-muted-foreground" : "text-foreground"}`}>
                        {alert.message}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {!alert.is_read && <MarkAsReadButton alertId={alert.id} />}
                      <DeleteAlertButton alertId={alert.id} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Proyecto: {alert.projects.name}</span>
                    <span>Cliente: {alert.projects.clients.name}</span>
                    <span>
                      {new Date(alert.created_at).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
