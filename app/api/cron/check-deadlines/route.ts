import { runDeadlineChecker } from "@/lib/cron/deadline-checker"
import { NextResponse } from "next/server"

/**
 * Endpoint para ejecutar la verificación de deadlines
 * Puede ser llamado por un cron job externo (Vercel Cron, etc.)
 */
export async function GET(request: Request) {
	try {
		// Verificar autorización (opcional pero recomendado)
		const authHeader = request.headers.get("authorization")
		const cronSecret = process.env.CRON_SECRET

		if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const result = await runDeadlineChecker()

		return NextResponse.json({
			success: true,
			timestamp: new Date().toISOString(),
			...result,
		})
	} catch (error) {
		console.error("Error en cron endpoint:", error)
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		)
	}
}

/**
 * También permitir POST para mayor flexibilidad
 */
export async function POST(request: Request) {
	return GET(request)
}

