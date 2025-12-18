import { createClient } from "@/lib/supabase/server"
import { TimelineView } from "./timeline-view"

export async function TimelineWrapper() {
	const supabase = await createClient()

	const { data: projects } = await supabase
		.from("projects")
		.select("*, clients(name)")
		.in("status", ["pending", "in_progress"])
		.order("due_date", { ascending: true })

	return <TimelineView projects={(projects || []) as any} />
}

