import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import { ProjectsList } from "@/components/projects/projects-list"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { ProjectsFilters } from "@/components/projects/projects-filters"
import Link from "next/link"

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold">Freelance Manager</h1>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/clients" className="text-sm text-muted-foreground hover:text-foreground">
              Clientes
            </Link>
            <a href="/projects" className="text-sm font-medium text-primary">
              Proyectos
            </a>
            <Link href="/timeline" className="text-sm text-muted-foreground hover:text-foreground">
              Timeline
            </Link>
          </nav>
        </div>
      </header>

      <main className="container flex-1 px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Proyectos</h2>
            <p className="text-muted-foreground">Gestiona todos tus proyectos freelance</p>
          </div>
          <CreateProjectDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </CreateProjectDialog>
        </div>

        <ProjectsFilters status={params.status} priority={params.priority} />

        <Suspense fallback={<ProjectsLoadingSkeleton />}>
          <ProjectsList status={params.status} priority={params.priority} />
        </Suspense>
      </main>
    </div>
  )
}

function ProjectsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-40" />
      ))}
    </div>
  )
}
