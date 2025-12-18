module.exports = [
"[project]/lib/server-init.ts [app-rsc] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/lib_cron_deadline-checker_ts_c52c4ed1._.js",
  "server/chunks/ssr/lib_server-init_ts_f82379c3._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/server-init.ts [app-rsc] (ecmascript)");
    });
});
}),
];