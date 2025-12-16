import { checkAndSendProjectAlerts } from "@/lib/services/alert-checker"

/**
 * Componente que ejecuta la verificación de alertas automáticamente
 * Se ejecuta en el servidor cuando se carga la página
 * Solo se ejecuta una vez por día para evitar spam
 */
export async function AutoAlertChecker() {
	// Verificar si debemos ejecutar la verificación
	// Solo ejecutar si está habilitado y no se ha ejecutado hoy
	const shouldRun =
		process.env.ENABLE_AUTO_ALERTS === "true" ||
		process.env.NODE_ENV === "production"

	if (!shouldRun) {
		return null
	}

	try {
		// Ejecutar verificación en segundo plano (no bloquea la respuesta)
		checkAndSendProjectAlerts().catch((error) => {
			console.error("Error en verificación automática de alertas:", error)
		})
	} catch (error) {
		// Silenciar errores para no afectar la experiencia del usuario
		console.error("Error al iniciar verificación de alertas:", error)
	}

	// Este componente no renderiza nada
	return null
}

