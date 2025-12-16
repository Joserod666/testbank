export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function getDaysUntil(date: string | Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function isOverdue(date: string | Date): boolean {
  return getDaysUntil(date) < 0
}

export function isUpcoming(date: string | Date, days = 7): boolean {
  const daysUntil = getDaysUntil(date)
  return daysUntil >= 0 && daysUntil <= days
}

export function getDateStatus(date: string | Date): "overdue" | "urgent" | "upcoming" | "normal" {
  const daysUntil = getDaysUntil(date)
  if (daysUntil < 0) return "overdue"
  if (daysUntil <= 3) return "urgent"
  if (daysUntil <= 7) return "upcoming"
  return "normal"
}
