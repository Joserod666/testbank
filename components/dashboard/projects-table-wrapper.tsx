import { createClient } from "@/lib/supabase/server"
import { ProjectsTable } from "./projects-table"
import type { Project, Client } from "@/lib/types"

export async function ProjectsTableWrapper() {
	const supabase = await createClient()

	const [projectsResult, clientsResult] = await Promise.all([
		supabase.from("projects").select("*, clients(*)").order("due_date", { ascending: true }),
		supabase.from("clients").select("*").order("name"),
	])

	const projects = (projectsResult.data || []) as (Project & { clients: Client })[]
	const clients = (clientsResult.data || []) as Client[]

	return <ProjectsTable initialProjects={projects} initialClients={clients} />
}

