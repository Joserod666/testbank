/**
 * Este archivo se ejecuta al iniciar el servidor
 * Inicializa el verificador de deadlines
 * 
 * IMPORTANTE: Solo se ejecuta en runtime del servidor, no durante el build
 */

let deadlineCheckerStarted = false

export async function initializeServer() {
	// Evitar ejecución durante el build
	if (process.env.NEXT_PHASE === "phase-production-build") {
		return
	}

	if (deadlineCheckerStarted) {
		return
	}

	// Solo ejecutar en el servidor, no en el cliente
	if (typeof window === "undefined") {
		try {
			// Usar setTimeout para asegurar que se ejecute después del build
			setTimeout(async () => {
				const { startDeadlineChecker } = await import("@/lib/cron/deadline-checker")

				// Ejecutar verificaciones cada hora (60 minutos)
				// En desarrollo, puedes cambiar esto a un intervalo más corto para pruebas
				const intervalMinutes = process.env.NODE_ENV === "production" ? 60 : 30

				startDeadlineChecker(intervalMinutes)
				deadlineCheckerStarted = true

				console.log("✅ Servidor inicializado - Verificador de deadlines activo")
			}, 1000)
		} catch (error) {
			console.error("❌ Error al inicializar verificador de deadlines:", error)
		}
	}
}

// Ejecutar al cargar el módulo (solo en servidor, después del build)
if (typeof window === "undefined" && process.env.NEXT_PHASE !== "phase-production-build") {
	// Usar process.nextTick para ejecutar después de que el módulo se haya cargado completamente
	process.nextTick(() => {
		initializeServer().catch(console.error)
	})
}

