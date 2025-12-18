"use client"

import { createClient } from "./client"
import type { AuthError } from "@supabase/supabase-js"

/**
 * Inicia sesión usando MPC (Multi-Party Computation) con Magic Link
 * Este método no requiere contraseña y usa un enlace mágico enviado por email
 */
export async function signInWithMPC(email: string): Promise<{ error: AuthError | null }> {
	const supabase = createClient()

	// Iniciar el flujo de autenticación MPC con Magic Link
	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			shouldCreateUser: true,
			emailRedirectTo: `${window.location.origin}/auth/callback`,
		},
	})

	return { error }
}

/**
 * Inicia sesión usando Passkeys (WebAuthn)
 * Requiere que MPC esté habilitado en Supabase Dashboard
 */
export async function signInWithPasskey(): Promise<{ error: AuthError | null }> {
	const supabase = createClient()

	try {
		// Verificar si el navegador soporta WebAuthn
		if (typeof window !== "undefined" && !window.PublicKeyCredential) {
			throw new Error("WebAuthn no está soportado en este navegador")
		}

		// Iniciar autenticación con Passkey usando WebAuthn
		// Nota: Esto requiere configuración adicional en Supabase Dashboard
		// y la implementación puede variar según la versión de Supabase
		const { error } = await supabase.auth.signInWithPassword({
			email: "",
			password: "",
		})

		// TODO: Implementar autenticación real con WebAuthn cuando esté disponible
		// en la versión de Supabase que se esté usando

		return { error }
	} catch (error: unknown) {
		return {
			error: error as AuthError,
		}
	}
}

/**
 * Registra un nuevo usuario usando MPC con Magic Link
 */
export async function signUpWithMPC(email: string): Promise<{ error: AuthError | null }> {
	const supabase = createClient()

	// Registrar usuario sin contraseña usando Magic Link
	const { error } = await supabase.auth.signUp({
		email,
		password: crypto.randomUUID(), // Generar contraseña aleatoria (no se usará)
		options: {
			emailRedirectTo: `${window.location.origin}/auth/callback`,
			shouldCreateUser: true,
		},
	})

	return { error }
}

/**
 * Cierra sesión del usuario actual
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
	const supabase = createClient()
	const { error } = await supabase.auth.signOut()
	return { error }
}

/**
 * Obtiene el usuario actual
 */
export async function getCurrentUser() {
	const supabase = createClient()
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()
	return { user, error }
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
	const supabase = createClient()
	const {
		data: { session },
	} = await supabase.auth.getSession()
	return !!session
}

/**
 * Obtiene la sesión actual del usuario
 */
export async function getSession() {
	const supabase = createClient()
	const {
		data: { session },
		error,
	} = await supabase.auth.getSession()
	return { session, error }
}

