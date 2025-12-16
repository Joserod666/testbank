import { createClient } from "@/lib/supabase/server"
import { ProjectsTable } from "./projects-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export async function ProjectsTableWrapper() {
	const supabase = await createClient()

	const [{ data: projects }, { data: clients }] = await Promise.all([
		supabase
			.from("projects")
			.select("*, clients(name, company)")
			.order("due_date", { ascending: true }),
		supabase.from("clients").select("id, name").order("name"),
	])

	return (
		<Card className="border-0 shadow-md overflow-hidden">
			<div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />
			<CardHeader>
				<CardTitle>Lista de Proyectos</CardTitle>
				<CardDescription>Gestiona y filtra todos tus proyectos</CardDescription>
			</CardHeader>
			<CardContent>
				<ProjectsTable
					projects={(projects || []) as any}
					clients={(clients || []) as { id: string; name: string }[]}
				/>
			</CardContent>
		</Card>
	)
}

