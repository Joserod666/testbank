# 🚀 Configuración de GitHub

## 📋 Pasos para subir el proyecto a GitHub

### 1. Crear un repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Click en el botón "+" (arriba a la derecha) → "New repository"
3. Nombre del repositorio: `freelance-project-manager` (o el que prefieras)
4. Descripción: "Sistema de gestión de proyectos freelance con Next.js y Supabase"
5. Elige si será público o privado
6. **NO** inicialices con README, .gitignore o licencia (ya tenemos estos archivos)
7. Click en "Create repository"

### 2. Conectar el repositorio local con GitHub

Ejecuta estos comandos en la terminal (reemplaza `TU_USUARIO` y `TU_REPOSITORIO`):

```bash
# Agregar el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# Cambiar a la rama main (si es necesario)
git branch -M main

# Subir los cambios
git push -u origin main
```

### 3. Si ya tienes un repositorio en GitHub

Si ya creaste el repositorio y tienes la URL, ejecuta:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### 4. Autenticación

Si GitHub te pide autenticación:
- **Token de acceso personal**: Necesitarás crear un Personal Access Token en GitHub
- Ve a: Settings → Developer settings → Personal access tokens → Tokens (classic)
- Crea un nuevo token con permisos de `repo`
- Usa ese token como contraseña cuando git te lo pida

## 📝 Comandos útiles

### Ver el estado del repositorio
```bash
git status
```

### Ver commits
```bash
git log --oneline
```

### Agregar cambios futuros
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### Verificar remoto configurado
```bash
git remote -v
```

## ⚠️ Archivos que NO se suben (por .gitignore)

- `node_modules/` - Dependencias
- `.next/` - Build de Next.js
- `.env.local` - Variables de entorno (¡IMPORTANTE! No subir)
- Archivos de sistema

## 🔐 Variables de Entorno

**IMPORTANTE**: El archivo `.env.local` NO se sube a GitHub por seguridad.

Asegúrate de documentar las variables necesarias en el README o crear un `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
RESEND_API_KEY=tu_key
RESEND_FROM_EMAIL=tu_email
ALERT_DEFAULT_EMAIL=tu_email
CRON_SECRET=tu_secret
```

## ✅ Estado Actual

- ✅ Repositorio git inicializado
- ✅ Commit inicial realizado
- ⏳ Pendiente: Conectar con repositorio remoto de GitHub

