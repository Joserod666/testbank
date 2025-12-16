-- Insertar clientes de ejemplo
INSERT INTO clients (name, email, phone, company, notes) VALUES
  ('TechStart Inc', 'contact@techstart.com', '+1-555-0101', 'TechStart Inc', 'Cliente desde 2023, enfocado en startups tech'),
  ('Global Retail Co', 'info@globalretail.com', '+1-555-0102', 'Global Retail Co', 'Cadena de retail que necesita modernización digital'),
  ('HealthCare Plus', 'hello@healthcareplus.com', '+1-555-0103', 'HealthCare Plus', 'Sector salud, alta prioridad en seguridad'),
  ('EduLearn', 'support@edulearn.com', '+1-555-0104', 'EduLearn', 'Plataforma educativa en crecimiento'),
  ('Finance Hub', 'contact@financehub.com', '+1-555-0105', 'Finance Hub', 'Fintech que busca escalabilidad');

-- Insertar proyectos de ejemplo con diferentes estados y fechas
INSERT INTO projects (client_id, name, description, status, priority, start_date, due_date, completion_percentage, budget)
SELECT 
  c.id,
  p.name,
  p.description,
  p.status,
  p.priority,
  p.start_date,
  p.due_date,
  p.completion_percentage,
  p.budget
FROM clients c
CROSS JOIN (
  VALUES
    ('Dashboard Analytics', 'Desarrollo de dashboard con métricas en tiempo real', 'in_progress', 'high', '2025-01-05', '2025-01-20', 65, 8500.00),
    ('E-commerce Platform', 'Plataforma completa de comercio electrónico con pasarela de pagos', 'in_progress', 'urgent', '2024-12-10', '2025-01-18', 80, 15000.00),
    ('Mobile App Redesign', 'Rediseño completo de la aplicación móvil', 'pending', 'medium', '2025-01-20', '2025-02-28', 10, 12000.00),
    ('API Integration', 'Integración de APIs de terceros para automatización', 'in_progress', 'high', '2024-12-01', '2025-01-15', 90, 5500.00),
    ('Landing Page', 'Nueva landing page con optimización SEO', 'completed', 'low', '2024-11-15', '2024-12-30', 100, 3000.00),
    ('CRM System', 'Sistema de gestión de relaciones con clientes', 'in_progress', 'medium', '2025-01-01', '2025-03-15', 35, 20000.00),
    ('Payment Gateway', 'Implementación de pasarela de pagos segura', 'delayed', 'urgent', '2024-12-15', '2025-01-25', 50, 9000.00)
) AS p(name, description, status, priority, start_date, due_date, completion_percentage, budget)
WHERE c.name = CASE 
  WHEN p.name = 'Dashboard Analytics' THEN 'TechStart Inc'
  WHEN p.name = 'E-commerce Platform' THEN 'Global Retail Co'
  WHEN p.name = 'Mobile App Redesign' THEN 'HealthCare Plus'
  WHEN p.name = 'API Integration' THEN 'TechStart Inc'
  WHEN p.name = 'Landing Page' THEN 'EduLearn'
  WHEN p.name = 'CRM System' THEN 'Finance Hub'
  WHEN p.name = 'Payment Gateway' THEN 'Global Retail Co'
END;

-- Insertar alertas de ejemplo
INSERT INTO alerts (project_id, alert_type, message, is_read)
SELECT 
  p.id,
  CASE 
    WHEN p.due_date < CURRENT_DATE THEN 'overdue'
    WHEN p.due_date - CURRENT_DATE <= 3 THEN 'deadline_approaching'
    ELSE 'status_change'
  END,
  CASE 
    WHEN p.due_date < CURRENT_DATE THEN 'Proyecto "' || p.name || '" está vencido'
    WHEN p.due_date - CURRENT_DATE <= 3 THEN 'Proyecto "' || p.name || '" vence en ' || (p.due_date - CURRENT_DATE) || ' días'
    ELSE 'El estado del proyecto "' || p.name || '" ha cambiado a ' || p.status
  END,
  FALSE
FROM projects p
WHERE p.status != 'completed';
