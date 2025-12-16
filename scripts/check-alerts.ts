#!/usr/bin/env node
/**
 * Script para verificar y enviar alertas de proyectos próximos a vencer
 * 
 * Uso:
 *   npm run check-alerts
 *   npm run check-alerts -- --email=tu@email.com --days=3
 * 
 * O ejecutar directamente:
 *   npx tsx scripts/check-alerts.ts
 *   npx tsx scripts/check-alerts.ts --email=tu@email.com --days=3
 */

import { checkAndSendProjectAlerts } from "../lib/services/alert-checker"

async function main() {
	const args = process.argv.slice(2)
	let email: string | undefined
	let days = 3

	// Parsear argumentos
	for (const arg of args) {
		if (arg.startsWith("--email=")) {
			email = arg.split("=")[1]
		} else if (arg.startsWith("--days=")) {
			days = Number.parseInt(arg.split("=")[1], 10)
		}
	}

	console.log("🔍 Iniciando verificación de alertas de proyectos...")
	console.log(`📧 Email destinatario: ${email || process.env.ALERT_EMAIL || "admin@example.com"}`)
	console.log(`📅 Días de anticipación: ${days}`)
	console.log("")

	const result = await checkAndSendProjectAlerts(email, days)

	console.log("")
	console.log("=".repeat(80))
	console.log("📊 RESULTADOS DE LA VERIFICACIÓN")
	console.log("=".repeat(80))
	console.log(`✅ Proyectos verificados: ${result.checked}`)
	console.log(`📧 Alertas enviadas: ${result.alertsSent}`)
	console.log(`⚠️  Proyectos próximos a vencer: ${result.projects.length}`)

	if (result.projects.length > 0) {
		console.log("")
		console.log("Proyectos encontrados:")
		result.projects.forEach((project) => {
			const status = project.daysUntil < 0 ? "🔴 VENCIDO" : "🟡 PRÓXIMO"
			console.log(`  ${status} - ${project.name} (${project.daysUntil} días)`)
		})
	}

	if (result.errors.length > 0) {
		console.log("")
		console.log("❌ Errores encontrados:")
		result.errors.forEach((error) => {
			console.log(`  - ${error}`)
		})
	}

	console.log("=".repeat(80))
	console.log("")

	process.exit(result.errors.length > 0 ? 1 : 0)
}

main().catch((error) => {
	console.error("❌ Error fatal:", error)
	process.exit(1)
})

