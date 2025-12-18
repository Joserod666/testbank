-- Migración de estados de proyectos
-- Actualiza los estados antiguos a los nuevos valores requeridos

-- Actualizar proyectos con estado 'planning' a 'pending'
UPDATE projects SET status = 'pending' WHERE status = 'planning';

-- Actualizar proyectos con estado 'review' a 'in_progress'
UPDATE projects SET status = 'in_progress' WHERE status = 'review';

-- Actualizar proyectos con estado 'on_hold' a 'delayed'
UPDATE projects SET status = 'delayed' WHERE status = 'on_hold';

-- Actualizar la constraint de la tabla para reflejar los nuevos estados
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed'));

-- Actualizar el valor por defecto
ALTER TABLE projects ALTER COLUMN status SET DEFAULT 'pending';

