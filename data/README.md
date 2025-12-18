# 📦 Datos Mock

Este directorio contiene datos de ejemplo para cargar en la base de datos.

## 📄 Archivos

- **`mock-data.json`**: Datos de ejemplo en formato JSON con clientes y proyectos

## 🚀 Cómo Cargar los Datos

### Opción 1: Usando el Script TypeScript

```bash
# Instalar tsx si no está instalado
npm install --save-dev tsx

# Cargar datos mock
npm run load-mock-data
```

### Opción 2: Usando SQL Directamente

Ejecuta el script SQL en Supabase Dashboard:

```bash
scripts/002_insert_sample_data.sql
```

### Opción 3: Manualmente desde JSON

1. Abre `data/mock-data.json`
2. Copia los datos
3. Insértalos manualmente en Supabase Dashboard

## 📋 Contenido de los Datos Mock

### Clientes (5)
- TechStart Inc
- Global Retail Co
- HealthCare Plus
- EduLearn
- Finance Hub

### Proyectos (7)
- Dashboard Analytics
- E-commerce Platform
- Mobile App Redesign
- API Integration
- Landing Page
- CRM System
- Payment Gateway

## ⚙️ Configuración Requerida

Asegúrate de tener configuradas las variables de entorno:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
```

## 🔄 Notas

- Los datos se insertan sin eliminar los existentes
- Si hay duplicados, el script puede fallar
- Asegúrate de ejecutar primero `001_create_tables.sql` antes de cargar datos

