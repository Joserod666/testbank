# Configuración de Supabase MPC

Esta integración permite usar autenticación sin contraseña usando Multi-Party Computation (MPC) con Supabase.

## Configuración en Supabase Dashboard

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Authentication** > **Providers**
3. Habilita **Email** provider
4. Configura las siguientes opciones:
   - **Enable email confirmations**: Opcional (recomendado para producción)
   - **Secure email change**: Habilitado
   - **Enable custom SMTP**: Opcional (para emails personalizados)

## Variables de Entorno

Asegúrate de tener las siguientes variables en tu archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

## Uso

### Componente de Autenticación

```tsx
import { MPCAuth } from "@/components/auth/mpc-auth"

export default function LoginPage() {
	return <MPCAuth mode="signin" />
}
```

### Hook de Autenticación

```tsx
import { useAuth } from "@/hooks/use-auth"

export default function ProtectedComponent() {
	const { user, loading } = useAuth()

	if (loading) return <div>Cargando...</div>
	if (!user) return <div>No autenticado</div>

	return <div>Bienvenido, {user.email}</div>
}
```

### Funciones de Autenticación

```tsx
import { signInWithMPC, signOut, getCurrentUser } from "@/lib/supabase/mpc"

// Iniciar sesión
const { error } = await signInWithMPC("usuario@example.com")

// Cerrar sesión
const { error } = await signOut()

// Obtener usuario actual
const { user, error } = await getCurrentUser()
```

## Flujo de Autenticación

1. Usuario ingresa su email
2. Se envía un Magic Link al email
3. Usuario hace clic en el enlace
4. Se redirige a `/auth/callback`
5. Se crea la sesión automáticamente
6. Usuario es redirigido a la página principal

## Callback Route

El archivo `app/auth/callback/route.ts` maneja la redirección después de la autenticación. Puedes personalizar la ruta de redirección usando el parámetro `next` en la URL.

## Notas

- MPC usa PKCE (Proof Key for Code Exchange) para mayor seguridad
- No se requiere contraseña para la autenticación
- Los tokens se refrescan automáticamente
- La sesión persiste entre recargas de página

