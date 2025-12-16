-- Migración: Agregar campo status a clients y actualizar estados de projects
-- Ejecutar este script después de tener datos en las tablas

-- 1. Agregar campo status a la tabla clients
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Actualizar todos los clientes existentes a 'active' si no tienen valor
UPDATE clients SET status = 'active' WHERE status IS NULL;

-- 2. Actualizar los estados de proyectos
-- Primero, mapear los estados antiguos a los nuevos:
-- planning -> pending
-- in_progress -> in_progress (se mantiene)
-- review -> in_progress (se convierte a en progreso)
-- completed -> completed (se mantiene)
-- on_hold -> delayed (se convierte a retrasado)

-- Actualizar los estados existentes
UPDATE projects SET status = 'pending' WHERE status = 'planning';
UPDATE projects SET status = 'in_progress' WHERE status = 'review';
UPDATE projects SET status = 'delayed' WHERE status = 'on_hold';

-- Eliminar la constraint antigua y crear una nueva
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
	CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed'));

-- Actualizar el valor por defecto
ALTER TABLE projects ALTER COLUMN status SET DEFAULT 'pending';

-- 3. Crear índice para el nuevo campo status en clients
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

