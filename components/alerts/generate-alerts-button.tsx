"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Bell, Loader2 } from "lucide-react"

export function GenerateAlertsButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function generateAlerts() {
    setIsLoading(true)
    const supabase = createClient()

    // Obtener proyectos activos
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .in("status", ["pending", "in_progress"])

    if (projects) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (const project of projects) {
        const dueDate = new Date(project.due_date)
        dueDate.setHours(0, 0, 0, 0)
        const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        // Verificar si ya existe una alerta reciente para este proyecto
        const { data: existingAlerts } = await supabase
          .from("alerts")
          .select("*")
          .eq("project_id", project.id)
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

        if (existingAlerts && existingAlerts.length > 0) continue

        // Generar alerta según el estado
        let alertType: "deadline_approaching" | "overdue" | null = null
        let message = ""

        if (daysUntil < 0) {
          alertType = "overdue"
          message = `El proyecto "${project.name}" está vencido desde hace ${Math.abs(daysUntil)} días`
        } else if (daysUntil <= 3) {
          alertType = "deadline_approaching"
          message = `El proyecto "${project.name}" vence en ${daysUntil} ${daysUntil === 1 ? "día" : "días"}`
        }

        if (alertType) {
          await supabase.from("alerts").insert({
            project_id: project.id,
            alert_type: alertType,
            message,
            is_read: false,
          })
        }
      }
    }

    setIsLoading(false)
    router.refresh()
  }

  return (
    <Button onClick={generateAlerts} disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bell className="mr-2 h-4 w-4" />}
      {isLoading ? "Generando..." : "Generar Alertas"}
    </Button>
  )
}
