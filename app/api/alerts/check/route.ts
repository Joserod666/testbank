import { NextRequest, NextResponse } from "next/server"
import { checkAndSendProjectAlerts } from "@/lib/services/alert-checker"

/**
 * Endpoint API para verificar y enviar alertas de proyectos próximos a vencer
 * 
 * GET /api/alerts/check - Verifica proyectos y envía alertas
 * Query params:
 *   - email: Email del destinatario (opcional, usa ALERT_EMAIL por defecto)
 *   - days: Días de anticipación (opcional, por defecto 3)
 */
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const email = searchParams.get("email") || undefined
		const days = searchParams.get("days") ? Number.parseInt(searchParams.get("days")!, 10) : 3

		const result = await checkAndSendProjectAlerts(email, days)

		return NextResponse.json(
			{
				success: true,
				message: `Verificación completada. ${result.alertsSent} alerta(s) enviada(s).`,
				result,
			},
			{ status: 200 }
		)
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
 * POST /api/alerts/check - Verifica proyectos y envía alertas (mismo comportamiento que GET)
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({}))
		const email = body.email || undefined
		const days = body.days || 3

		const result = await checkAndSendProjectAlerts(email, days)

		return NextResponse.json(
			{
				success: true,
				message: `Verificación completada. ${result.alertsSent} alerta(s) enviada(s).`,
				result,
			},
			{ status: 200 }
		)
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

