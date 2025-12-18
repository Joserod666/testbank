"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil } from "lucide-react"
import type { Client, Project } from "@/lib/types"

export function EditProjectDialog({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const router = useRouter()

  useEffect(() => {
    if (open) {
      const supabase = createClient()
      supabase
        .from("clients")
        .select("*")
        .order("name")
        .then(({ data }) => {
          if (data) setClients(data)
        })
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { error } = await supabase
      .from("projects")
      .update({
        client_id: formData.get("client_id") as string,
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || null,
        status: formData.get("status") as string,
        priority: formData.get("priority") as string,
        start_date: formData.get("start_date") as string,
        due_date: formData.get("due_date") as string,
        completion_percentage: Number.parseInt(formData.get("completion_percentage") as string, 10),
        budget: formData.get("budget") ? Number.parseFloat(formData.get("budget") as string) : null,
      })
      .eq("id", project.id)

    setIsLoading(false)

		if (!error) {
			setOpen(false)
			router.refresh()
		} else {
			console.error("Error al actualizar proyecto:", error)
			alert(`Error al actualizar proyecto: ${error.message}`)
		}
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Proyecto</DialogTitle>
          <DialogDescription>Actualiza la información del proyecto</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Proyecto *</Label>
            <Input id="name" name="name" required defaultValue={project.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_id">Cliente *</Label>
            <Select name="client_id" required defaultValue={project.client_id}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                    {client.company && ` - ${client.company}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={project.description || ""}
              placeholder="Describe el proyecto..."
              rows={3}
            />
          </div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="status">Estado *</Label>
					<Select name="status" defaultValue={project.status} required>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="pending">Pendiente</SelectItem>
							<SelectItem value="in_progress">En Progreso</SelectItem>
							<SelectItem value="completed">Completado</SelectItem>
							<SelectItem value="delayed">Retrasado</SelectItem>
						</SelectContent>
					</Select>
				</div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad *</Label>
              <Select name="priority" defaultValue={project.priority} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="completion_percentage">Porcentaje de Completado</Label>
            <div className="flex items-center gap-4">
              <Input
                id="completion_percentage"
                name="completion_percentage"
                type="range"
                min="0"
                max="100"
                defaultValue={project.completion_percentage}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12">{project.completion_percentage}%</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">Fecha de Inicio *</Label>
              <Input id="start_date" name="start_date" type="date" required defaultValue={project.start_date} />
            </div>

						<div className="space-y-2">
							<Label htmlFor="due_date">Fecha de Vencimiento *</Label>
							<Input id="due_date" name="due_date" type="date" required defaultValue={project.due_date} />
						</div>
          </div>

					<div className="space-y-2">
						<Label htmlFor="budget">Presupuesto Estimado (USD)</Label>
						<Input
							id="budget"
							name="budget"
							type="number"
							step="0.01"
							defaultValue={project.budget || ""}
							placeholder="0.00"
						/>
					</div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
