/**
 * Script para cargar datos mock desde JSON a Supabase
 * Ejecutar con: npx tsx scripts/load-mock-data.ts
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { join } from "path"

const mockDataPath = join(process.cwd(), "data", "mock-data.json")
const mockData = JSON.parse(readFileSync(mockDataPath, "utf-8"))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY deben estar configurados")
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function loadMockData() {
	console.log("🔄 Cargando datos mock...\n")

	try {
		// 1. Cargar clientes
		console.log("📋 Cargando clientes...")
		const { data: clients, error: clientsError } = await supabase
			.from("clients")
			.insert(mockData.clients)
			.select()

		if (clientsError) {
			console.error("❌ Error al cargar clientes:", clientsError)
			return
		}

		console.log(`✅ ${clients?.length || 0} clientes cargados\n`)

		// 2. Cargar proyectos
		console.log("📋 Cargando proyectos...")
		const projectsToInsert = []

		for (const project of mockData.projects) {
			const client = clients?.find((c) => c.name === project.clientName)
			if (client) {
				projectsToInsert.push({
					client_id: client.id,
					name: project.name,
					description: project.description,
					status: project.status,
					priority: project.priority,
					start_date: project.start_date,
					due_date: project.due_date,
					completion_percentage: project.completion_percentage,
					budget: project.budget,
				})
			}
		}

		const { data: projects, error: projectsError } = await supabase
			.from("projects")
			.insert(projectsToInsert)
			.select()

		if (projectsError) {
			console.error("❌ Error al cargar proyectos:", projectsError)
			return
		}

		console.log(`✅ ${projects?.length || 0} proyectos cargados\n`)

		console.log("✅ Datos mock cargados exitosamente!")
		console.log(`   - Clientes: ${clients?.length || 0}`)
		console.log(`   - Proyectos: ${projects?.length || 0}`)
	} catch (error) {
		console.error("❌ Error general:", error)
	}
}

loadMockData()

