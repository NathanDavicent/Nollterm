// Exposes a minimal, safe bridge to the page: window.nollterm.run / info
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("nollterm", {
  run: opts => ipcRenderer.invoke("nollterm:run", opts),
  info: () => ipcRenderer.invoke("nollterm:info"),
  desktop: true,
});
