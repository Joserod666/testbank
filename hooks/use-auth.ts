"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/supabase/mpc"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function loadUser() {
			const { user: currentUser } = await getCurrentUser()
			setUser(currentUser)
			setLoading(false)
		}

		loadUser()

		// Escuchar cambios en la sesión
		const supabase = createClient()
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
			setLoading(false)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	return { user, loading }
}

