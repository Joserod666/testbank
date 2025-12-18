"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, GanttChart, List } from "lucide-react"
import { TimelineGantt } from "./timeline-gantt"
import { TimelineCalendar } from "./timeline-calendar"
import { TimelineTable } from "./timeline-table"
import type { Project } from "@/lib/types"

type ViewType = "table" | "list" | "calendar" | "gantt"

interface TimelineViewSelectorProps {
	projects: (Project & { clients: { name: string } })[]
	listView: React.ReactNode
}

export function TimelineViewSelector({ projects, listView }: TimelineViewSelectorProps) {
	const [view, setView] = useState<ViewType>("table")

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">Vista de Línea de Tiempo</h3>
			<div className="flex gap-2">
				<Button
					variant={view === "table" ? "default" : "outline"}
					size="sm"
					onClick={() => setView("table")}
					className="gap-2"
				>
					<List className="h-4 w-4" />
					Tabla
				</Button>
				<Button
					variant={view === "list" ? "default" : "outline"}
					size="sm"
					onClick={() => setView("list")}
					className="gap-2"
				>
					<List className="h-4 w-4" />
					Lista
				</Button>
				<Button
					variant={view === "calendar" ? "default" : "outline"}
					size="sm"
					onClick={() => setView("calendar")}
					className="gap-2"
				>
					<Calendar className="h-4 w-4" />
					Calendario
				</Button>
				<Button
					variant={view === "gantt" ? "default" : "outline"}
					size="sm"
					onClick={() => setView("gantt")}
					className="gap-2"
				>
					<GanttChart className="h-4 w-4" />
					Gantt
				</Button>
			</div>
			</div>

			{view === "table" && <TimelineTable projects={projects} />}
			{view === "list" && listView}
			{view === "calendar" && <TimelineCalendar projects={projects} />}
			{view === "gantt" && <TimelineGantt projects={projects} />}
		</div>
	)
}

