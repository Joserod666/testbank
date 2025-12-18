"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils/date-helpers"
import type { Project, Client } from "@/lib/types"
import { toast } from "sonner"

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

interface ProjectsTableProps {
	initialProjects: (Project & { clients: Client })[]
	initialClients: Client[]
}

export function ProjectsTable({ initialProjects, initialClients }: ProjectsTableProps) {
	const [projects, setProjects] = useState(initialProjects)
	const [clients] = useState(initialClients)
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [clientFilter, setClientFilter] = useState<string>("all")
	const [updatingId, setUpdatingId] = useState<string | null>(null)
	const router = useRouter()

	// Filtrar proyectos en el cliente para mejor rendimiento
	const filteredProjects = projects.filter((project) => {
		if (statusFilter !== "all" && project.status !== statusFilter) return false
		if (clientFilter !== "all" && project.client_id !== clientFilter) return false
		return true
	})

	async function handleMarkAsCompleted(projectId: string) {
		setUpdatingId(projectId)
		const supabase = createClient()

		const { error } = await supabase
			.from("projects")
			.update({ status: "completed", completion_percentage: 100 })
			.eq("id", projectId)

		setUpdatingId(null)

		if (error) {
			toast.error("Error al actualizar el proyecto")
		} else {
			toast.success("Proyecto marcado como completado")
			// Actualizar el estado local inmediatamente
			setProjects((prev) =>
				prev.map((p) => (p.id === projectId ? { ...p, status: "completed" as const, completion_percentage: 100 } : p))
			)
			router.refresh()
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Lista de Proyectos</CardTitle>
				<CardDescription>Todos tus proyectos con información detallada</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mb-6 flex flex-wrap gap-4">
					<div className="flex-1 min-w-[200px]">
						<label className="text-sm font-medium mb-2 block">Filtrar por Estado</label>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Todos los estados" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos los estados</SelectItem>
								<SelectItem value="pending">Pendiente</SelectItem>
								<SelectItem value="in_progress">En Progreso</SelectItem>
								<SelectItem value="completed">Completado</SelectItem>
								<SelectItem value="delayed">Retrasado</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex-1 min-w-[200px]">
						<label className="text-sm font-medium mb-2 block">Filtrar por Cliente</label>
						<Select value={clientFilter} onValueChange={setClientFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Todos los clientes" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos los clientes</SelectItem>
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
											{project.clients.company && (
												<span className="text-muted-foreground"> - {project.clients.company}</span>
											)}
										</TableCell>
										<TableCell>{formatDate(project.start_date)}</TableCell>
										<TableCell>{formatDate(project.due_date)}</TableCell>
										<TableCell>
											<Badge className={statusColors[project.status]}>{statusLabels[project.status]}</Badge>
										</TableCell>
										<TableCell>
											{project.budget ? `$${project.budget.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"}
										</TableCell>
										<TableCell className="text-right">
											{project.status !== "completed" && (
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleMarkAsCompleted(project.id)}
													disabled={updatingId === project.id}
													className="gap-2"
												>
													{updatingId === project.id ? (
														<>
															<Loader2 className="h-4 w-4 animate-spin" />
															Actualizando...
														</>
													) : (
														<>
															<CheckCircle2 className="h-4 w-4" />
															Marcar como Completado
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
			</CardContent>
		</Card>
	)
}

