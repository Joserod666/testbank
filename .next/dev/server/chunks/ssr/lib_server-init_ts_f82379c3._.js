module.exports = [
"[project]/lib/server-init.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Este archivo se ejecuta al iniciar el servidor
 * Inicializa el verificador de deadlines
 * 
 * IMPORTANTE: Solo se ejecuta en runtime del servidor, no durante el build
 */ __turbopack_context__.s([
    "initializeServer",
    ()=>initializeServer
]);
let deadlineCheckerStarted = false;
async function initializeServer() {
    // Evitar ejecución durante el build
    if (process.env.NEXT_PHASE === "phase-production-build") {
        return;
    }
    if (deadlineCheckerStarted) {
        return;
    }
    // Solo ejecutar en el servidor, no en el cliente
    if ("TURBOPACK compile-time truthy", 1) {
        try {
            // Usar setTimeout para asegurar que se ejecute después del build
            setTimeout(async ()=>{
                const { startDeadlineChecker } = await __turbopack_context__.A("[project]/lib/cron/deadline-checker.ts [app-rsc] (ecmascript, async loader)");
                // Ejecutar verificaciones cada hora (60 minutos)
                // En desarrollo, puedes cambiar esto a un intervalo más corto para pruebas
                const intervalMinutes = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 30;
                startDeadlineChecker(intervalMinutes);
                deadlineCheckerStarted = true;
                console.log("✅ Servidor inicializado - Verificador de deadlines activo");
            }, 1000);
        } catch (error) {
            console.error("❌ Error al inicializar verificador de deadlines:", error);
        }
    }
}
// Ejecutar al cargar el módulo (solo en servidor, después del build)
if (("TURBOPACK compile-time value", "undefined") === "undefined" && process.env.NEXT_PHASE !== "phase-production-build") {
    // Usar process.nextTick para ejecutar después de que el módulo se haya cargado completamente
    process.nextTick(()=>{
        initializeServer().catch(console.error);
    });
}
}),
];

//# sourceMappingURL=lib_server-init_ts_f82379c3._.js.map