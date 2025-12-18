export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Project {
	id: string
	client_id: string
	name: string
	description: string | null
	status: "pending" | "in_progress" | "completed" | "delayed"
	priority: "low" | "medium" | "high" | "urgent"
	start_date: string
	due_date: string
	completion_percentage: number
	budget: number | null
	created_at: string
	updated_at: string
	clients?: Client
}

export interface Alert {
  id: string
  project_id: string
  alert_type: "deadline_approaching" | "overdue" | "status_change" | "custom"
  message: string
  is_read: boolean
  created_at: string
  projects?: Project
}

export type ProjectStatus = Project["status"]
export type ProjectPriority = Project["priority"]
export type AlertType = Alert["alert_type"]
