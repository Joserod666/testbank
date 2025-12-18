import { checkAndSendProjectAlerts } from "@/lib/services/alert-checker"

/**
 * Componente que ejecuta la verificación de alertas automáticamente
 * Se ejecuta en el servidor cada vez que se carga o refresca cualquier página
 * Verifica proyectos que vencen en 3 días o menos y envía alertas por correo (simulación en consola)
 */
export async function AutoAlertChecker() {
	// Verificar que las variables de entorno estén disponibles
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

	// Si no hay variables de entorno, no ejecutar (silenciosamente)
	if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === "" || supabaseAnonKey === "") {
		// Solo mostrar advertencia en desarrollo, no en producción
		if (process.env.NODE_ENV === "development") {
			console.warn(
				"⚠️ Variables de entorno de Supabase no disponibles. Verifica que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén en .env.local y reinicia el servidor."
			)
		}
		return null
	}

	try {
		// Ejecutar verificación en segundo plano cada vez que se carga la página
		// No bloquea la respuesta, se ejecuta de forma asíncrona
		console.log("🔔 Iniciando verificación automática de alertas...")
		checkAndSendProjectAlerts()
			.then((result) => {
				console.log(`📊 Resultado de verificación:`)
				console.log(`  - Proyectos verificados: ${result.checked}`)
				console.log(`  - Proyectos urgentes encontrados: ${result.projects.length}`)
				console.log(`  - Alertas enviadas: ${result.alertsSent}`)
				if (result.errors.length > 0) {
					console.log(`  - Errores: ${result.errors.length}`)
					result.errors.forEach((error) => console.log(`    ⚠️  ${error}`))
				}
				if (result.alertsSent > 0) {
					console.log(`✅ Verificación completada: ${result.alertsSent} alerta(s) procesada(s)`)
				} else if (result.projects.length === 0) {
					console.log(`ℹ️  No se encontraron proyectos que requieran alertas`)
				}
			})
			.catch((error) => {
				console.error("❌ Error en verificación automática de alertas:", error)
			})
	} catch (error) {
		// Silenciar errores para no afectar la experiencia del usuario
		console.error("❌ Error al iniciar verificación de alertas:", error)
	}

	// Este componente no renderiza nada
	return null
}

