import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"

// Inicializar servidor solo en runtime, no durante el build
if (typeof window === "undefined" && process.env.NEXT_PHASE !== "phase-production-build") {
	import("@/lib/server-init").catch(console.error)
}

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Freelance Project Manager",
	description: "Sistema de gestión de proyectos freelance",
	generator: "Next.js",
	icons: {
		icon: "/icono.png",
		apple: "/icono.png",
		shortcut: "/icono.png",
	},
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`font-sans antialiased`}>
				{children}
				<Toaster position="top-right" />
				<Analytics />
			</body>
		</html>
	)
}
