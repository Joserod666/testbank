/**
 * Servicio para verificar y enviar alertas de proyectos próximos a vencer
 */

import { createClient } from "@/lib/supabase/server"
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
		const supabase = await createClient()

		// Obtener proyectos activos
		const { data: projects, error: projectsError } = await supabase
			.from("projects")
			.select("*, clients(name, email)")
			.in("status", ["pending", "in_progress"])
			.order("due_date", { ascending: true })

		if (projectsError) {
			result.errors.push(`Error al obtener proyectos: ${projectsError.message}`)
			return result
		}

		if (!projects || projects.length === 0) {
			return result
		}

		result.checked = projects.length

		const today = new Date()
		today.setHours(0, 0, 0, 0)

		// Filtrar proyectos que vencen en 3 días o menos
		const urgentProjects: ProjectAlert[] = []

		for (const project of projects) {
			const dueDate = new Date(project.due_date)
			dueDate.setHours(0, 0, 0, 0)
			const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

			if (daysUntil <= daysThreshold) {
				urgentProjects.push({
					id: project.id,
					name: project.name,
					due_date: project.due_date,
					client_name: (project.clients as any)?.name || "Cliente desconocido",
					client_email: (project.clients as any)?.email || null,
					daysUntil,
				})
			}
		}

		result.projects = urgentProjects

		// Enviar alertas por correo
		const emailToUse = recipientEmail || process.env.ALERT_EMAIL || "admin@example.com"

		for (const project of urgentProjects) {
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

	return result
}

