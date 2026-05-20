const { app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')
const Store = require('electron-store')
const { syncFromNotion, updateTaskDone, updatePlanningDone, fetchTasksForOT } = require('./src/notion-sync')

const store = new Store()

let win

function createWindow() {
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize

  const savedBounds = store.get('windowBounds', {
    width: 720,
    height: 760,
    x: sw - 740,
    y: Math.floor((sh - 760) / 2)
  })

  win = new BrowserWindow({
    ...savedBounds,
    minWidth: 600,
    minHeight: 500,
    maxWidth: 960,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    alwaysOnTopLevel: 'screen-saver',
    resizable: true,
    hasShadow: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    skipTaskbar: false,
    titleBarStyle: 'hidden',
  })

  win.loadFile('src/index.html')

  win.on('close', () => {
    store.set('windowBounds', win.getBounds())
  })

  // Keep on top when focus changes
  win.setAlwaysOnTop(true, 'screen-saver')
  win.on('blur', () => {
    win.setAlwaysOnTop(true, 'screen-saver')
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('close-app', () => app.quit())
ipcMain.on('minimize-app', () => win.minimize())
ipcMain.on('toggle-opacity', (e, val) => win.setOpacity(val))

ipcMain.on('save-data', (e, data) => {
  store.set('appData', data)
})

ipcMain.on('load-data', (e) => {
  e.returnValue = store.get('appData', null)
})

// ── Notion 연동 ──────────────────────────────────────────
ipcMain.on('notion-set-token', (e, token) => {
  store.set('notionToken', token)
})

ipcMain.on('notion-get-token', (e) => {
  e.returnValue = store.get('notionToken', '')
})

ipcMain.handle('notion-sync', async () => {
  const token = store.get('notionToken', '')
  if (!token) return { error: 'NO_TOKEN' }
  try {
    return await syncFromNotion(token)
  } catch (err) {
    return { error: err.message || 'SYNC_FAILED' }
  }
})

ipcMain.handle('notion-check-task', async (e, pageId, done) => {
  const token = store.get('notionToken', '')
  if (!token) return
  try { await updateTaskDone(token, pageId, done) } catch (err) {}
})

ipcMain.handle('notion-fetch-ot-tasks', async (e, otId) => {
  const token = store.get('notionToken', '')
  if (!token) return { error: 'NO_TOKEN' }
  try {
    return await fetchTasksForOT(token, otId)
  } catch (err) {
    return { error: err.message || 'FETCH_FAILED' }
  }
})

ipcMain.handle('notion-check-planning', async (e, pageId, done) => {
  const token = store.get('notionToken', '')
  if (!token) return
  try { await updatePlanningDone(token, pageId, done) } catch (err) {}
})
