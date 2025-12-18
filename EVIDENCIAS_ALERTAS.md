# 📧 Evidencias del Sistema de Alertas de Correo

## 📋 Descripción

Este documento describe el sistema de evidencias implementado para el registro y verificación de alertas de correo electrónico en el sistema de gestión de proyectos freelance.

## 🎯 Objetivo

El sistema genera **evidencias automáticas** de todas las alertas de correo enviadas, registrándolas en la consola del servidor como prueba de que las alertas fueron procesadas correctamente.

## 📍 Ubicación de las Evidencias

Las evidencias se registran en:
- **Consola del servidor** (terminal donde se ejecuta `npm run dev`)
- **Logs del servidor** (salida estándar)
- **Base de datos** (tabla `alerts` para historial)

## 🔍 Qué se Registra como Evidencia

Cada alerta generada incluye la siguiente información:

### 1. Información del Proyecto
- ✅ Nombre del proyecto
- ✅ Cliente asociado
- ✅ Días hasta vencimiento
- ✅ Fecha de vencimiento
- ✅ Estado del proyecto

### 2. Información del Correo
- ✅ Destinatario (email configurado)
- ✅ Asunto del correo
- ✅ Fecha y hora de envío (timestamp)
- ✅ Contenido HTML completo
- ✅ Contenido en texto plano

### 3. Estado de Procesamiento
- ✅ Confirmación de registro en consola
- ✅ Estado de envío (éxito o error)
- ✅ Resumen de proyectos verificados

## 📊 Formato de las Evidencias

### Estructura de la Evidencia

```
================================================================================
📧 SIMULACIÓN DE ALERTA DE CORREO (evidencia en consola)
================================================================================
📬 Destinatario: [email]
📌 Asunto: [asunto del correo]
🕐 Fecha/Hora: [fecha formateada]
📅 Timestamp: [timestamp ISO]
--------------------------------------------------------------------------------
📄 CONTENIDO HTML:
--------------------------------------------------------------------------------
[HTML completo del correo]
--------------------------------------------------------------------------------
📄 CONTENIDO TEXTO PLANO:
--------------------------------------------------------------------------------
[Texto plano del correo]
================================================================================
✅ Simulación registrada en consola/log
================================================================================
```

## 🔄 Proceso de Generación de Evidencias

### 1. Verificación Automática
- Se ejecuta automáticamente al cargar cualquier página
- Verifica proyectos que vencen en 3 días o menos
- Filtra proyectos con estado `pending` o `in_progress`

### 2. Detección de Proyectos Urgentes
- Calcula días hasta vencimiento
- Identifica proyectos vencidos (días negativos)
- Identifica proyectos próximos a vencer (0-3 días)

### 3. Generación de Evidencia
- Para cada proyecto urgente, genera el correo completo
- Registra toda la información en consola
- Crea registro en base de datos (tabla `alerts`)

### 4. Resumen Final
- Muestra estadísticas de la verificación
- Confirma que todas las alertas fueron registradas
- Indica si hubo errores

## 📝 Ejemplo Completo de Evidencia

```
================================================================================
🔔 Iniciando verificación automática de alertas...
================================================================================

🔍 Consultando proyectos activos desde Supabase...
✅ Proyectos obtenidos de la base de datos: 5

🔍 Verificando 5 proyecto(s) activo(s) para alertas...
📅 Umbral configurado: 3 días o menos
📅 Fecha de hoy: 2025-12-17

  📋 Proyecto: "Sitio Web E-commerce" | Estado: in_progress | Vence: 2025-12-19 (2025-12-19) | Días restantes: 2 | ¿Urgente? ✅ SÍ (umbral: 3)
  ⚠️  Proyecto urgente detectado: "Sitio Web E-commerce" (2 días)

📊 Total de proyectos urgentes encontrados: 1

================================================================================
📧 INICIANDO ENVÍO DE ALERTAS POR CORREO
================================================================================
📬 Destinatario configurado: josgus15@outlook.com
📊 Total de proyectos que requieren alerta: 1
================================================================================

--------------------------------------------------------------------------------
📨 PROCESANDO ALERTA #1/1
   Proyecto: "Sitio Web E-commerce"
   Cliente: Cliente ABC
   Días hasta vencimiento: 2
   Fecha de vencimiento: 2025-12-19
--------------------------------------------------------------------------------

================================================================================
📧 SIMULACIÓN DE ALERTA DE CORREO (evidencia en consola)
================================================================================
📬 Destinatario: josgus15@outlook.com
📌 Asunto: ⚠️ Proyecto Próximo a Vencer: Sitio Web E-commerce
🕐 Fecha/Hora: 17/12/2025, 15:30:45
📅 Timestamp: 2025-12-17T15:30:45.123Z
--------------------------------------------------------------------------------
📄 CONTENIDO HTML:
--------------------------------------------------------------------------------
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background: #f59e0b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
		.content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
		.project-info { background: white; padding: 15px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #f59e0b; }
		.footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
		.button { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 10px; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1 style="margin: 0;">⚠️ Alerta de Vencimiento</h1>
		</div>
		<div class="content">
			<p>Hola,</p>
			<p>Te informamos sobre el siguiente proyecto:</p>
			
			<div class="project-info">
				<h2 style="margin-top: 0;">Sitio Web E-commerce</h2>
				<p><strong>Cliente:</strong> Cliente ABC</p>
				<p><strong>Fecha de Vencimiento:</strong> 19 de diciembre de 2025</p>
				<p><strong>Estado:</strong> Vence en 2 días</p>
			</div>

			<p>Por favor, revisa el estado del proyecto y toma las acciones necesarias.</p>
			
			<a href="http://localhost:3000/projects" class="button">Ver Proyectos</a>
		</div>
		<div class="footer">
			<p>Este es un correo automático del sistema de gestión de proyectos.</p>
			<p>Freelance Project Manager</p>
		</div>
	</div>
</body>
</html>
--------------------------------------------------------------------------------
📄 CONTENIDO TEXTO PLANO:
--------------------------------------------------------------------------------
⚠️ ALERTA DE VENCIMIENTO

Hola,

Te informamos sobre el siguiente proyecto:

Proyecto: Sitio Web E-commerce
Cliente: Cliente ABC
Fecha de Vencimiento: 19 de diciembre de 2025
Estado: Vence en 2 días

Por favor, revisa el estado del proyecto y toma las acciones necesarias.

Ver proyectos: http://localhost:3000/projects

---
Este es un correo automático del sistema de gestión de proyectos.
Freelance Project Manager
================================================================================
✅ Simulación registrada en consola/log
================================================================================

  ✅ Alerta procesada exitosamente para: "Sitio Web E-commerce"
     → Simulación registrada en consola/log
     → Correo real enviado al destinatario

================================================================================
📊 RESUMEN FINAL DE VERIFICACIÓN DE ALERTAS
================================================================================
✅ Proyectos verificados: 5
⚠️  Proyectos urgentes encontrados: 1
📧 Alertas procesadas: 1
   → Todas las alertas fueron registradas en consola/log como evidencia
================================================================================
```

## 🔧 Cómo Verificar las Evidencias

### Método 1: Consola del Servidor
1. Abre la terminal donde se ejecuta `npm run dev`
2. Refresca cualquier página de la aplicación
3. Observa los logs que aparecen en la consola
4. Busca las secciones marcadas con `📧 SIMULACIÓN DE ALERTA DE CORREO`

### Método 2: Verificación Manual
Ejecuta el script de verificación:
```bash
npm run check-alerts
```

### Método 3: API Endpoint
Haz una petición GET a:
```
http://localhost:3000/api/alerts/check
```

### Método 4: Base de Datos
Consulta la tabla `alerts` en Supabase:
```sql
SELECT * FROM alerts 
ORDER BY created_at DESC 
LIMIT 10;
```

## 📋 Criterios de Detección

Las alertas se generan para proyectos que cumplen:

1. **Estado del Proyecto:**
   - `pending` (Pendiente)
   - `in_progress` (En Progreso)
   - ❌ NO incluye: `completed` o `delayed`

2. **Fecha de Vencimiento:**
   - Proyectos que vencen en **3 días o menos**
   - Proyectos **vencidos** (fecha pasada)

3. **Frecuencia:**
   - Se verifica automáticamente al cargar cualquier página
   - Se ejecuta en segundo plano (no bloquea la aplicación)

## 🎨 Tipos de Alertas

### 1. Proyecto Próximo a Vencer
- **Asunto:** `⚠️ Proyecto Próximo a Vencer: [Nombre]`
- **Tipo:** `deadline_approaching`
- **Condición:** Vence en 0-3 días

### 2. Proyecto Vencido
- **Asunto:** `🚨 Proyecto Vencido: [Nombre]`
- **Tipo:** `overdue`
- **Condición:** Fecha de vencimiento pasada

## 📊 Estadísticas Registradas

Cada verificación genera un resumen con:
- ✅ Total de proyectos verificados
- ⚠️ Proyectos urgentes encontrados
- 📧 Alertas procesadas exitosamente
- ❌ Errores (si los hay)

## 🔐 Seguridad y Privacidad

- Las evidencias se registran **solo en la consola del servidor**
- No se almacenan en archivos de log externos
- La información es visible solo para quien tiene acceso al servidor
- Los correos reales se envían según la configuración (`EMAIL_SIMULATION`)

## ⚙️ Configuración

### Variables de Entorno Relevantes

```env
# Modo de simulación
EMAIL_SIMULATION=false  # false = Real + Preview, true = Solo Preview

# Email del destinatario
ALERT_EMAIL=josgus15@outlook.com

# Proveedor de correo (si EMAIL_SIMULATION=false)
EMAIL_PROVIDER=resend
RESEND_API_KEY=tu_api_key
```

## 📝 Notas Importantes

1. **Siempre se registra en consola:** Independientemente del modo (simulación o real), todas las alertas se registran en consola como evidencia.

2. **No se pierden evidencias:** Si el correo real falla, la evidencia en consola siempre se genera.

3. **Formato consistente:** Todas las evidencias siguen el mismo formato para facilitar la lectura y verificación.

4. **Timestamp incluido:** Cada evidencia incluye timestamp ISO para referencia temporal exacta.

## 🚀 Uso en Producción

En producción, las evidencias pueden ser:
- Redirigidas a un archivo de log
- Enviadas a un servicio de logging (como Loggly, Papertrail, etc.)
- Monitoreadas con herramientas de observabilidad

Ejemplo de redirección:
```bash
npm run dev > logs/alerts.log 2>&1
```

## 📞 Soporte

Para más información sobre el sistema de alertas, consulta:
- `README.md` - Documentación general del proyecto
- `ALERTAS_SETUP.md` - Configuración de alertas
- `lib/services/alert-checker.ts` - Código fuente del verificador
- `lib/services/email-service.ts` - Código fuente del servicio de correo

---

**Última actualización:** Diciembre 2025  
**Versión del sistema:** 1.0.0

