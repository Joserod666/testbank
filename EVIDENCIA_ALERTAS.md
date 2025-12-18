# 🔔 Evidencia de Sistema de Alertas

## 📋 Descripción

Este documento contiene la evidencia del funcionamiento del sistema de alertas automáticas para proyectos próximos a vencer.

## ✅ Sistema Implementado

### Características

- ✅ Verificación automática al iniciar el servidor
- ✅ Verificación periódica cada 30 minutos (desarrollo) / 60 minutos (producción)
- ✅ Alertas para proyectos que vencen en **3 días (72 horas) o menos**
- ✅ **Doble sistema simultáneo**:
  - Consola (simulado) - Siempre activo
  - Email (Resend) - Si está configurado

## 📸 Evidencia en Consola

### Formato de Alerta

Cuando el sistema detecta un proyecto próximo a vencer, muestra en la consola:

```
================================================================================
🚨 ALERTA: Proyecto próximo a vencer
================================================================================
Proyecto: Nombre del Proyecto
Cliente: Nombre del Cliente
Fecha de vencimiento: 18 dic 2025
Tiempo restante: 2 horas
Horas restantes: 2 horas
Estado: pending
Progreso: 42%
================================================================================
```

### Logs del Sistema

```
⏰ Iniciando verificador de deadlines cada 30 minutos

🔍 Verificando proyectos próximos a vencer...
✅ Servidor inicializado - Verificador de deadlines activo
⚠️ Se encontraron 1 proyecto(s) próximo(s) a vencer

================================================================================
🚨 ALERTA: Proyecto próximo a vencer
================================================================================
Proyecto: test
Cliente: José Gustavo Rodríguez Cortés
Fecha de vencimiento: 18 dic 2025
Tiempo restante: 2 horas
Horas restantes: 2 horas
Estado: pending
Progreso: 42%
================================================================================

✅ Email enviado exitosamente: { id: '8e6005fa-cc01-48fc-aa50-e8b140860513' }
```

## 📧 Evidencia de Email (Resend)

### Configuración

- **API Key:** Configurada ✅
- **From Email:** `onboarding@resend.dev`
- **Default Email:** `admin@example.com`

### Confirmación de Envío

El sistema muestra en consola cuando el email se envía exitosamente:

```
✅ Email enviado exitosamente: { id: '8e6005fa-cc01-48fc-aa50-e8b140860513' }
```

### Contenido del Email

El email incluye:
- Título: `🚨 Alerta: [Nombre del Proyecto] vence en [Tiempo restante]`
- Información del proyecto:
  - Nombre del proyecto
  - Cliente asignado
  - Fecha de vencimiento
  - Tiempo restante (días y horas)
  - Horas restantes
  - Estado del proyecto
  - Porcentaje de completado

## 🧪 Cómo Probar el Sistema

### 1. Crear Proyecto de Prueba

1. Ir a `/projects`
2. Crear un nuevo proyecto
3. Establecer fecha de vencimiento en menos de 3 días desde hoy
4. Guardar el proyecto

### 2. Verificar Alertas Automáticas

- El sistema se ejecuta automáticamente al iniciar el servidor
- Se ejecuta cada 30 minutos automáticamente
- Revisar la consola del servidor para ver las alertas

### 3. Ejecutar Manualmente

```bash
# Llamar al endpoint de verificación
curl http://localhost:3000/api/cron/check-deadlines
```

### Con Autenticación

```bash
curl -H "Authorization: Bearer tu_cron_secret" \
  http://localhost:3000/api/cron/check-deadlines
```

## 📊 Criterios de Alerta

El sistema envía alertas para proyectos que cumplen:

- ✅ Estado: `pending`, `in_progress`, o `delayed`
- ✅ Vencen en **3 días (72 horas) o menos**
- ✅ Cálculo preciso incluyendo horas

## 🔄 Funcionamiento Dual

### Sistema de Consola (Simulado)

- ✅ **SIEMPRE activo**
- ✅ No requiere configuración
- ✅ Muestra información detallada en consola
- ✅ Útil para desarrollo y debugging

### Sistema de Email (Resend)

- ✅ **SIEMPRE intenta ejecutarse**
- ✅ Si `RESEND_API_KEY` está configurada → envía emails reales
- ✅ Si NO está configurada → muestra warning pero continúa
- ✅ Ambos sistemas funcionan simultáneamente sin interferir

## 📝 Archivos Relacionados

- `lib/services/alert-service.ts` - Lógica de alertas
- `lib/cron/deadline-checker.ts` - Verificador de deadlines
- `app/api/cron/check-deadlines/route.ts` - Endpoint API
- `lib/server-init.ts` - Inicialización automática

## ✅ Verificación

Para verificar que el sistema funciona:

1. ✅ Iniciar servidor: `npm run dev`
2. ✅ Revisar consola - Deberías ver las alertas automáticas
3. ✅ Revisar email - Si Resend está configurado, recibirás emails
4. ✅ Ambos sistemas funcionan simultáneamente

## 🎯 Resultado

- ✅ Sistema de alertas completamente funcional
- ✅ Evidencia en consola disponible
- ✅ Emails reales funcionando (con Resend configurado)
- ✅ Ambos sistemas operativos simultáneamente

