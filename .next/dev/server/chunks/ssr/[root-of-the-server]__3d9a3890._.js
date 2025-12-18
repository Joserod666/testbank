module.exports = [
"[next]/internal/font/google/geist_a7695b8e.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "geist_a7695b8e-module__Entzca__className",
});
}),
"[next]/internal/font/google/geist_a7695b8e.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a7695b8e$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_a7695b8e.module.css [app-rsc] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a7695b8e$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Geist', 'Geist Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a7695b8e$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a7695b8e$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/geist_mono_354fc78.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "geist_mono_354fc78-module__zrY5Sa__className",
});
}),
"[next]/internal/font/google/geist_mono_354fc78.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_354fc78$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_mono_354fc78.module.css [app-rsc] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_354fc78$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Geist Mono', 'Geist Mono Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_354fc78$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_354fc78$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://ixasfynswsdelghkbrgj.supabase.co"), ("TURBOPACK compile-time value", "sb_publishable_VasDtu3o4SOb1McpLAHJkw_kCa8Ymtw"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The "setAll" method was called from a Server Component.
                // This can be ignored if you have proxy refreshing
                // user sessions.
                }
            }
        },
        auth: {
            // Habilitar soporte para MPC (Multi-Party Computation)
            flowType: "pkce",
            autoRefreshToken: true,
            detectSessionInUrl: true,
            persistSession: true
        }
    });
}
}),
"[project]/lib/utils/date-helpers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "getDateStatus",
    ()=>getDateStatus,
    "getDaysUntil",
    ()=>getDaysUntil,
    "getHoursUntil",
    ()=>getHoursUntil,
    "getTimeUntilFormatted",
    ()=>getTimeUntilFormatted,
    "isOverdue",
    ()=>isOverdue,
    "isUpcoming",
    ()=>isUpcoming,
    "isWithin7Days",
    ()=>isWithin7Days
]);
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
function formatDateTime(date) {
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
function getDaysUntil(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
function getHoursUntil(date) {
    const now = new Date();
    const target = new Date(date);
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60));
}
function getTimeUntilFormatted(date) {
    const hoursUntil = getHoursUntil(date);
    const daysUntil = getDaysUntil(date);
    if (hoursUntil < 0) {
        const absHours = Math.abs(hoursUntil);
        const absDays = Math.floor(absHours / 24);
        return `${absDays} día${absDays !== 1 ? "s" : ""} y ${absHours % 24} hora${absHours % 24 !== 1 ? "s" : ""} atrasado`;
    }
    if (hoursUntil < 24) {
        return `${hoursUntil} hora${hoursUntil !== 1 ? "s" : ""}`;
    }
    const days = Math.floor(hoursUntil / 24);
    const hours = hoursUntil % 24;
    if (hours === 0) {
        return `${days} día${days !== 1 ? "s" : ""}`;
    }
    return `${days} día${days !== 1 ? "s" : ""} y ${hours} hora${hours !== 1 ? "s" : ""}`;
}
function isWithin7Days(date) {
    const hoursUntil = getHoursUntil(date);
    return hoursUntil >= 0 && hoursUntil <= 7 * 24;
}
function isOverdue(date) {
    return getDaysUntil(date) < 0;
}
function isUpcoming(date, days = 7) {
    const daysUntil = getDaysUntil(date);
    return daysUntil >= 0 && daysUntil <= days;
}
function getDateStatus(date) {
    const daysUntil = getDaysUntil(date);
    if (daysUntil < 0) return "overdue";
    if (daysUntil <= 3) return "urgent";
    if (daysUntil <= 7) return "upcoming";
    return "normal";
}
}),
"[project]/lib/services/alert-service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkUpcomingDeadlines",
    ()=>checkUpcomingDeadlines,
    "processAlerts",
    ()=>processAlerts,
    "sendConsoleAlert",
    ()=>sendConsoleAlert,
    "sendEmailAlert",
    ()=>sendEmailAlert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$date$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/date-helpers.ts [app-rsc] (ecmascript)");
;
;
async function checkUpcomingDeadlines() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: projects } = await supabase.from("projects").select("*, clients(name, email)").in("status", [
        "pending",
        "in_progress",
        "delayed"
    ]).order("due_date", {
        ascending: true
    });
    if (!projects || projects.length === 0) {
        return [];
    }
    const urgentProjects = [];
    projects.forEach((project)=>{
        const hoursUntil = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$date$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getHoursUntil"])(project.due_date);
        // Proyectos que vencen en 3 días (72 horas) o menos
        if (hoursUntil >= 0 && hoursUntil <= 72) {
            urgentProjects.push(project);
        }
    });
    return urgentProjects;
}
function sendConsoleAlert(project) {
    const hoursUntil = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$date$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getHoursUntil"])(project.due_date);
    const timeUntil = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$date$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTimeUntilFormatted"])(project.due_date);
    console.log("=".repeat(80));
    console.log("🚨 ALERTA: Proyecto próximo a vencer");
    console.log("=".repeat(80));
    console.log(`Proyecto: ${project.name}`);
    console.log(`Cliente: ${project.clients.name}`);
    console.log(`Fecha de vencimiento: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$date$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(project.due_date)}`);
    console.log(`Tiempo restante: ${timeUntil}`);
    console.log(`Horas restantes: ${hoursUntil} horas`);
    console.log(`Estado: ${project.status}`);
    console.log(`Progreso: ${project.completion_percentage}%`);
    console.log("=".repeat(80));
}
async function sendEmailAlert(project) {
    const hoursUntil = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$date$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getHoursUntil"])(project.due_date);
    const timeUntil = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$date$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTimeUntilFormatted"])(project.due_date);
    // Verificar que Resend esté configurado
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@example.com";
    if (!resendApiKey) {
        console.warn("⚠️ RESEND_API_KEY no configurada. Saltando envío de email real.");
        return {
            success: false,
            error: "RESEND_API_KEY no configurada"
        };
    }
    try {
        // Importar Resend dinámicamente
        const { Resend } = await __turbopack_context__.A("[project]/node_modules/resend/dist/index.mjs [app-rsc] (ecmascript, async loader)");
        const resend = new Resend(resendApiKey);
        const emailContent = `
			<h2>🚨 Alerta: Proyecto próximo a vencer</h2>
			<p>El siguiente proyecto está próximo a vencer:</p>
			<ul>
				<li><strong>Proyecto:</strong> ${project.name}</li>
				<li><strong>Cliente:</strong> ${project.clients.name}</li>
				<li><strong>Fecha de vencimiento:</strong> ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$date$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDate"])(project.due_date)}</li>
				<li><strong>Tiempo restante:</strong> ${timeUntil}</li>
				<li><strong>Horas restantes:</strong> ${hoursUntil} horas</li>
				<li><strong>Estado:</strong> ${project.status}</li>
				<li><strong>Progreso:</strong> ${project.completion_percentage}%</li>
			</ul>
			<p>Por favor, revisa el proyecto y toma las acciones necesarias.</p>
		`;
        // Obtener email del cliente o usar email por defecto
        const toEmail = project.clients.email || process.env.ALERT_DEFAULT_EMAIL || "admin@example.com";
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [
                toEmail
            ],
            subject: `🚨 Alerta: ${project.name} vence en ${timeUntil}`,
            html: emailContent
        });
        if (error) {
            console.error("❌ Error al enviar email:", error);
            return {
                success: false,
                error
            };
        }
        console.log("✅ Email enviado exitosamente:", data);
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error("❌ Error al inicializar Resend:", error);
        return {
            success: false,
            error
        };
    }
}
async function processAlerts() {
    console.log("\n🔍 Verificando proyectos próximos a vencer...");
    const urgentProjects = await checkUpcomingDeadlines();
    if (urgentProjects.length === 0) {
        console.log("✅ No hay proyectos próximos a vencer (3 días o menos)");
        return {
            count: 0,
            alerts: []
        };
    }
    console.log(`⚠️ Se encontraron ${urgentProjects.length} proyecto(s) próximo(s) a vencer\n`);
    const alerts = [];
    for (const project of urgentProjects){
        // Enviar alerta por consola (simulado) - SIEMPRE se ejecuta
        sendConsoleAlert(project);
        // Enviar alerta por email (real) - SIEMPRE se ejecuta si está configurado
        const emailResult = await sendEmailAlert(project);
        alerts.push({
            project: project.name,
            console: true,
            email: emailResult.success,
            emailError: emailResult.error
        });
    }
    return {
        count: urgentProjects.length,
        alerts
    };
}
}),
"[project]/lib/cron/deadline-checker.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runDeadlineChecker",
    ()=>runDeadlineChecker,
    "startDeadlineChecker",
    ()=>startDeadlineChecker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$alert$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/alert-service.ts [app-rsc] (ecmascript)");
;
async function runDeadlineChecker() {
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$alert$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processAlerts"])();
        return result;
    } catch (error) {
        console.error("❌ Error en deadline checker:", error);
        return {
            count: 0,
            alerts: [],
            error
        };
    }
}
function startDeadlineChecker(intervalMinutes = 60) {
    console.log(`⏰ Iniciando verificador de deadlines cada ${intervalMinutes} minutos`);
    // Ejecutar inmediatamente al iniciar
    runDeadlineChecker();
    // Ejecutar periódicamente
    const intervalMs = intervalMinutes * 60 * 1000;
    setInterval(()=>{
        runDeadlineChecker();
    }, intervalMs);
}
}),
"[project]/lib/server-init.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Este archivo se ejecuta al iniciar el servidor
 * Inicializa el verificador de deadlines
 */ __turbopack_context__.s([
    "initializeServer",
    ()=>initializeServer
]);
let deadlineCheckerStarted = false;
function initializeServer() {
    if (deadlineCheckerStarted) {
        return;
    }
    // Solo ejecutar en el servidor, no en el cliente
    if ("TURBOPACK compile-time truthy", 1) {
        const { startDeadlineChecker } = __turbopack_context__.r("[project]/lib/cron/deadline-checker.ts [app-rsc] (ecmascript)");
        // Ejecutar verificaciones cada hora (60 minutos)
        // En desarrollo, puedes cambiar esto a un intervalo más corto para pruebas
        const intervalMinutes = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 30;
        startDeadlineChecker(intervalMinutes);
        deadlineCheckerStarted = true;
        console.log("✅ Servidor inicializado - Verificador de deadlines activo");
    }
}
// Ejecutar al cargar el módulo (solo en servidor)
if ("TURBOPACK compile-time truthy", 1) {
    initializeServer();
}
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a7695b8e$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_a7695b8e.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_354fc78$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_mono_354fc78.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vercel$2f$analytics$2f$dist$2f$next$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@vercel/analytics/dist/next/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2d$init$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server-init.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const metadata = {
    title: 'v0 App',
    description: 'Created with v0',
    generator: 'v0.app',
    icons: {
        icon: [
            {
                url: '/icon-light-32x32.png',
                media: '(prefers-color-scheme: light)'
            },
            {
                url: '/icon-dark-32x32.png',
                media: '(prefers-color-scheme: dark)'
            },
            {
                url: '/icon.svg',
                type: 'image/svg+xml'
            }
        ],
        apple: '/apple-icon.png'
    }
};
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            className: `font-sans antialiased`,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Toaster"], {
                    position: "top-right"
                }, void 0, false, {
                    fileName: "[project]/app/layout.tsx",
                    lineNumber: 43,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vercel$2f$analytics$2f$dist$2f$next$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Analytics"], {}, void 0, false, {
                    fileName: "[project]/app/layout.tsx",
                    lineNumber: 44,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/layout.tsx",
            lineNumber: 41,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/layout.tsx",
        lineNumber: 40,
        columnNumber: 3
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3d9a3890._.js.map