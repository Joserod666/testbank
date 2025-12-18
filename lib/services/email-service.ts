/**
 * Servicio de envío de correo electrónico
 * Por defecto simula el envío, pero puede configurarse para usar una API real
 */

interface EmailOptions {
	to: string
	subject: string
	html: string
	text?: string
}

interface EmailResult {
	success: boolean
	messageId?: string
	error?: string
}

export class EmailService {
	private isSimulation: boolean

	constructor(isSimulation: boolean = true) {
		this.isSimulation = isSimulation
	}

	/**
	 * Envía un correo electrónico
	 * Si está en modo simulación, solo muestra en consola
	 * Si está en modo real, muestra en consola Y envía el correo real
	 */
	async sendEmail(options: EmailOptions): Promise<EmailResult> {
		if (this.isSimulation) {
			// Modo simulación: solo mostrar en consola
			return this.simulateEmail(options)
		}

		// Modo real: mostrar preview en consola Y enviar correo real
		console.log("\n" + "=".repeat(80))
		console.log("📧 MODO REAL ACTIVADO - Ambos modos funcionando:")
		console.log("   1️⃣  PREVIEW en consola (simulación)")
		console.log("   2️⃣  CORREO REAL al destinatario")
		console.log("=".repeat(80))
		
		// 1. Mostrar preview en consola (simulación - siempre funciona)
		let simulationResult: EmailResult
		try {
			simulationResult = await this.simulateEmail(options)
			console.log("✅ Preview en consola mostrado correctamente")
		} catch (error) {
			console.error("❌ Error al mostrar preview:", error)
			simulationResult = {
				success: false,
				error: error instanceof Error ? error.message : "Error desconocido",
			}
		}
		
		// 2. Enviar correo real (al destinatario configurado)
		let realResult: EmailResult
		try {
			realResult = await this.sendRealEmail(options)
			if (realResult.success) {
				console.log("✅ Correo real enviado exitosamente")
			} else {
				console.error(`❌ Error al enviar correo real: ${realResult.error}`)
			}
		} catch (error) {
			console.error("❌ Error al enviar correo real:", error)
			realResult = {
				success: false,
				error: error instanceof Error ? error.message : "Error desconocido",
			}
		}

		// Retornar el resultado del envío real (pero ambos se ejecutaron)
		console.log("=".repeat(80))
		console.log("📊 RESUMEN:")
		console.log(`   Preview en consola: ${simulationResult.success ? "✅ OK" : "❌ Error"}`)
		console.log(`   Correo real: ${realResult.success ? "✅ OK" : "❌ Error"}`)
		console.log("=".repeat(80) + "\n")
		
		return realResult
	}

	/**
	 * Simula el envío de correo (muestra en consola)
	 * Siempre se muestra en consola como evidencia/log
	 */
	private async simulateEmail(options: EmailOptions): Promise<EmailResult> {
		const timestamp = new Date().toISOString()
		const dateFormatted = new Date(timestamp).toLocaleString("es-ES", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})
		
		const modeLabel = this.isSimulation 
			? "📧 SIMULACIÓN DE ALERTA DE CORREO (evidencia en consola)" 
			: "📧 PREVIEW DE ALERTA (evidencia en consola + envío real)"
		
		console.log("\n" + "=".repeat(80))
		console.log(modeLabel)
		console.log("=".repeat(80))
		console.log(`📬 Destinatario: ${options.to}`)
		console.log(`📌 Asunto: ${options.subject}`)
		console.log(`🕐 Fecha/Hora: ${dateFormatted}`)
		console.log(`📅 Timestamp: ${timestamp}`)
		console.log("-".repeat(80))
		console.log("📄 CONTENIDO HTML:")
		console.log("-".repeat(80))
		console.log(options.html)
		if (options.text) {
			console.log("-".repeat(80))
			console.log("📄 CONTENIDO TEXTO PLANO:")
			console.log("-".repeat(80))
			console.log(options.text)
		}
		console.log("=".repeat(80))
		console.log(`✅ Simulación registrada en consola/log`)
		console.log("=".repeat(80) + "\n")

		return {
			success: true,
			messageId: `sim-${Date.now()}`,
		}
	}

	/**
	 * Envía un correo real usando una API de correo
	 * Soporta: Resend, SendGrid, Mailgun, o SMTP directo
	 */
	private async sendRealEmail(options: EmailOptions): Promise<EmailResult> {
		try {
			const emailProvider = process.env.EMAIL_PROVIDER || "resend"
			console.log("\n" + "=".repeat(80))
			console.log(`📤 ENVIANDO CORREO REAL (proveedor: ${emailProvider.toUpperCase()})`)
			console.log("=".repeat(80))

			// Resend (recomendado - fácil de configurar)
			if (emailProvider === "resend") {
				return await this.sendWithResend(options)
			}

			// SendGrid
			if (emailProvider === "sendgrid") {
				return await this.sendWithSendGrid(options)
			}

			// Mailgun
			if (emailProvider === "mailgun") {
				return await this.sendWithMailgun(options)
			}

			// SMTP directo (usando nodemailer si está disponible)
			if (emailProvider === "smtp") {
				return await this.sendWithSMTP(options)
			}

			// Si no hay proveedor configurado, simula
			console.warn("⚠️  Proveedor de correo no configurado, usando simulación")
			return this.simulateEmail(options)
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Error desconocido",
			}
		}
	}

	/**
	 * Envía correo usando Resend
	 */
	private async sendWithResend(options: EmailOptions): Promise<EmailResult> {
		const RESEND_API_KEY = process.env.RESEND_API_KEY
		if (!RESEND_API_KEY) {
			throw new Error("RESEND_API_KEY no está configurada en las variables de entorno")
		}

		const response = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${RESEND_API_KEY}`,
			},
			body: JSON.stringify({
				from: process.env.EMAIL_FROM || "noreply@example.com",
				to: options.to,
				subject: options.subject,
				html: options.html,
				text: options.text || options.html.replace(/<[^>]*>/g, ""),
			}),
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({ message: "Error al enviar correo" }))
			throw new Error(error.message || `Error HTTP ${response.status}`)
		}

		const data = await response.json()
		console.log(`✅ Correo enviado exitosamente (Resend). Message ID: ${data.id}`)
		return {
			success: true,
			messageId: data.id,
		}
	}

	/**
	 * Envía correo usando SendGrid
	 */
	private async sendWithSendGrid(options: EmailOptions): Promise<EmailResult> {
		const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
		if (!SENDGRID_API_KEY) {
			throw new Error("SENDGRID_API_KEY no está configurada en las variables de entorno")
		}

		const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${SENDGRID_API_KEY}`,
			},
			body: JSON.stringify({
				personalizations: [
					{
						to: [{ email: options.to }],
					},
				],
				from: { email: process.env.EMAIL_FROM || "noreply@example.com" },
				subject: options.subject,
				content: [
					{
						type: "text/html",
						value: options.html,
					},
					{
						type: "text/plain",
						value: options.text || options.html.replace(/<[^>]*>/g, ""),
					},
				],
			}),
		})

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(`SendGrid error: ${errorText || `HTTP ${response.status}`}`)
		}

		const messageId = `sg-${Date.now()}`
		console.log(`✅ Correo enviado exitosamente (SendGrid). Message ID: ${messageId}`)
		return {
			success: true,
			messageId,
		}
	}

	/**
	 * Envía correo usando Mailgun
	 */
	private async sendWithMailgun(options: EmailOptions): Promise<EmailResult> {
		const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY
		const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN
		if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
			throw new Error("MAILGUN_API_KEY y MAILGUN_DOMAIN deben estar configuradas")
		}

		const formData = new URLSearchParams()
		formData.append("from", process.env.EMAIL_FROM || `noreply@${MAILGUN_DOMAIN}`)
		formData.append("to", options.to)
		formData.append("subject", options.subject)
		formData.append("html", options.html)
		if (options.text) {
			formData.append("text", options.text)
		}

		const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
			method: "POST",
			headers: {
				Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
			},
			body: formData,
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({ message: "Error al enviar correo" }))
			throw new Error(error.message || `Error HTTP ${response.status}`)
		}

		const data = await response.json()
		console.log(`✅ Correo enviado exitosamente (Mailgun). Message ID: ${data.id}`)
		return {
			success: true,
			messageId: data.id,
		}
	}

	/**
	 * Envía correo usando SMTP directo
	 * Requiere instalar: npm install nodemailer
	 */
	private async sendWithSMTP(options: EmailOptions): Promise<EmailResult> {
		// Intentar importar nodemailer dinámicamente
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let nodemailer: any
		try {
			// @ts-ignore - nodemailer es opcional, se importa dinámicamente
			const nodemailerModule = await import("nodemailer").catch(() => null)
			if (!nodemailerModule) {
				throw new Error(
					"nodemailer no está instalado. Ejecuta: npm install nodemailer @types/nodemailer"
				)
			}
			nodemailer = nodemailerModule
		} catch (error) {
			if (error instanceof Error && error.message.includes("nodemailer")) {
				throw error
			}
			throw new Error(
				"nodemailer no está instalado. Ejecuta: npm install nodemailer @types/nodemailer"
			)
		}

		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
			secure: process.env.SMTP_SECURE === "true",
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		})

		const info = await transporter.sendMail({
			from: process.env.EMAIL_FROM || process.env.SMTP_USER,
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text || options.html.replace(/<[^>]*>/g, ""),
		})

		console.log(`✅ Correo enviado exitosamente (SMTP). Message ID: ${info.messageId}`)
		return {
			success: true,
			messageId: info.messageId,
		}
	}

	/**
	 * Genera el HTML para una alerta de proyecto próximo a vencer
	 */
	generateProjectAlertEmail(project: {
		name: string
		due_date: string
		client_name: string
		daysUntil: number
	}): { subject: string; html: string; text: string } {
		const isOverdue = project.daysUntil < 0
		const subject = isOverdue
			? `🚨 Proyecto Vencido: ${project.name}`
			: `⚠️ Proyecto Próximo a Vencer: ${project.name}`

		const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background: ${isOverdue ? "#dc2626" : "#f59e0b"}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
		.content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
		.project-info { background: white; padding: 15px; margin: 15px 0; border-radius: 6px; border-left: 4px solid ${isOverdue ? "#dc2626" : "#f59e0b"}; }
		.footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
		.button { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 10px; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1 style="margin: 0;">${isOverdue ? "🚨 Proyecto Vencido" : "⚠️ Alerta de Vencimiento"}</h1>
		</div>
		<div class="content">
			<p>Hola,</p>
			<p>Te informamos sobre el siguiente proyecto:</p>
			
			<div class="project-info">
				<h2 style="margin-top: 0;">${project.name}</h2>
				<p><strong>Cliente:</strong> ${project.client_name}</p>
				<p><strong>Fecha de Vencimiento:</strong> ${new Date(project.due_date).toLocaleDateString("es-ES", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}</p>
				<p><strong>Estado:</strong> ${isOverdue ? `Vencido hace ${Math.abs(project.daysUntil)} día${Math.abs(project.daysUntil) !== 1 ? "s" : ""}` : `Vence en ${project.daysUntil} día${project.daysUntil !== 1 ? "s" : ""}`}</p>
			</div>

			<p>Por favor, revisa el estado del proyecto y toma las acciones necesarias.</p>
			
			<a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/projects" class="button">Ver Proyectos</a>
		</div>
		<div class="footer">
			<p>Este es un correo automático del sistema de gestión de proyectos.</p>
			<p>Freelance Project Manager</p>
		</div>
	</div>
</body>
</html>
		`.trim()

		const text = `
${isOverdue ? "🚨 PROYECTO VENCIDO" : "⚠️ ALERTA DE VENCIMIENTO"}

Hola,

Te informamos sobre el siguiente proyecto:

Proyecto: ${project.name}
Cliente: ${project.client_name}
Fecha de Vencimiento: ${new Date(project.due_date).toLocaleDateString("es-ES", {
			year: "numeric",
			month: "long",
			day: "numeric",
		})}
Estado: ${isOverdue ? `Vencido hace ${Math.abs(project.daysUntil)} día${Math.abs(project.daysUntil) !== 1 ? "s" : ""}` : `Vence en ${project.daysUntil} día${project.daysUntil !== 1 ? "s" : ""}`}

Por favor, revisa el estado del proyecto y toma las acciones necesarias.

Ver proyectos: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/projects

---
Este es un correo automático del sistema de gestión de proyectos.
Freelance Project Manager
		`.trim()

		return { subject, html, text }
	}
}

// Instancia singleton
// Usa simulación si EMAIL_SIMULATION=true o si no está configurado
// Usa correo real si EMAIL_SIMULATION=false y hay proveedor configurado
export const emailService = new EmailService(process.env.EMAIL_SIMULATION !== "false")
