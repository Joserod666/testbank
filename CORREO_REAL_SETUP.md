# Configuración de Correo Real

Guía para configurar el envío de correos reales en lugar de simulación.

## Opción 1: Resend (Recomendado - Más Fácil)

Resend es un servicio moderno y fácil de usar.

### Pasos:

1. **Crear cuenta en Resend:**
   - Ve a https://resend.com
   - Crea una cuenta gratuita
   - Obtén tu API Key desde el dashboard

2. **Configurar variables de entorno:**

Agrega a tu archivo `.env.local`:

```env
EMAIL_SIMULATION=false
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=noreply@tudominio.com
ALERT_EMAIL=tu@email.com
```

3. **Verificar dominio (opcional pero recomendado):**
   - En Resend, verifica tu dominio para enviar desde tu propio dominio
   - O usa el dominio de prueba de Resend para desarrollo

**Listo!** El sistema ahora enviará correos reales usando Resend.

---

## Opción 2: SendGrid

SendGrid es otro servicio popular de envío de correos.

### Pasos:

1. **Crear cuenta en SendGrid:**
   - Ve a https://sendgrid.com
   - Crea una cuenta gratuita (100 correos/día gratis)
   - Crea una API Key desde Settings → API Keys

2. **Configurar variables de entorno:**

```env
EMAIL_SIMULATION=false
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.tu_api_key_aqui
EMAIL_FROM=noreply@tudominio.com
ALERT_EMAIL=tu@email.com
```

---

## Opción 3: Mailgun

Mailgun ofrece un servicio robusto de envío de correos.

### Pasos:

1. **Crear cuenta en Mailgun:**
   - Ve a https://mailgun.com
   - Crea una cuenta (5,000 correos/mes gratis)
   - Obtén tu API Key y Domain desde el dashboard

2. **Configurar variables de entorno:**

```env
EMAIL_SIMULATION=false
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=tu_api_key_aqui
MAILGUN_DOMAIN=tu-dominio.com
EMAIL_FROM=noreply@tu-dominio.com
ALERT_EMAIL=tu@email.com
```

---

## Opción 4: SMTP Directo (Gmail, Outlook, etc.)

Puedes usar tu propio servidor SMTP (Gmail, Outlook, o cualquier servidor SMTP).

### Pasos:

1. **Instalar nodemailer:**

```bash
npm install nodemailer @types/nodemailer
```

2. **Configurar variables de entorno:**

Para Gmail:
```env
EMAIL_SIMULATION=false
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu@gmail.com
SMTP_PASSWORD=tu_app_password  # Usa App Password, no tu contraseña normal
EMAIL_FROM=tu@gmail.com
ALERT_EMAIL=tu@email.com
```

Para Outlook:
```env
EMAIL_SIMULATION=false
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu@outlook.com
SMTP_PASSWORD=tu_contraseña
EMAIL_FROM=tu@outlook.com
ALERT_EMAIL=tu@email.com
```

Para otro servidor SMTP:
```env
EMAIL_SIMULATION=false
EMAIL_PROVIDER=smtp
SMTP_HOST=tu-servidor-smtp.com
SMTP_PORT=587
SMTP_SECURE=false  # true para puerto 465
SMTP_USER=tu_usuario
SMTP_PASSWORD=tu_contraseña
EMAIL_FROM=noreply@tudominio.com
ALERT_EMAIL=tu@email.com
```

### Nota sobre Gmail:
- Necesitas generar una "App Password" desde tu cuenta de Google
- Ve a: Google Account → Security → 2-Step Verification → App passwords
- No uses tu contraseña normal de Gmail

---

## Verificación

Después de configurar, puedes probar el sistema:

1. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```

2. **Accede a la aplicación** - Las alertas se ejecutarán automáticamente

3. **O ejecuta manualmente:**
   ```bash
   npm run check-alerts
   ```

4. **O llama al endpoint API:**
   ```bash
   curl http://localhost:3000/api/alerts/check
   ```

Si todo está configurado correctamente, recibirás correos reales en lugar de ver la simulación en consola.

---

## Solución de Problemas

### Error: "API_KEY no está configurada"
- Verifica que hayas agregado la variable de entorno correcta
- Asegúrate de reiniciar el servidor después de cambiar `.env.local`

### Error: "Error al enviar correo"
- Verifica que tu API key sea válida
- Revisa que el dominio esté verificado (si es requerido)
- Para SMTP, verifica las credenciales y el puerto

### Los correos no llegan
- Revisa la carpeta de spam
- Verifica que el email destinatario sea correcto
- Revisa los logs del servidor para ver errores específicos

---

## Comparación de Servicios

| Servicio | Gratis | Facilidad | Recomendado Para |
|----------|--------|-----------|------------------|
| Resend   | 3,000/mes | ⭐⭐⭐⭐⭐ | Desarrollo y producción |
| SendGrid | 100/día | ⭐⭐⭐⭐ | Producción |
| Mailgun  | 5,000/mes | ⭐⭐⭐⭐ | Producción |
| SMTP     | Depende | ⭐⭐ | Si ya tienes servidor |

**Recomendación:** Empieza con Resend, es el más fácil de configurar.

