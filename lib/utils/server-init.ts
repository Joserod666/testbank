/**
 * Funciones que se ejecutan al iniciar el servidor
 * Nota: Next.js no tiene un hook directo para esto, pero puedes usar:
 * 1. Un cron job externo (Vercel Cron, GitHub Actions, etc.)
 * 2. Un endpoint API que se llame periódicamente
 * 3. Un script que se ejecute con node-cron o similar
 */

import { checkAndSendProjectAlerts } from "@/lib/services/alert-checker"

/**
 * Ejecuta la verificación de alertas al iniciar el servidor
 * Esta función se puede llamar desde un middleware o desde un endpoint
 */
export async function runAlertCheckOnInit() {
	// Solo ejecutar en producción o si está explícitamente habilitado
	if (process.env.NODE_ENV === "production" || process.env.ENABLE_AUTO_ALERTS === "true") {
		try {
			console.log("🔍 Ejecutando verificación automática de alertas al iniciar servidor...")
			const result = await checkAndSendProjectAlerts()
			console.log(`✅ Verificación completada: ${result.alertsSent} alerta(s) enviada(s)`)
			return result
		} catch (error) {
			console.error("❌ Error al ejecutar verificación de alertas:", error)
			return null
		}
	}
	return null
}

