"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function DeleteAlertButton({ alertId }: { alertId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("alerts").delete().eq("id", alertId)

    setIsLoading(false)

    if (!error) {
      router.refresh()
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isLoading}
      title="Eliminar alerta"
      className="text-destructive hover:text-destructive"
    >
      <X className="h-4 w-4" />
    </Button>
  )
}
