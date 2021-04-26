declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'


interface Services {
    window: {
        createWin: (windowId: string, options?: Electron.BrowserWindowConstructorOptions) => BrowserWindow
    },
    pdf: {
        htmlToPdf: (htmlPath: string) => string
    }
    update
}