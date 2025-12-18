-- Función para actualizar el timestamp updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para generar alertas automáticamente cuando un proyecto está próximo a vencer
CREATE OR REPLACE FUNCTION check_project_deadlines()
RETURNS void AS $$
DECLARE
  project_record RECORD;
BEGIN
  FOR project_record IN
    SELECT id, name, due_date, status
    FROM projects
    WHERE status NOT IN ('completed', 'on_hold')
      AND due_date IS NOT NULL
  LOOP
    -- Alertas para proyectos que vencen en 3 días o menos
    IF project_record.due_date - CURRENT_DATE <= 3 AND project_record.due_date >= CURRENT_DATE THEN
      INSERT INTO alerts (project_id, alert_type, message, is_read)
      SELECT project_record.id, 'deadline_approaching', 
        'El proyecto "' || project_record.name || '" vence en ' || (project_record.due_date - CURRENT_DATE) || ' días',
        FALSE
      WHERE NOT EXISTS (
        SELECT 1 FROM alerts 
        WHERE project_id = project_record.id 
          AND alert_type = 'deadline_approaching'
          AND created_at > CURRENT_DATE
      );
    END IF;
    
    -- Alertas para proyectos vencidos
    IF project_record.due_date < CURRENT_DATE THEN
      INSERT INTO alerts (project_id, alert_type, message, is_read)
      SELECT project_record.id, 'overdue',
        'El proyecto "' || project_record.name || '" está vencido',
        FALSE
      WHERE NOT EXISTS (
        SELECT 1 FROM alerts 
        WHERE project_id = project_record.id 
          AND alert_type = 'overdue'
          AND created_at > CURRENT_DATE
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
