# Configuración del Sistema de Alertas

Este sistema envía alertas automáticamente sobre proyectos que vencen en 3 días o menos.

## Características

- ✅ **Alertas por consola** (simulado) - Siempre activo
- ✅ **Alertas por email** (Resend) - Activo si está configurado
- ✅ Ambos sistemas funcionan simultáneamente
- ✅ Verificación automática al iniciar el servidor
- ✅ Verificación periódica cada hora (configurable)

## Configuración de Resend

### 1. Obtener API Key de Resend

1. Ve a [Resend.com](https://resend.com)
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys** en el dashboard
4. Crea una nueva API Key
5. Copia la clave (empieza con `re_`)

### 2. Configurar dominio (Opcional pero recomendado)

1. En Resend Dashboard, ve a **Domains**
2. Agrega tu dominio
3. Configura los registros DNS según las instrucciones
4. Espera a que se verifique el dominio

### 3. Variables de Entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```env
# Resend Configuration
RESEND_API_KEY=re_tu_api_key_aqui
RESEND_FROM_EMAIL=noreply@tudominio.com

# Email por defecto para alertas (si el cliente no tiene email)
ALERT_DEFAULT_EMAIL=admin@tudominio.com

# Secret para proteger el endpoint de cron (opcional)
CRON_SECRET=tu_secret_seguro_aqui
```

### 4. Ejemplo de configuración

```env
# Resend
RESEND_API_KEY=re_1234567890abcdefghijklmnopqrstuvwxyz
RESEND_FROM_EMAIL=noreply@example.com
ALERT_DEFAULT_EMAIL=admin@example.com
CRON_SECRET=mi_secret_super_seguro_123
```

## Funcionamiento

### Verificación Automática

El sistema se ejecuta automáticamente:
- Al iniciar el servidor
- Cada hora (configurable en `lib/cron/deadline-checker.ts`)

### Criterios de Alerta

Se envía alerta para proyectos que:
- Tienen estado: `pending`, `in_progress`, o `delayed`
- Vencen en **3 días (72 horas) o menos**
- El cálculo incluye horas precisas

### Tipos de Alertas

1. **Consola (Simulado)**
   - Siempre activo
   - Muestra información detallada en la consola del servidor
   - Útil para desarrollo y debugging

2. **Email (Resend)**
   - Activo si `RESEND_API_KEY` está configurada
   - Envía email al cliente (si tiene email) o al email por defecto
   - Incluye información completa del proyecto

## Endpoint de Cron

Puedes llamar manualmente al endpoint:

```
GET /api/cron/check-deadlines
```

O con autenticación:

```
GET /api/cron/check-deadlines
Authorization: Bearer tu_cron_secret
```

## Ejemplo de Uso Manual

```typescript
import { processAlerts } from "@/lib/services/alert-service"

// Ejecutar verificación manual
const result = await processAlerts()
console.log(`Se encontraron ${result.count} proyectos urgentes`)
```

## Notas Importantes

- ⚠️ El sistema de consola **SIEMPRE** se ejecuta, incluso si Resend no está configurado
- ⚠️ El sistema de email solo se ejecuta si `RESEND_API_KEY` está configurada
- ⚠️ Si Resend no está configurado, verás un warning pero el sistema continúa funcionando
- ✅ Ambos sistemas funcionan simultáneamente sin interferir entre sí

