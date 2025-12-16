import { NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/services/email-service"

/**
 * Endpoint para probar el envío de correos
 * GET /api/alerts/test - Envía un correo de prueba
 */
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const testEmail = searchParams.get("email") || process.env.ALERT_EMAIL || "admin@example.com"

		// Generar un correo de prueba
		const { subject, html, text } = emailService.generateProjectAlertEmail({
			name: "Proyecto de Prueba",
			due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 días desde hoy
			client_name: "Cliente de Prueba",
			daysUntil: 2,
		})

		const result = await emailService.sendEmail({
			to: testEmail,
			subject: `[PRUEBA] ${subject}`,
			html: `
				<div style="padding: 20px; border: 2px solid #3b82f6; border-radius: 8px; background: #eff6ff;">
					<h2 style="color: #1e40af;">🧪 Correo de Prueba - Sistema de Alertas</h2>
					<p>Este es un correo de prueba para verificar que el sistema de alertas está funcionando correctamente.</p>
					<p><strong>Fecha de prueba:</strong> ${new Date().toLocaleString("es-ES")}</p>
					<p><strong>Destinatario:</strong> ${testEmail}</p>
					<hr style="margin: 20px 0; border: 1px solid #93c5fd;">
					${html}
				</div>
			`,
			text: `[PRUEBA] Correo de Prueba - Sistema de Alertas\n\n${text}`,
		})

		if (result.success) {
			return NextResponse.json(
				{
					success: true,
					message: `Correo de prueba enviado exitosamente a ${testEmail}`,
					messageId: result.messageId,
					email: testEmail,
					mode: process.env.EMAIL_SIMULATION === "false" ? "REAL" : "SIMULACIÓN",
				},
				{ status: 200 }
			)
		} else {
			return NextResponse.json(
				{
					success: false,
					error: result.error || "Error desconocido al enviar correo",
					email: testEmail,
				},
				{ status: 500 }
			)
		}
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Error desconocido",
			},
			{ status: 500 }
		)
	}
}

/**
 * POST /api/alerts/test - Envía un correo de prueba (mismo comportamiento que GET)
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({}))
		const testEmail = body.email || process.env.ALERT_EMAIL || "admin@example.com"

		const { subject, html, text } = emailService.generateProjectAlertEmail({
			name: "Proyecto de Prueba",
			due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
			client_name: "Cliente de Prueba",
			daysUntil: 2,
		})

		const result = await emailService.sendEmail({
			to: testEmail,
			subject: `[PRUEBA] ${subject}`,
			html: `
				<div style="padding: 20px; border: 2px solid #3b82f6; border-radius: 8px; background: #eff6ff;">
					<h2 style="color: #1e40af;">🧪 Correo de Prueba - Sistema de Alertas</h2>
					<p>Este es un correo de prueba para verificar que el sistema de alertas está funcionando correctamente.</p>
					<p><strong>Fecha de prueba:</strong> ${new Date().toLocaleString("es-ES")}</p>
					<p><strong>Destinatario:</strong> ${testEmail}</p>
					<hr style="margin: 20px 0; border: 1px solid #93c5fd;">
					${html}
				</div>
			`,
			text: `[PRUEBA] Correo de Prueba - Sistema de Alertas\n\n${text}`,
		})

		if (result.success) {
			return NextResponse.json(
				{
					success: true,
					message: `Correo de prueba enviado exitosamente a ${testEmail}`,
					messageId: result.messageId,
					email: testEmail,
					mode: process.env.EMAIL_SIMULATION === "false" ? "REAL" : "SIMULACIÓN",
				},
				{ status: 200 }
			)
		} else {
			return NextResponse.json(
				{
					success: false,
					error: result.error || "Error desconocido al enviar correo",
					email: testEmail,
				},
				{ status: 500 }
			)
		}
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Error desconocido",
			},
			{ status: 500 }
		)
	}
}

