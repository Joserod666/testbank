"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendiente" },
  { value: "in_progress", label: "En Progreso" },
  { value: "completed", label: "Completado" },
  { value: "delayed", label: "Retrasado" },
]

const priorityOptions = [
  { value: "all", label: "Todas" },
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
]

export function ProjectsFilters({ status, priority }: { status?: string; priority?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams)
    if (value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/projects?${params.toString()}`)
  }

  return (
    <div className="mb-6 space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Estado</h3>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={(!status && option.value === "all") || status === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("status", option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Prioridad</h3>
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map((option) => (
            <Button
              key={option.value}
              variant={(!priority && option.value === "all") || priority === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("priority", option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
