# Freelance Project Manager

Sistema de gestión de proyectos freelance con funcionalidades completas de CRUD, dashboard, timeline y alertas automáticas por correo.

---

## 📐 Arquitectura de la Solución

### Visión General

La aplicación está construida siguiendo una **arquitectura de tres capas** (3-Tier Architecture) con separación clara entre presentación, lógica de negocio y persistencia de datos:

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                      │
│  (Next.js App Router - Server & Client Components)          │
│  • Páginas (app/)                                            │
│  • Componentes UI (components/)                              │
│  • Estilos (Tailwind CSS + shadcn/ui)                       │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  CAPA DE LÓGICA DE NEGOCIO                    │
│  (API Routes + Services)                                     │
│  • API Endpoints (app/api/)                                  │
│  • Servicios (lib/services/)                                 │
│  • Utilidades (lib/utils/)                                   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  CAPA DE PERSISTENCIA                        │
│  (Supabase - PostgreSQL)                                     │
│  • Base de datos relacional                                  │
│  • Funciones y triggers SQL                                  │
│  • Autenticación y seguridad                                 │
└─────────────────────────────────────────────────────────────┘
```

### Arquitectura por Capas

#### 1. **Capa de Presentación (Frontend)**

**Tecnología:** Next.js 16 con App Router

**Patrón:** Server Components + Client Components

- **Server Components:** 
  - Fetch de datos directamente desde el servidor
  - Mejor rendimiento y SEO
  - Ejemplos: `ProjectsTableWrapper`, `TimelineWrapper`, `DashboardStats`

- **Client Components:**
  - Interactividad del usuario (formularios, filtros, acciones)
  - Estado local con React Hooks
  - Ejemplos: `CreateProjectDialog`, `ProjectsFilters`, `TimelineView`

**Estructura:**
```
app/
├── page.tsx              # Dashboard (Server Component)
├── clients/page.tsx      # Lista de clientes
├── projects/page.tsx     # Lista de proyectos
├── timeline/page.tsx     # Vista de timeline
└── alerts/page.tsx       # Gestión de alertas

components/
├── dashboard/            # Componentes del dashboard
├── clients/              # CRUD de clientes
├── projects/             # CRUD de proyectos
├── timeline/             # Vistas de timeline (Lista, Calendario, Gantt)
├── alerts/               # Sistema de alertas
└── ui/                   # Componentes UI reutilizables (shadcn/ui)
```

#### 2. **Capa de Lógica de Negocio (Backend)**

**Tecnología:** Next.js API Routes + TypeScript Services

**Patrones de Diseño:**
- **Service Layer Pattern:** Separación de lógica de negocio en servicios reutilizables
- **Repository Pattern:** Abstracción de acceso a datos mediante Supabase client
- **Strategy Pattern:** Servicio de email configurable (simulación, Resend, SendGrid, etc.)

**Servicios Principales:**

1. **EmailService** (`lib/services/email-service.ts`)
   - Estrategia configurable para envío de correos
   - Soporte para simulación, Resend, SendGrid, Mailgun, SMTP
   - Generación de templates HTML/texto

2. **AlertChecker** (`lib/services/alert-checker.ts`)
   - Verificación de proyectos próximos a vencer
   - Lógica de negocio para alertas (umbral de 3 días)
   - Integración con EmailService y base de datos

**API Endpoints:**
```
app/api/
├── alerts/
│   ├── check/route.ts    # POST: Verificar y enviar alertas
│   └── test/route.ts      # POST: Enviar correo de prueba
```

#### 3. **Capa de Persistencia (Base de Datos)**

**Tecnología:** Supabase (PostgreSQL)

**Esquema de Base de Datos:**

```sql
clients (id, name, email, phone, company, notes, status, created_at, updated_at)
    ↓ (1:N)
projects (id, client_id, name, description, status, priority, 
         start_date, due_date, completion_percentage, budget, ...)
    ↓ (1:N)
alerts (id, project_id, alert_type, message, is_read, created_at)
```

**Características:**
- Relaciones con integridad referencial (ON DELETE CASCADE)
- Índices optimizados para consultas frecuentes
- Funciones y triggers SQL para automatización
- Migraciones versionadas (`scripts/001-004_*.sql`)

### Flujo de Datos

#### Flujo de Lectura (GET)
```
Usuario → Server Component → Supabase Client → PostgreSQL → Supabase → Server Component → UI
```

**Ejemplo:** Cargar lista de proyectos
1. Usuario accede a `/projects`
2. `app/projects/page.tsx` (Server Component) se ejecuta
3. Llama a `createClient()` desde `lib/supabase/server.ts`
4. Consulta a Supabase: `SELECT * FROM projects JOIN clients`
5. Datos se renderizan en el servidor
6. HTML enviado al cliente

#### Flujo de Escritura (POST/PUT/DELETE)
```
Usuario → Client Component → Form Action → API Route → Service → Supabase → PostgreSQL
```

**Ejemplo:** Crear un proyecto
1. Usuario completa formulario en `CreateProjectDialog`
2. Submit ejecuta `server action` o `fetch` a API
3. Validación de datos (Zod)
4. `EmailService` o `AlertChecker` si aplica
5. Inserción en Supabase
6. Actualización de UI (optimistic updates o refetch)

#### Flujo de Alertas Automáticas
```
Server Init → AutoAlertChecker → AlertChecker Service → EmailService → Resend API → Email
                                      ↓
                              Supabase (alerts table)
```

**Ejemplo:** Verificación automática de alertas
1. `AutoAlertChecker` se monta en `app/layout.tsx`
2. Ejecuta `checkAndSendProjectAlerts()` en background
3. `AlertChecker` consulta proyectos activos
4. Filtra proyectos con `due_date <= 3 días`
5. `EmailService` envía correos (simulado o real)
6. Crea registros en tabla `alerts`

### Patrones de Diseño Implementados

#### 1. **Server/Client Component Pattern**
- Separación clara entre componentes que necesitan interactividad y los que solo renderizan datos
- Optimización automática de bundle size

#### 2. **Service Layer Pattern**
- Lógica de negocio encapsulada en servicios (`lib/services/`)
- Reutilización entre API routes y componentes

#### 3. **Repository Pattern**
- Abstracción de acceso a datos mediante Supabase clients
- `lib/supabase/client.ts` (cliente-side)
- `lib/supabase/server.ts` (server-side)

#### 4. **Strategy Pattern**
- `EmailService` con múltiples estrategias de envío
- Configuración mediante variables de entorno

#### 5. **Wrapper Pattern**
- Server Components que actúan como wrappers para Client Components
- Ejemplo: `ProjectsTableWrapper` → `ProjectsTable`

### Decisiones de Diseño

#### ¿Por qué Next.js App Router?
- **Server Components:** Mejor rendimiento, menos JavaScript en cliente
- **File-based Routing:** Estructura intuitiva y mantenible
- **API Routes integradas:** Backend y frontend en un solo proyecto

#### ¿Por qué Supabase?
- **PostgreSQL:** Base de datos relacional robusta
- **Row Level Security:** Seguridad a nivel de fila
- **Real-time:** Capacidad de suscripciones en tiempo real (futuro)
- **Autenticación integrada:** Lista para escalar

#### ¿Por qué TypeScript?
- **Type Safety:** Detección de errores en tiempo de compilación
- **Autocompletado:** Mejor experiencia de desarrollo
- **Refactoring seguro:** Cambios con confianza

#### ¿Por qué shadcn/ui?
- **Componentes accesibles:** Basados en Radix UI
- **Customizables:** Código en tu proyecto, no dependencia externa
- **Consistentes:** Diseño coherente en toda la app

### Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| **Frontend Framework** | Next.js | 16.x | Framework React con SSR/SSG |
| **Lenguaje** | TypeScript | 5.x | Type safety y mejor DX |
| **UI Framework** | React | 18.x | Biblioteca de componentes |
| **Estilos** | Tailwind CSS | 3.x | Utility-first CSS |
| **Componentes UI** | shadcn/ui | Latest | Componentes accesibles |
| **Base de Datos** | PostgreSQL | 15+ | Base de datos relacional |
| **BaaS** | Supabase | Latest | Backend as a Service |
| **Email** | Resend | Latest | Servicio de envío de correos |
| **Validación** | Zod | 3.x | Schema validation |
| **Notificaciones** | Sonner | Latest | Toast notifications |
| **Fechas** | date-fns | Latest | Manipulación de fechas |

### Estructura Detallada del Proyecto

```
freelance-project-manager/
│
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Backend)
│   │   └── alerts/
│   │       ├── check/route.ts    # Endpoint: Verificar alertas
│   │       └── test/route.ts     # Endpoint: Probar correo
│   │
│   ├── alerts/page.tsx           # Página: Gestión de alertas
│   ├── clients/page.tsx          # Página: Lista de clientes
│   ├── projects/page.tsx         # Página: Lista de proyectos
│   ├── timeline/page.tsx         # Página: Timeline de proyectos
│   ├── page.tsx                  # Página: Dashboard principal
│   ├── layout.tsx                # Layout raíz (AutoAlertChecker)
│   └── globals.css               # Estilos globales
│
├── components/                    # Componentes React
│   ├── alerts/
│   │   ├── auto-alert-checker.tsx    # Verificación automática
│   │   ├── generate-alerts-button.tsx # Botón manual
│   │   └── test-email-button.tsx      # Botón de prueba
│   │
│   ├── clients/
│   │   ├── create-client-dialog.tsx   # Form: Crear cliente
│   │   ├── edit-client-dialog.tsx     # Form: Editar cliente
│   │   └── clients-list.tsx           # Lista de clientes
│   │
│   ├── dashboard/
│   │   ├── dashboard-stats.tsx        # Estadísticas
│   │   ├── projects-table.tsx         # Tabla de proyectos
│   │   └── projects-table-wrapper.tsx # Wrapper (Server)
│   │
│   ├── projects/
│   │   ├── create-project-dialog.tsx   # Form: Crear proyecto
│   │   ├── edit-project-dialog.tsx    # Form: Editar proyecto
│   │   ├── projects-list.tsx          # Lista de proyectos
│   │   └── projects-filters.tsx        # Filtros
│   │
│   ├── timeline/
│   │   ├── timeline-view.tsx          # Vista principal (Lista/Cal/Gantt)
│   │   ├── timeline-list.tsx          # Vista de lista
│   │   ├── timeline-calendar.tsx      # Vista de calendario
│   │   ├── timeline-gantt.tsx         # Vista Gantt
│   │   └── timeline-wrapper.tsx       # Wrapper (Server)
│   │
│   └── ui/                        # Componentes UI (shadcn/ui)
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       └── ...
│
├── lib/                          # Librerías y utilidades
│   ├── services/
│   │   ├── email-service.ts      # Servicio de correo (Strategy)
│   │   └── alert-checker.ts      # Lógica de alertas
│   │
│   ├── supabase/
│   │   ├── client.ts             # Cliente Supabase (client-side)
│   │   └── server.ts             # Cliente Supabase (server-side)
│   │
│   ├── types.ts                  # Tipos TypeScript
│   │
│   └── utils/
│       ├── date-helpers.ts       # Utilidades de fechas
│       ├── server-init.ts       # Inicialización del servidor
│       └── utils.ts             # Utilidades generales
│
├── scripts/                      # Scripts SQL y CLI
│   ├── 001_create_tables.sql    # Crear tablas
│   ├── 002_insert_sample_data.sql # Datos de ejemplo
│   ├── 003_create_functions.sql  # Funciones y triggers
│   ├── 004_migration_update_schema.sql # Migración de esquema
│   └── check-alerts.ts           # CLI: Verificar alertas
│
├── public/                       # Archivos estáticos
│   ├── icon-*.png
│   └── placeholder-*.{jpg,svg}
│
├── .env.local                    # Variables de entorno (NO commitear)
├── .gitignore                    # Archivos ignorados por Git
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración TypeScript
├── tailwind.config.ts            # Configuración Tailwind
├── components.json               # Configuración shadcn/ui
│
└── README.md                     # Este archivo
```

### Flujos de Usuario Principales

#### 1. **Gestión de Clientes**
```
Usuario → /clients → ClientsList (Server) → CreateClientDialog (Client)
  → Form Submit → Server Action → Supabase INSERT → Refresh UI
```

#### 2. **Gestión de Proyectos**
```
Usuario → /projects → ProjectsList (Server) → CreateProjectDialog (Client)
  → Form Submit → Server Action → Supabase INSERT → Refresh UI
```

#### 3. **Dashboard**
```
Usuario → / → DashboardPage (Server) → ProjectsTableWrapper (Server)
  → Fetch Projects → Supabase SELECT → ProjectsTable (Client) → Render
```

#### 4. **Timeline**
```
Usuario → /timeline → TimelinePage (Server) → TimelineWrapper (Server)
  → Fetch Projects → TimelineView (Client) → Select View → Render
```

#### 5. **Sistema de Alertas**
```
Server Init → AutoAlertChecker → checkAndSendProjectAlerts()
  → Query Projects → Filter Urgent → EmailService.sendEmail()
  → Resend API → Email Sent → Insert Alert → Log Result
```

### Seguridad

#### Variables de Entorno
- Credenciales sensibles en `.env.local` (no versionado)
- `.gitignore` configurado para proteger secretos

#### Validación de Datos
- **Zod:** Validación de schemas en formularios y API
- **TypeScript:** Type safety en tiempo de compilación
- **Supabase RLS:** Row Level Security (configurable)

#### Autenticación (Futuro)
- Supabase Auth listo para implementar
- JWT tokens para sesiones

### Escalabilidad

#### Optimizaciones Actuales
- **Server Components:** Menos JavaScript en cliente
- **Índices SQL:** Consultas optimizadas
- **Lazy Loading:** Componentes cargados bajo demanda

#### Mejoras Futuras
- **Caching:** Redis para datos frecuentes
- **CDN:** Assets estáticos en CDN
- **Real-time:** Supabase subscriptions para actualizaciones en vivo
- **Paginación:** Para listas grandes
- **Búsqueda:** Full-text search en PostgreSQL

---

## 🚀 Características

### Gestión de Clientes
- CRUD completo de clientes
- Campo de estado (Activo/Inactivo)
- Información de contacto y notas

### Gestión de Proyectos
- CRUD completo de proyectos
- Estados: Pendiente, En Progreso, Completado, Retrasado
- Prioridades: Baja, Media, Alta, Urgente
- Fechas de inicio y vencimiento
- Presupuesto estimado
- Porcentaje de completado

### Dashboard
- Estadísticas generales
- Tabla de proyectos con filtros por estado y cliente
- Acción rápida para marcar proyectos como completados
- Vista de proyectos activos
- Alertas recientes
- Próximos vencimientos

### Timeline
- Vista de Lista (agrupada por vencimiento)
- Vista de Calendario (mensual con proyectos)
- Vista Gantt (diagrama de barras)
- Resaltado de proyectos próximos a vencer (< 7 días)

### Sistema de Alertas
- Verificación automática de proyectos próximos a vencer (3 días o menos)
- Envío de correos automáticos (Resend, SendGrid, Mailgun o SMTP)
- Simulación en consola (por defecto)
- Endpoint API para verificación manual
- Script CLI para ejecución manual
- Botón de prueba de correo

---

## 📦 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <repo-url>
   cd freelance-project-manager
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env.local` con:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=tu-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

   # Email (Opcional - para correo real)
   EMAIL_SIMULATION=true  # false para correo real
   EMAIL_PROVIDER=resend
   RESEND_API_KEY=tu-api-key
   EMAIL_FROM=noreply@resend.dev
   ALERT_EMAIL=tu@email.com
   ```

4. **Configurar la base de datos:**
   - Ve a tu proyecto en Supabase
   - Ejecuta los scripts SQL en orden:
     1. `scripts/001_create_tables.sql`
     2. `scripts/002_insert_sample_data.sql` (opcional)
     3. `scripts/003_create_functions.sql`
     4. `scripts/004_migration_update_schema.sql` (si ya tienes datos)

5. **Iniciar el servidor:**
   ```bash
   npm run dev
   ```

---

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run check-alerts` - Ejecuta verificación manual de alertas

---

## 📚 Documentación Adicional

- `ALERTAS_SETUP.md` - Configuración del sistema de alertas
- `CORREO_REAL_SETUP.md` - Guía para configurar correo real

---

## 🔌 API Endpoints

- `GET/POST /api/alerts/check` - Verifica y envía alertas
- `GET/POST /api/alerts/test` - Envía un correo de prueba

---

## 🔒 Características de Seguridad

- Variables de entorno para credenciales
- `.gitignore` configurado para proteger archivos sensibles
- Validación de datos con Zod
- TypeScript para type safety

---

## 📄 Licencia

Este proyecto está licenciado bajo la [MIT License](LICENSE).
