/**
 * Servicio para verificar y enviar alertas de proyectos próximos a vencer
 */

import { createClient as createBrowserClient } from "@supabase/supabase-js"
import { emailService } from "./email-service"

interface ProjectAlert {
	id: string
	name: string
	due_date: string
	client_name: string
	client_email: string | null
	daysUntil: number
}

interface AlertCheckResult {
	checked: number
	alertsSent: number
	projects: ProjectAlert[]
	errors: string[]
}

/**
 * Verifica proyectos que vencen en 3 días o menos y envía alertas
 */
export async function checkAndSendProjectAlerts(
	recipientEmail?: string,
	daysThreshold: number = 3
): Promise<AlertCheckResult> {
	const result: AlertCheckResult = {
		checked: 0,
		alertsSent: 0,
		projects: [],
		errors: [],
	}

	try {
		// Validar que las variables de entorno estén disponibles
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
		const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

		if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === "" || supabaseAnonKey === "") {
			// Solo mostrar advertencia en desarrollo, no en producción
			if (process.env.NODE_ENV === "development") {
				console.warn(
					"⚠️ Variables de entorno de Supabase no disponibles. Verifica que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén en .env.local y reinicia el servidor."
				)
			}
			// Retornar resultado vacío sin errores visibles
			return result
		}

		// Usar cliente directo de Supabase (sin cookies) para evitar errores fuera del contexto de solicitud
		// Las alertas solo necesitan leer datos públicos, no requieren autenticación de usuario
		const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

		// Obtener proyectos activos
		console.log("🔍 Consultando proyectos activos desde Supabase...")
		const { data: projects, error: projectsError } = await supabase
			.from("projects")
			.select("*, clients(name, email)")
			.in("status", ["pending", "in_progress"])
			.order("due_date", { ascending: true })

		if (projectsError) {
			console.error("❌ Error al consultar proyectos:", projectsError)
		} else {
			console.log(`✅ Proyectos obtenidos de la base de datos: ${projects?.length || 0}`)
		}

		if (projectsError) {
			result.errors.push(`Error al obtener proyectos: ${projectsError.message}`)
			return result
		}

		if (!projects || projects.length === 0) {
			return result
		}

		result.checked = projects.length

		console.log(`🔍 Verificando ${projects.length} proyecto(s) activo(s) para alertas...`)
		console.log(`📅 Umbral configurado: ${daysThreshold} días o menos`)

		const today = new Date()
		today.setHours(0, 0, 0, 0)
		console.log(`📅 Fecha de hoy: ${today.toISOString().split("T")[0]}`)

		// Filtrar proyectos que vencen en 3 días o menos
		const urgentProjects: ProjectAlert[] = []

		for (const project of projects) {
			// Verificar formato de fecha
			if (!project.due_date) {
				console.log(`  ⚠️  Proyecto "${project.name}" no tiene fecha de vencimiento`)
				continue
			}

			const dueDate = new Date(project.due_date)
			
			// Verificar si la fecha es válida
			if (isNaN(dueDate.getTime())) {
				console.log(`  ⚠️  Proyecto "${project.name}" tiene fecha inválida: ${project.due_date}`)
				continue
			}

			dueDate.setHours(0, 0, 0, 0)
			const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

			const isUrgent = daysUntil <= daysThreshold
			console.log(
				`  📋 Proyecto: "${project.name}" | Estado: ${project.status} | Vence: ${project.due_date} (${dueDate.toISOString().split("T")[0]}) | Días restantes: ${daysUntil} | ¿Urgente? ${isUrgent ? "✅ SÍ" : "❌ NO"} (umbral: ${daysThreshold})`
			)

			if (isUrgent) {
				console.log(`  ⚠️  Proyecto urgente detectado: "${project.name}" (${daysUntil} días)`)
				urgentProjects.push({
					id: project.id,
					name: project.name,
					due_date: project.due_date,
					client_name: (project.clients as any)?.name || "Cliente desconocido",
					client_email: (project.clients as any)?.email || null,
					daysUntil,
				})
			} else {
				console.log(
					`  ℹ️  Proyecto no urgente: "${project.name}" (requiere ${daysThreshold} días o menos, tiene ${daysUntil} días)`
				)
			}
		}

		result.projects = urgentProjects
		console.log(`📊 Total de proyectos urgentes encontrados: ${urgentProjects.length}`)

		// Enviar alertas por correo
		const emailToUse = recipientEmail || process.env.ALERT_EMAIL || "admin@example.com"
		console.log("\n" + "=".repeat(80))
		console.log("📧 INICIANDO ENVÍO DE ALERTAS POR CORREO")
		console.log("=".repeat(80))
		console.log(`📬 Destinatario configurado: ${emailToUse}`)
		console.log(`📊 Total de proyectos que requieren alerta: ${urgentProjects.length}`)
		console.log("=".repeat(80) + "\n")

		for (const project of urgentProjects) {
			console.log("\n" + "-".repeat(80))
			console.log(`📨 PROCESANDO ALERTA #${urgentProjects.indexOf(project) + 1}/${urgentProjects.length}`)
			console.log(`   Proyecto: "${project.name}"`)
			console.log(`   Cliente: ${project.client_name}`)
			console.log(`   Días hasta vencimiento: ${project.daysUntil}`)
			console.log(`   Fecha de vencimiento: ${project.due_date}`)
			console.log("-".repeat(80))
			try {
				const { subject, html, text } = emailService.generateProjectAlertEmail({
					name: project.name,
					due_date: project.due_date,
					client_name: project.client_name,
					daysUntil: project.daysUntil,
				})

				const emailResult = await emailService.sendEmail({
					to: emailToUse,
					subject,
					html,
					text,
				})

				if (emailResult.success) {
					result.alertsSent++
					console.log(`  ✅ Alerta procesada exitosamente para: "${project.name}"`)
					console.log(`     → Simulación registrada en consola/log`)
					if (!emailService["isSimulation"]) {
						console.log(`     → Correo real enviado al destinatario`)
					}

					// Crear alerta en la base de datos si no existe
					const { data: existingAlerts } = await supabase
						.from("alerts")
						.select("*")
						.eq("project_id", project.id)
						.eq("alert_type", project.daysUntil < 0 ? "overdue" : "deadline_approaching")
						.gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

					if (!existingAlerts || existingAlerts.length === 0) {
						await supabase.from("alerts").insert({
							project_id: project.id,
							alert_type: project.daysUntil < 0 ? "overdue" : "deadline_approaching",
							message: project.daysUntil < 0
								? `El proyecto "${project.name}" está vencido desde hace ${Math.abs(project.daysUntil)} días`
								: `El proyecto "${project.name}" vence en ${project.daysUntil} ${project.daysUntil === 1 ? "día" : "días"}`,
							is_read: false,
						})
					}
				} else {
					result.errors.push(`Error al enviar correo para "${project.name}": ${emailResult.error}`)
				}
			} catch (error) {
				result.errors.push(
					`Error al procesar alerta para "${project.name}": ${error instanceof Error ? error.message : "Error desconocido"}`
				)
			}
		}
	} catch (error) {
		result.errors.push(`Error general: ${error instanceof Error ? error.message : "Error desconocido"}`)
	}

	// Resumen final de la verificación
	console.log("\n" + "=".repeat(80))
	console.log("📊 RESUMEN FINAL DE VERIFICACIÓN DE ALERTAS")
	console.log("=".repeat(80))
	console.log(`✅ Proyectos verificados: ${result.checked}`)
	console.log(`⚠️  Proyectos urgentes encontrados: ${result.projects.length}`)
	console.log(`📧 Alertas procesadas: ${result.alertsSent}`)
	console.log(`   → Todas las alertas fueron registradas en consola/log como evidencia`)
	if (result.errors.length > 0) {
		console.log(`❌ Errores encontrados: ${result.errors.length}`)
		result.errors.forEach((error) => console.log(`   - ${error}`))
	}
	console.log("=".repeat(80) + "\n")

	return result
}

