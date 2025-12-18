# 📋 Freelance Project Manager

Sistema de gestión de proyectos freelance con seguimiento de clientes, proyectos, alertas y línea de tiempo.

## 🎯 Descripción del Proyecto

Sistema completo de gestión de proyectos freelance que permite:
- Gestionar clientes y proyectos
- Visualizar proyectos en diferentes vistas (Lista, Calendario, Gantt)
- Recibir alertas automáticas de proyectos próximos a vencer
- Autenticación sin contraseña usando Supabase MPC

## 🏗️ Arquitectura de la Solución

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                             │
│  React 19.2.0 + Next.js 16.0.10 + TypeScript           │
│  Tailwind CSS + Radix UI + Lucide Icons                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    BACKEND                               │
│  Next.js API Routes (Node.js)                           │
│  - /api/cron/check-deadlines                            │
│  - /auth/callback                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              SERVICIOS EXTERNOS                         │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  Supabase    │  │    Resend    │                    │
│  │  PostgreSQL  │  │  Email API   │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### Estructura del Proyecto

```
freelance-project-manager/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Dashboard principal
│   ├── projects/                 # Página de proyectos
│   ├── clients/                  # Página de clientes
│   ├── timeline/                 # Página de timeline
│   ├── auth/                     # Autenticación
│   │   ├── login/                # Página de login
│   │   ├── signup/               # Página de registro
│   │   └── callback/             # Callback de autenticación
│   └── api/                      # API Routes
│       └── cron/
│           └── check-deadlines/  # Endpoint de verificación
├── components/                    # Componentes React
│   ├── dashboard/              # Componentes del dashboard
│   ├── projects/                 # Componentes de proyectos
│   ├── clients/                  # Componentes de clientes
│   ├── timeline/                 # Componentes de timeline
│   ├── auth/                     # Componentes de autenticación
│   └── ui/                       # Componentes UI reutilizables
├── lib/                          # Utilidades y servicios
│   ├── supabase/                 # Clientes de Supabase
│   │   ├── client.ts             # Cliente del navegador
│   │   ├── server.ts             # Cliente del servidor
│   │   └── mpc.ts                # Funciones de autenticación MPC
│   ├── services/                 # Servicios de negocio
│   │   └── alert-service.ts      # Servicio de alertas
│   ├── cron/                     # Tareas programadas
│   │   └── deadline-checker.ts   # Verificador de deadlines
│   ├── utils/                    # Utilidades
│   │   ├── date-helpers.ts       # Helpers de fechas
│   │   └── utils.ts              # Utilidades generales
│   └── types.ts                  # Tipos TypeScript
├── scripts/                      # Scripts SQL
│   ├── 001_create_tables.sql     # Creación de tablas
│   ├── 002_insert_sample_data.sql # Datos de ejemplo
│   ├── 003_create_functions.sql  # Funciones SQL
│   └── 004_migrate_project_status.sql # Migración de estados
├── hooks/                        # Custom hooks
│   ├── use-auth.ts               # Hook de autenticación
│   └── use-toast.ts              # Hook de notificaciones
└── public/                       # Archivos estáticos
```

### Flujo de Datos

```
Usuario → React Component → Next.js API Route → Supabase → PostgreSQL
                                    ↓
                              Resend API (Emails)
```

### Base de Datos

**PostgreSQL (Supabase)** con las siguientes tablas:

1. **clients** - Información de clientes
2. **projects** - Proyectos con relación a clientes
3. **alerts** - Sistema de alertas automáticas

Ver `scripts/001_create_tables.sql` para el esquema completo.

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- npm o pnpm
- Cuenta de Supabase
- Cuenta de Resend (opcional, para emails)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env.local`:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
   
   # Resend (Opcional)
   RESEND_API_KEY=re_tu_api_key
   RESEND_FROM_EMAIL=noreply@tudominio.com
   ALERT_DEFAULT_EMAIL=admin@tudominio.com
   CRON_SECRET=tu_secret_seguro
   ```

4. **Configurar base de datos**
   
   Ejecutar los scripts SQL en Supabase Dashboard:
   - `scripts/001_create_tables.sql`
   - `scripts/002_insert_sample_data.sql` (opcional)
   - `scripts/003_create_functions.sql`
   - `scripts/004_migrate_project_status.sql` (si hay datos existentes)

5. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📦 Funcionalidades Implementadas

### ✅ Gestión de Clientes (CRUD Completo)
- Crear, leer, actualizar y eliminar clientes
- Campos: Nombre, Email, Teléfono, Empresa, Notas

### ✅ Gestión de Proyectos (CRUD Completo)
- Crear, leer, actualizar y eliminar proyectos
- Campos requeridos:
  - Nombre del Proyecto
  - Cliente Asignado (relación)
  - Fecha de Inicio
  - Fecha de Vencimiento
  - Estado (Pendiente, En Progreso, Completado, Retrasado)
  - Presupuesto Estimado (opcional)

### ✅ Dashboard
- Vista de tabla con todos los proyectos
- Filtros por Estado y Cliente
- Acción rápida: Marcar proyecto como "Completado"
- Estadísticas generales
- Proyectos activos
- Alertas recientes
- Próximos vencimientos

### ✅ Línea de Tiempo
- **Vista Lista**: Proyectos agrupados por vencimiento
- **Vista Calendario**: Organizado por fecha
- **Vista Gantt**: Gráfico de barras horizontal
- Resaltado especial para proyectos que vencen en menos de 7 días
- Cálculo preciso con horas

### ✅ Sistema de Alertas Automáticas
- Verificación automática al iniciar el servidor
- Verificación periódica cada 30 minutos (60 en producción)
- Alertas para proyectos que vencen en 3 días o menos
- **Doble sistema**:
  - Consola (simulado) - Siempre activo
  - Email (Resend) - Si está configurado
- Ambos sistemas funcionan simultáneamente

### ✅ Autenticación MPC (Multi-Party Computation)
- Autenticación sin contraseña
- Magic Links por email
- Integración con Supabase

## 🔔 Sistema de Alertas

### Funcionamiento

El sistema verifica automáticamente proyectos que vencen en **3 días (72 horas) o menos**.

**Ejecución:**
- Al iniciar el servidor
- Cada 30 minutos (desarrollo) / 60 minutos (producción)
- Manualmente: `GET /api/cron/check-deadlines`

### Evidencia de Funcionamiento

**Alertas por Consola (Simulado):**
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

**Alertas por Email (Resend):**
- Email enviado al cliente o email por defecto
- Incluye información completa del proyecto
- Confirmación en consola: `✅ Email enviado exitosamente: { id: '...' }`

## 📊 Scripts SQL

### 001_create_tables.sql
Crea las tablas principales:
- `clients` - Tabla de clientes
- `projects` - Tabla de proyectos
- `alerts` - Tabla de alertas

### 002_insert_sample_data.sql
Inserta datos de ejemplo para pruebas

### 003_create_functions.sql
Crea funciones SQL útiles

### 004_migrate_project_status.sql
Migra estados antiguos a los nuevos valores requeridos

## 🧪 Pruebas

### Probar el Sistema de Alertas

1. **Crear un proyecto con fecha de vencimiento cercana** (menos de 3 días)
2. **Revisar la consola del servidor** - Deberías ver las alertas
3. **Revisar el email** - Si Resend está configurado, recibirás el email

### Probar Manualmente

```bash
# Llamar al endpoint de verificación
curl http://localhost:3000/api/cron/check-deadlines
```

## 📸 Evidencia de Funcionamiento

### Pantallazos Recomendados

1. **Dashboard principal** - Mostrando tabla de proyectos
2. **Vista de Timeline** - Mostrando las 3 vistas (Lista, Calendario, Gantt)
3. **Formulario de creación de proyecto** - Con todos los campos
4. **Consola del servidor** - Mostrando alertas automáticas
5. **Email recibido** - Evidencia de alerta por email (si está configurado)

### Video/Demo Recomendado

1. Crear un nuevo proyecto
2. Filtrar proyectos en el dashboard
3. Marcar proyecto como completado
4. Cambiar entre vistas en Timeline
5. Mostrar alertas en consola

## 🔐 Seguridad

- Variables de entorno para credenciales
- Autenticación con Supabase MPC
- Validación de datos en formularios
- Protección de endpoints con CRON_SECRET

## 📝 Notas de Desarrollo

- Código formateado con tabulación
- TypeScript para type safety
- Componentes reutilizables
- Separación de responsabilidades
- Documentación inline donde es necesario

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción

# Calidad
npm run lint         # Ejecuta linter
```

## 📚 Documentación Adicional

- `RESEND_SETUP.md` - Configuración detallada de Resend
- `TECNOLOGIAS_UTILIZADAS.md` - Stack tecnológico completo
- `lib/services/alert-service.md` - Documentación del sistema de alertas

## 🎯 Entregables

✅ **1. Código fuente funcional y ordenado**
- Código estructurado y documentado
- Formato consistente (tabulación)
- TypeScript para type safety

✅ **2. Evidencia de funcionamiento**
- Ver sección "Pantallazos Recomendados"
- Sistema completamente funcional

✅ **3. Script SQL de base de datos**
- `scripts/001_create_tables.sql`
- `scripts/002_insert_sample_data.sql`
- `scripts/003_create_functions.sql`
- `scripts/004_migrate_project_status.sql`

✅ **4. Simulación de alertas de correo**
- Alertas por consola (siempre activas)
- Logs detallados en consola del servidor
- Ver sección "Sistema de Alertas"

✅ **5. README.md con arquitectura**
- Este archivo contiene toda la información
- Arquitectura detallada
- Diagramas de flujo
- Instrucciones de instalación

## 👨‍💻 Autor

Desarrollado como proyecto de gestión freelance.

## 📄 Licencia

Proyecto educativo/demostrativo.

