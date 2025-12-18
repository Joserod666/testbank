export function formatDate(date: string | Date): string {
	const d = new Date(date)
	return d.toLocaleDateString("es-ES", {
		year: "numeric",
		month: "short",
		day: "numeric",
	})
}

export function formatDateTime(date: string | Date): string {
	const d = new Date(date)
	return d.toLocaleDateString("es-ES", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
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

export function getHoursUntil(date: string | Date): number {
	const now = new Date()
	const target = new Date(date)
	const diff = target.getTime() - now.getTime()
	return Math.ceil(diff / (1000 * 60 * 60))
}

export function getTimeUntilFormatted(date: string | Date): string {
	const hoursUntil = getHoursUntil(date)
	const daysUntil = getDaysUntil(date)

	if (hoursUntil < 0) {
		const absHours = Math.abs(hoursUntil)
		const absDays = Math.floor(absHours / 24)
		return `${absDays} día${absDays !== 1 ? "s" : ""} y ${absHours % 24} hora${absHours % 24 !== 1 ? "s" : ""} atrasado`
	}

	if (hoursUntil < 24) {
		return `${hoursUntil} hora${hoursUntil !== 1 ? "s" : ""}`
	}

	const days = Math.floor(hoursUntil / 24)
	const hours = hoursUntil % 24

	if (hours === 0) {
		return `${days} día${days !== 1 ? "s" : ""}`
	}

	return `${days} día${days !== 1 ? "s" : ""} y ${hours} hora${hours !== 1 ? "s" : ""}`
}

export function isWithin7Days(date: string | Date): boolean {
	const hoursUntil = getHoursUntil(date)
	return hoursUntil >= 0 && hoursUntil <= 7 * 24
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
