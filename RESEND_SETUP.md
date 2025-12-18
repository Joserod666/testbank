# Configuración de Resend para Alertas de Email

## 📋 Lo que necesitas para Resend

### 1. API Key de Resend

**Pasos para obtenerla:**

1. Ve a [https://resend.com](https://resend.com)
2. Crea una cuenta gratuita o inicia sesión
3. En el Dashboard, ve a **API Keys**
4. Haz clic en **Create API Key**
5. Dale un nombre (ej: "Freelance Manager Production")
6. Copia la API Key (empieza con `re_`)
7. ⚠️ **Importante:** Guárdala de forma segura, solo se muestra una vez

### 2. Dominio de Email (Opcional pero Recomendado)

**Para producción:**
- Agrega tu dominio en Resend Dashboard > Domains
- Configura los registros DNS según las instrucciones
- Espera la verificación (puede tardar unos minutos)

**Para desarrollo/pruebas:**
- Puedes usar el dominio de prueba de Resend: `onboarding@resend.dev`
- Solo funciona para emails verificados en tu cuenta de Resend

### 3. Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```env
# Resend API Key (requerido para emails reales)
RESEND_API_KEY=re_tu_api_key_aqui

# Email desde el cual se enviarán las alertas
RESEND_FROM_EMAIL=noreply@tudominio.com
# O para pruebas:
# RESEND_FROM_EMAIL=onboarding@resend.dev

# Email por defecto para alertas (si el cliente no tiene email configurado)
ALERT_DEFAULT_EMAIL=admin@tudominio.com

# Secret para proteger el endpoint de cron (opcional pero recomendado)
CRON_SECRET=tu_secret_seguro_aqui_123456
```

### 4. Ejemplo Completo de Configuración

```env
# Supabase (ya configurado)
NEXT_PUBLIC_SUPABASE_URL=https://ixasfynswsdelghkbrgj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_VasDtu3o4SOb1McpLAHJkw_kCa8Ymtw

# Resend (nuevo)
RESEND_API_KEY=re_1234567890abcdefghijklmnopqrstuvwxyz
RESEND_FROM_EMAIL=noreply@tudominio.com
ALERT_DEFAULT_EMAIL=admin@tudominio.com
CRON_SECRET=mi_secret_super_seguro_123456
```

## 🔄 Cómo Funciona

### Sistema Dual (Simulado + Real)

El sistema funciona con **DOS métodos simultáneos**:

1. **Alertas por Consola (Simulado)**
   - ✅ **SIEMPRE activo**
   - Muestra información en la consola del servidor
   - Útil para desarrollo y debugging
   - No requiere configuración

2. **Alertas por Email (Resend)**
   - ✅ **SIEMPRE intenta ejecutarse**
   - Si `RESEND_API_KEY` está configurada → envía emails reales
   - Si NO está configurada → muestra warning pero continúa funcionando
   - Ambos sistemas funcionan simultáneamente sin interferir

### Ejecución Automática

- ✅ Se ejecuta **al iniciar el servidor**
- ✅ Se ejecuta **cada hora** automáticamente (configurable)
- ✅ Puedes ejecutarlo manualmente llamando a `/api/cron/check-deadlines`

### Criterios de Alerta

Se envía alerta para proyectos que:
- Estado: `pending`, `in_progress`, o `delayed`
- Vencen en **3 días (72 horas) o menos**
- Cálculo preciso incluyendo horas

## 🧪 Pruebas

### Probar el Sistema

1. **Con Resend configurado:**
   ```bash
   # El sistema se ejecutará automáticamente al iniciar el servidor
   npm run dev
   ```

2. **Llamar manualmente al endpoint:**
   ```bash
   curl http://localhost:3000/api/cron/check-deadlines
   ```

3. **Con autenticación:**
   ```bash
   curl -H "Authorization: Bearer tu_cron_secret" http://localhost:3000/api/cron/check-deadlines
   ```

### Verificar Funcionamiento

- ✅ Revisa la consola del servidor para ver las alertas simuladas
- ✅ Revisa tu email (o el email configurado) para ver las alertas reales
- ✅ Ambos deberían funcionar simultáneamente

## 📧 Estructura del Email

El email incluye:
- Nombre del proyecto
- Cliente asignado
- Fecha de vencimiento
- Tiempo restante (días y horas)
- Estado del proyecto
- Porcentaje de completado

## ⚠️ Notas Importantes

- El sistema de **consola SIEMPRE funciona**, incluso sin Resend
- El sistema de **email funciona si Resend está configurado**
- Si Resend no está configurado, verás un warning pero el sistema continúa
- **Ambos sistemas funcionan simultáneamente** sin desactivarse entre sí
- Los emails se envían al email del cliente (si existe) o al email por defecto

## 🚀 Próximos Pasos

1. Obtén tu API Key de Resend
2. Configura las variables de entorno
3. Reinicia el servidor
4. Verifica que ambos sistemas funcionen correctamente

