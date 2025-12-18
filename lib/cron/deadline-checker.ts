import { processAlerts } from "@/lib/services/alert-service"

/**
 * Función que se ejecuta periódicamente para verificar proyectos próximos a vencer
 * Esta función puede ser llamada desde un cron job o al iniciar el servidor
 */
export async function runDeadlineChecker() {
	try {
		const result = await processAlerts()
		return result
	} catch (error) {
		console.error("❌ Error en deadline checker:", error)
		return { count: 0, alerts: [], error }
	}
}

/**
 * Ejecuta la verificación cada X minutos
 * En producción, esto debería ejecutarse mediante un cron job externo o Vercel Cron
 */
export function startDeadlineChecker(intervalMinutes: number = 60) {
	console.log(`⏰ Iniciando verificador de deadlines cada ${intervalMinutes} minutos`)

	// Ejecutar inmediatamente al iniciar
	runDeadlineChecker()

	// Ejecutar periódicamente
	const intervalMs = intervalMinutes * 60 * 1000
	setInterval(() => {
		runDeadlineChecker()
	}, intervalMs)
}

