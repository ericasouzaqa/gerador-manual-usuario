/*
 * Intentionally empty bridge for the first desktop version.
 * Future native capabilities must be exposed as a narrow, reviewed API.
 */
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("arquivoCampo", {
  runtime: "desktop",
  localOnly: true,
});
