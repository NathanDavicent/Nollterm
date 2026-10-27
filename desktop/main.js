const { app, BrowserWindow, ipcMain, shell, Menu } = require("electron");
const path = require("node:path");
const compiler = require("./compiler");

function createWindow() {
  const win = new BrowserWindow({
    width: 1320, height: 880, minWidth: 420, minHeight: 500,
    title: "Nollterm",
    backgroundColor: "#f3f5f1",
    icon: path.join(__dirname, "build", "icon.png"),
    autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.loadFile(path.join(__dirname, "web", "index.html"));
  // open external links (GitHub, Compiler Explorer, cppreference) in the normal browser
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (e, url) => { if (/^https?:/.test(url)) { e.preventDefault(); shell.openExternal(url); } });
}

ipcMain.handle("nollterm:run", (_e, opts) => compiler.run(opts || {}));
ipcMain.handle("nollterm:info", () => compiler.info());

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: "Arkiv", submenu: [{ role: "reload", label: "Ladda om" }, { role: "toggleDevTools", label: "Utvecklarverktyg" }, { type: "separator" }, { role: "quit", label: "Avsluta" }] },
    { label: "Visa", submenu: [{ role: "zoomIn", label: "Zooma in" }, { role: "zoomOut", label: "Zooma ut" }, { role: "resetZoom", label: "Återställ zoom" }, { role: "togglefullscreen", label: "Helskärm" }] },
  ]));
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
