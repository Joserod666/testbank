/**
 * Script de prueba para el sistema de alertas
 * Ejecutar con: npx tsx scripts/test-alerts.ts
 */

import { processAlerts } from "../lib/services/alert-service"

async function main() {
	console.log("🧪 Ejecutando prueba del sistema de alertas...\n")
	
	const result = await processAlerts()
	
	console.log("\n📊 Resultados:")
	console.log(`- Proyectos encontrados: ${result.count}`)
	console.log(`- Alertas procesadas: ${result.alerts.length}`)
	
	if (result.alerts.length > 0) {
		console.log("\n📋 Detalles de alertas:")
		result.alerts.forEach((alert, index) => {
			console.log(`${index + 1}. ${alert.project}`)
			console.log(`   - Consola: ${alert.console ? "✅" : "❌"}`)
			console.log(`   - Email: ${alert.email ? "✅" : "❌"}`)
			if (alert.emailError) {
				console.log(`   - Error email: ${alert.emailError}`)
			}
		})
	}
}

main().catch(console.error)

