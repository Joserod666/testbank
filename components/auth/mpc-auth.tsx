"use client"

import { useState } from "react"
import { signInWithMPC, signUpWithMPC } from "@/lib/supabase/mpc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface MPCAuthProps {
	mode?: "signin" | "signup"
}

export function MPCAuth({ mode = "signin" }: MPCAuthProps) {
	const [email, setEmail] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)
		setSuccess(false)

		try {
			const authFunction = mode === "signin" ? signInWithMPC : signUpWithMPC
			const { error: authError } = await authFunction(email)

			if (authError) {
				setError(authError.message || "Error al procesar la solicitud")
			} else {
				setSuccess(true)
				setEmail("")
			}
		} catch (err) {
			setError("Ocurrió un error inesperado")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>{mode === "signin" ? "Iniciar sesión" : "Registrarse"}</CardTitle>
				<CardDescription>
					{mode === "signin"
						? "Ingresa tu email para recibir un enlace mágico de autenticación"
						: "Crea una cuenta ingresando tu email"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="tu@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>

					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{success && (
						<Alert>
							<AlertDescription>
								{mode === "signin"
									? "Revisa tu email para el enlace de inicio de sesión"
									: "Revisa tu email para confirmar tu cuenta"}
							</AlertDescription>
						</Alert>
					)}

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Procesando...
							</>
						) : (
							<>{mode === "signin" ? "Enviar enlace mágico" : "Crear cuenta"}</>
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}

