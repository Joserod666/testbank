import { Suspense } from "react"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { ProjectsOverview } from "@/components/dashboard/projects-overview"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"
import { ProjectsTableWrapper } from "@/components/dashboard/projects-table-wrapper"
import { AlertNotification } from "@/components/alerts/alert-notification"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function DashboardPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-50 border-b glass-effect">
				<div className="container flex h-16 items-center justify-between px-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/20">
							<svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
						</div>
						<div>
							<h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
								Freelance Manager
							</h1>
							<p className="text-xs text-muted-foreground">Gestión profesional</p>
						</div>
					</div>
					<div className="flex items-center gap-6">
						<nav className="flex items-center gap-1">
							<a
								href="/"
								className="relative px-4 py-2 text-sm font-medium text-primary before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:gradient-primary before:rounded-full"
							>
								Dashboard
							</a>
							<Link
								href="/clients"
								className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/10 rounded-lg"
							>
								Clientes
							</Link>
							<Link
								href="/projects"
								className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/10 rounded-lg"
							>
								Proyectos
							</Link>
							<Link
								href="/timeline"
								className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/10 rounded-lg"
							>
								Timeline
							</Link>
						</nav>
						<AlertNotification />
					</div>
				</div>
			</header>

			<main className="container flex-1 px-4 py-8 relative">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

				<div className="relative">
					<div className="mb-8">
						<h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
							Dashboard
						</h2>
						<p className="text-muted-foreground mt-1">Resumen general de tus proyectos y clientes</p>
					</div>

					<div className="space-y-8">
						<Suspense fallback={<StatsLoadingSkeleton />}>
							<DashboardStats />
						</Suspense>

						<div className="grid gap-6 lg:grid-cols-2">
							<Suspense fallback={<CardLoadingSkeleton />}>
								<ProjectsOverview />
							</Suspense>

							<Suspense fallback={<CardLoadingSkeleton />}>
								<RecentAlerts />
							</Suspense>
						</div>

						<Suspense fallback={<CardLoadingSkeleton />}>
							<UpcomingDeadlines />
						</Suspense>

						<Suspense fallback={<CardLoadingSkeleton />}>
							<ProjectsTableWrapper />
						</Suspense>
					</div>
				</div>
			</main>
		</div>
	)
}

function StatsLoadingSkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{[1, 2, 3, 4].map((i) => (
				<Skeleton key={i} className="h-32" />
			))}
		</div>
	)
}

function CardLoadingSkeleton() {
	return <Skeleton className="h-96" />
}
