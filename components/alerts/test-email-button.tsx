"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export function TestEmailButton() {
	const [isLoading, setIsLoading] = useState(false)

	async function sendTestEmail() {
		setIsLoading(true)

		try {
			const response = await fetch("/api/alerts/test")
			const data = await response.json()

			if (data.success) {
				toast.success("Correo de prueba enviado", {
					description: `Enviado a ${data.email} (Modo: ${data.mode})`,
					duration: 5000,
				})
			} else {
				toast.error("Error al enviar correo de prueba", {
					description: data.error || "Error desconocido",
					duration: 5000,
				})
			}
		} catch (error) {
			toast.error("Error de conexión", {
				description: error instanceof Error ? error.message : "No se pudo conectar al servidor",
				duration: 5000,
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button onClick={sendTestEmail} disabled={isLoading} variant="outline">
			{isLoading ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Enviando...
				</>
			) : (
				<>
					<Mail className="mr-2 h-4 w-4" />
					Probar Correo
				</>
			)}
		</Button>
	)
}

