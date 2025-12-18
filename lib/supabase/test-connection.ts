"use client"

import { createClient } from "./client"

/**
 * Función de prueba para verificar la conexión con Supabase
 * Puedes llamar esta función desde la consola del navegador o desde un componente
 */
export async function testSupabaseConnection() {
	try {
		const supabase = createClient()
		
		// Verificar que las variables de entorno están configuradas
		const url = process.env.NEXT_PUBLIC_SUPABASE_URL
		const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
		
		if (!url || !key) {
			return {
				success: false,
				error: "Variables de entorno no configuradas",
			}
		}
		
		// Intentar obtener la sesión actual (esto verifica la conexión)
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession()
		
		if (error) {
			return {
				success: false,
				error: error.message,
			}
		}
		
		return {
			success: true,
			message: "Conexión con Supabase exitosa",
			url,
			hasSession: !!session,
		}
	} catch (error: unknown) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Error desconocido",
		}
	}
}

