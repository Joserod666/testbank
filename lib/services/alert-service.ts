import { createAdminClient } from "@/lib/supabase/admin"
import type { Project } from "@/lib/types"
import { getHoursUntil, formatDate, getTimeUntilFormatted } from "@/lib/utils/date-helpers"

interface AlertProject extends Project {
	clients: {
		name: string
		email: string | null
	}
}

/**
 * Verifica proyectos que vencen en 3 días o menos
 */
export async function checkUpcomingDeadlines() {
	const supabase = createAdminClient()

	const { data: projects } = await supabase
		.from("projects")
		.select("*, clients(name, email)")
		.in("status", ["pending", "in_progress", "delayed"])
		.order("due_date", { ascending: true })

	if (!projects || projects.length === 0) {
		return []
	}

	const urgentProjects: AlertProject[] = []

	projects.forEach((project: AlertProject) => {
		const hoursUntil = getHoursUntil(project.due_date)
		// Proyectos que vencen en 3 días (72 horas) o menos
		if (hoursUntil >= 0 && hoursUntil <= 72) {
			urgentProjects.push(project)
		}
	})

	return urgentProjects
}

/**
 * Envía alerta por consola (simulado)
 */
export function sendConsoleAlert(project: AlertProject) {
	const hoursUntil = getHoursUntil(project.due_date)
	const timeUntil = getTimeUntilFormatted(project.due_date)

	console.log("=".repeat(80))
	console.log("🚨 ALERTA: Proyecto próximo a vencer")
	console.log("=".repeat(80))
	console.log(`Proyecto: ${project.name}`)
	console.log(`Cliente: ${project.clients.name}`)
	console.log(`Fecha de vencimiento: ${formatDate(project.due_date)}`)
	console.log(`Tiempo restante: ${timeUntil}`)
	console.log(`Horas restantes: ${hoursUntil} horas`)
	console.log(`Estado: ${project.status}`)
	console.log(`Progreso: ${project.completion_percentage}%`)
	console.log("=".repeat(80))
}

/**
 * Envía alerta por email usando Resend (real)
 */
export async function sendEmailAlert(project: AlertProject) {
	const hoursUntil = getHoursUntil(project.due_date)
	const timeUntil = getTimeUntilFormatted(project.due_date)

	// Verificar que Resend esté configurado
	const resendApiKey = process.env.RESEND_API_KEY
	const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@example.com"

	if (!resendApiKey) {
		console.warn("⚠️ RESEND_API_KEY no configurada. Saltando envío de email real.")
		return { success: false, error: "RESEND_API_KEY no configurada" }
	}

	try {
		// Importar Resend dinámicamente
		const resendModule = await import("resend")
		const Resend = resendModule.Resend || (resendModule as any).default?.Resend || (resendModule as any).default
		
		if (!Resend) {
			throw new Error("No se pudo importar Resend correctamente")
		}
		
		const resend = new Resend(resendApiKey)

		const emailContent = `
			<h2>🚨 Alerta: Proyecto próximo a vencer</h2>
			<p>El siguiente proyecto está próximo a vencer:</p>
			<ul>
				<li><strong>Proyecto:</strong> ${project.name}</li>
				<li><strong>Cliente:</strong> ${project.clients.name}</li>
				<li><strong>Fecha de vencimiento:</strong> ${formatDate(project.due_date)}</li>
				<li><strong>Tiempo restante:</strong> ${timeUntil}</li>
				<li><strong>Horas restantes:</strong> ${hoursUntil} horas</li>
				<li><strong>Estado:</strong> ${project.status}</li>
				<li><strong>Progreso:</strong> ${project.completion_percentage}%</li>
			</ul>
			<p>Por favor, revisa el proyecto y toma las acciones necesarias.</p>
		`

		// Obtener email del cliente o usar email por defecto
		const toEmail = project.clients.email || process.env.ALERT_DEFAULT_EMAIL || "admin@example.com"

		const { data, error } = await resend.emails.send({
			from: fromEmail,
			to: [toEmail],
			subject: `🚨 Alerta: ${project.name} vence en ${timeUntil}`,
			html: emailContent,
		})

		if (error) {
			console.error("❌ Error al enviar email:", error)
			return { success: false, error }
		}

		console.log("✅ Email enviado exitosamente:", data)
		return { success: true, data }
	} catch (error) {
		console.error("❌ Error al inicializar Resend:", error)
		return { success: false, error }
	}
}

/**
 * Procesa todas las alertas (consola + email)
 */
export async function processAlerts() {
	console.log("\n🔍 Verificando proyectos próximos a vencer...")
	const urgentProjects = await checkUpcomingDeadlines()

	if (urgentProjects.length === 0) {
		console.log("✅ No hay proyectos próximos a vencer (3 días o menos)")
		return { count: 0, alerts: [] }
	}

	console.log(`⚠️ Se encontraron ${urgentProjects.length} proyecto(s) próximo(s) a vencer\n`)

	const alerts = []

	for (const project of urgentProjects) {
		// Enviar alerta por consola (simulado) - SIEMPRE se ejecuta
		sendConsoleAlert(project)

		// Enviar alerta por email (real) - SIEMPRE se ejecuta si está configurado
		const emailResult = await sendEmailAlert(project)
		alerts.push({
			project: project.name,
			console: true,
			email: emailResult.success,
			emailError: emailResult.error,
		})
	}

	return { count: urgentProjects.length, alerts }
}

