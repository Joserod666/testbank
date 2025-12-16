# Configuración del Sistema de Alertas por Correo

Este sistema permite verificar automáticamente proyectos próximos a vencer (3 días o menos) y enviar alertas por correo electrónico.

## Características

- ✅ **Ejecución automática al cargar el servidor** - Se ejecuta automáticamente cuando se accede a la aplicación
- ✅ Verificación automática de proyectos próximos a vencer (3 días o menos)
- ✅ Envío de correos simulados (por consola) o reales
- ✅ Endpoint API para ejecutar verificaciones manualmente
- ✅ Script CLI para ejecución manual
- ✅ Plantillas HTML para correos

## Modo de Operación

### Ejecución Automática

El sistema se ejecuta **automáticamente** cada vez que se carga la aplicación (al acceder a cualquier página). Esto asegura que siempre se verifiquen los proyectos próximos a vencer.

**Nota:** Para evitar ejecutarse en cada solicitud durante desarrollo, por defecto solo se ejecuta en producción. Para habilitarlo en desarrollo, agrega a `.env.local`:

```env
ENABLE_AUTO_ALERTS=true
```

### Modo Simulación (Por Defecto)

Por defecto, el sistema **simula** el envío de correos mostrando el contenido en la consola. Esto es útil para desarrollo y pruebas.

**Ejemplo de salida en consola:**
```
================================================================================
📧 SIMULACIÓN DE ENVÍO DE CORREO
================================================================================
Para: admin@example.com
Asunto: ⚠️ Proyecto Próximo a Vencer: Dashboard Analytics
Fecha: 2025-01-16T12:00:00.000Z
--------------------------------------------------------------------------------
Contenido HTML:
[HTML del correo]
================================================================================
```

### Modo Real

Para habilitar el envío real de correos, tienes varias opciones:

#### Opción 1: Resend (Recomendado)

```env
EMAIL_SIMULATION=false
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=noreply@tudominio.com
ALERT_EMAIL=tu@email.com
```

#### Opción 2: SendGrid

```env
EMAIL_SIMULATION=false
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.tu_api_key_aqui
EMAIL_FROM=noreply@tudominio.com
ALERT_EMAIL=tu@email.com
```

#### Opción 3: Mailgun

```env
EMAIL_SIMULATION=false
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=tu_api_key_aqui
MAILGUN_DOMAIN=tu-dominio.com
EMAIL_FROM=noreply@tu-dominio.com
ALERT_EMAIL=tu@email.com
```

#### Opción 4: SMTP Directo (Gmail, Outlook, etc.)

Primero instala nodemailer:
```bash
npm install nodemailer @types/nodemailer
```

Luego configura:
```env
EMAIL_SIMULATION=false
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu@gmail.com
SMTP_PASSWORD=tu_app_password
EMAIL_FROM=tu@gmail.com
ALERT_EMAIL=tu@email.com
```

**📖 Para instrucciones detalladas, consulta `CORREO_REAL_SETUP.md`**

## Uso

### 1. Endpoint API

Puedes llamar al endpoint API para ejecutar la verificación:

```bash
# GET request
curl http://localhost:3000/api/alerts/check

# Con parámetros personalizados
curl "http://localhost:3000/api/alerts/check?email=tu@email.com&days=3"

# POST request con JSON
curl -X POST http://localhost:3000/api/alerts/check \
  -H "Content-Type: application/json" \
  -d '{"email": "tu@email.com", "days": 3}'
```

### 2. Script CLI

Ejecuta el script directamente:

```bash
# Usando npm
npm run check-alerts

# Con parámetros
npm run check-alerts -- --email=tu@email.com --days=3

# O directamente con tsx
npx tsx scripts/check-alerts.ts --email=tu@email.com --days=3
```

### 3. Ejecución Automática

#### Opción A: Vercel Cron Jobs

Si estás usando Vercel, crea un archivo `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/alerts/check",
      "schedule": "0 9 * * *"
    }
  ]
}
```

Esto ejecutará la verificación todos los días a las 9 AM.

#### Opción B: GitHub Actions

Crea `.github/workflows/check-alerts.yml`:

```yaml
name: Check Project Alerts

on:
  schedule:
    - cron: '0 9 * * *'  # Todos los días a las 9 AM
  workflow_dispatch:  # Permite ejecución manual

jobs:
  check-alerts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run check-alerts
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          ALERT_EMAIL: ${{ secrets.ALERT_EMAIL }}
```

#### Opción C: Cron Job en Servidor

En un servidor Linux, agrega a crontab:

```bash
# Editar crontab
crontab -e

# Agregar línea (ejecuta todos los días a las 9 AM)
0 9 * * * cd /ruta/al/proyecto && npm run check-alerts
```

#### Opción D: Node.js con node-cron

Instala `node-cron`:

```bash
npm install node-cron
```

Crea un archivo `scripts/cron-alerts.ts`:

```typescript
import cron from "node-cron"
import { checkAndSendProjectAlerts } from "../lib/services/alert-checker"

// Ejecutar todos los días a las 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Ejecutando verificación de alertas...")
  await checkAndSendProjectAlerts()
})
```

## Configuración de Variables de Entorno

Agrega al archivo `.env.local`:

```env
# Email del destinatario de las alertas
ALERT_EMAIL=tu@email.com

# URL de la aplicación (para enlaces en correos)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Modo de simulación (true = simular, false = enviar real)
EMAIL_SIMULATION=true

# Para envío real con Resend (opcional)
RESEND_API_KEY=tu_api_key
EMAIL_FROM=noreply@tudominio.com
```

## Estructura de los Correos

Los correos incluyen:
- Asunto claro indicando el tipo de alerta
- Información del proyecto (nombre, cliente, fecha de vencimiento)
- Días restantes o días de retraso
- Enlace a la aplicación
- Diseño HTML responsive

## Personalización

### Cambiar el umbral de días

Por defecto, se alerta sobre proyectos que vencen en **3 días o menos**. Puedes cambiarlo:

```typescript
// En el endpoint API
?days=5

// En el script
npm run check-alerts -- --days=5
```

### Cambiar el servicio de correo

El servicio está preparado para usar Resend, pero puedes modificarlo en `lib/services/email-service.ts` para usar:
- SendGrid
- Mailgun
- AWS SES
- Nodemailer con SMTP

## Monitoreo

El sistema registra:
- Número de proyectos verificados
- Número de alertas enviadas
- Proyectos encontrados
- Errores (si los hay)

Todo se muestra en la consola cuando se ejecuta.

## Solución de Problemas

### Las alertas no se envían

1. Verifica que `EMAIL_SIMULATION` esté configurado correctamente
2. Revisa los logs de la consola
3. Asegúrate de que hay proyectos con fecha de vencimiento próxima
4. Verifica las credenciales de la API de correo (si usas modo real)

### El cron job no funciona

1. Verifica la sintaxis del cron
2. Asegúrate de que el servidor tenga acceso a internet
3. Revisa los logs del sistema
4. Prueba ejecutando el script manualmente primero

