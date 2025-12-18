import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Mail, Phone, FileText } from "lucide-react"
import type { Client } from "@/lib/types"
import { EditClientDialog } from "./edit-client-dialog"
import { DeleteClientDialog } from "./delete-client-dialog"

export async function ClientsList() {
  const supabase = await createClient()

  const { data: clients } = await supabase.from("clients").select("*").order("name", { ascending: true })

  // Obtener conteo de proyectos por cliente
  const clientsWithProjects = await Promise.all(
    (clients || []).map(async (client: Client) => {
      const { count } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("client_id", client.id)

      return { ...client, projectCount: count || 0 }
    }),
  )

  if (!clientsWithProjects || clientsWithProjects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No hay clientes registrados</p>
          <p className="text-sm text-muted-foreground">Crea tu primer cliente para comenzar</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {clientsWithProjects.map((client) => (
        <Card key={client.id} className="relative">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{client.name}</CardTitle>
                {client.company && <CardDescription>{client.company}</CardDescription>}
              </div>
              <div className="flex gap-2">
                <EditClientDialog client={client} />
                <DeleteClientDialog clientId={client.id} clientName={client.name} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{client.phone}</span>
              </div>
            )}
            {client.notes && (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground line-clamp-2">{client.notes}</span>
              </div>
            )}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Proyectos:</span>
                <span className="font-medium">{client.projectCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
