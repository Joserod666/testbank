/**
 * Cliente de Supabase para operaciones administrativas
 * No requiere cookies ni autenticación de usuario
 * Útil para tareas en segundo plano como verificaciones de deadlines
 */
import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	if (!supabaseUrl || !supabaseKey) {
		throw new Error("NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY deben estar configurados")
	}

	return createClient(supabaseUrl, supabaseKey)
}

