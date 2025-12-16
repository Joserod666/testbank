"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Loader2 } from "lucide-react"
import type { Project } from "@/lib/types"
import { formatDate } from "@/lib/utils/date-helpers"
import { toast } from "sonner"

interface ProjectsTableProps {
	projects: (Project & { clients: { name: string; company: string | null } })[]
	clients: { id: string; name: string }[]
}

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

export function ProjectsTable({ projects, clients }: ProjectsTableProps) {
	const router = useRouter()
	const [filterStatus, setFilterStatus] = useState<string>("all")
	const [filterClient, setFilterClient] = useState<string>("all")
	const [completingIds, setCompletingIds] = useState<Set<string>>(new Set())

	const filteredProjects = projects.filter((project) => {
		if (filterStatus !== "all" && project.status !== filterStatus) return false
		if (filterClient !== "all" && project.client_id !== filterClient) return false
		return true
	})

	async function markAsCompleted(projectId: string) {
		setCompletingIds((prev) => new Set(prev).add(projectId))
		const supabase = createClient()

		const { error } = await supabase
			.from("projects")
			.update({ status: "completed", completion_percentage: 100 })
			.eq("id", projectId)

		setCompletingIds((prev) => {
			const next = new Set(prev)
			next.delete(projectId)
			return next
		})

		if (error) {
			toast.error("Error al marcar el proyecto como completado")
		} else {
			toast.success("Proyecto marcado como completado")
			router.refresh()
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="flex-1">
					<label className="text-sm font-medium mb-2 block">Filtrar por Estado</label>
					<Select value={filterStatus} onValueChange={setFilterStatus}>
						<SelectTrigger>
							<SelectValue placeholder="Todos los estados" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todos</SelectItem>
							<SelectItem value="pending">Pendiente</SelectItem>
							<SelectItem value="in_progress">En Progreso</SelectItem>
							<SelectItem value="completed">Completado</SelectItem>
							<SelectItem value="delayed">Retrasado</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex-1">
					<label className="text-sm font-medium mb-2 block">Filtrar por Cliente</label>
					<Select value={filterClient} onValueChange={setFilterClient}>
						<SelectTrigger>
							<SelectValue placeholder="Todos los clientes" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todos</SelectItem>
							{clients.map((client) => (
								<SelectItem key={client.id} value={client.id}>
									{client.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nombre del Proyecto</TableHead>
							<TableHead>Cliente</TableHead>
							<TableHead>Fecha de Inicio</TableHead>
							<TableHead>Fecha de Vencimiento</TableHead>
							<TableHead>Estado</TableHead>
							<TableHead>Presupuesto Estimado</TableHead>
							<TableHead className="text-right">Acción</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredProjects.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
									No hay proyectos que coincidan con los filtros seleccionados
								</TableCell>
							</TableRow>
						) : (
							filteredProjects.map((project) => (
								<TableRow key={project.id}>
									<TableCell className="font-medium">{project.name}</TableCell>
									<TableCell>
										{project.clients.name}
										{project.clients.company && ` - ${project.clients.company}`}
									</TableCell>
									<TableCell>{formatDate(project.start_date)}</TableCell>
									<TableCell>{formatDate(project.due_date)}</TableCell>
									<TableCell>
										<Badge className={statusColors[project.status]}>{statusLabels[project.status]}</Badge>
									</TableCell>
									<TableCell>
										{project.budget ? `$${project.budget.toLocaleString()}` : "-"}
									</TableCell>
									<TableCell className="text-right">
										{project.status !== "completed" && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => markAsCompleted(project.id)}
												disabled={completingIds.has(project.id)}
											>
												{completingIds.has(project.id) ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<>
														<CheckCircle2 className="h-4 w-4 mr-2" />
														Completar
													</>
												)}
											</Button>
										)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

