declare module 'fs' {
    export function existsSync(path: string): boolean;
    export function writeFileSync(path: string, data: string): void;
}

declare class JsonFile {
    data: { [key: string]: any };
    path: string;
    saveChange: boolean;
    addUnknown: boolean;

    constructor(path: string);
    get(key: string, def?: any): any;
    set(key: string, value: any): void;
    save(): void;
}

declare class TextManager {
    texts: { [key: string]: string };

    constructor();
    load(lang: string): void;
    get(key: string): string;
}

declare class _WindowManager {
    windows: VT_Window[];

    constructor();
    add(window: VT_Window): number;
    get(id: string): VT_Window | null;
    getIndex(id: string): number;
    focus(id: string): void;
    remove(id: string): void;
    sort(): void;
}
declare const WindowManager: _WindowManager;

declare class VT_Window {
    options: {
        width: number;
        height: number;
        x: number;
        y: number;
        title: string;
        icon: string | null;
        min_btn: boolean;
        max_btn: boolean;
        close_btn: boolean;
        frame: boolean;
        resizable: boolean;
        draggable: boolean;
        screen_type: string;
        alwaysOnTop: boolean;
        layer: number;
        color: {
            app_background: string;
            app_border: string;
            title_bar: string;
        };
        show: boolean;
    };
    events: { [event: string]: Function[] };
    id: string;
    index: number;
    dom: HTMLElement;
    titleBar: HTMLElement | null;
    titleBarApp: HTMLElement | null;
    titleIcon: HTMLImageElement | null;
    titleText: HTMLElement | null;
    titleBarBtns: HTMLElement | null;
    titleBarMinBtn: HTMLImageElement | null;
    titleBarMaxBtn: HTMLImageElement | null;
    titleBarCloseBtn: HTMLImageElement | null;
    content: HTMLElement;

    constructor(id: string, options: {
        width?: number;
        height?: number;
        x?: number;
        y?: number;
        title?: string;
        icon?: string | null;
        min_btn?: boolean;
        max_btn?: boolean;
        close_btn?: boolean;
        show?: boolean;
        frame?: boolean;
        resizable?: boolean;
        draggable?: boolean;
        screen_type?: string;
        alwaysOnTop?: boolean;
        layer?: number;
        color?: {
            app_background?: string;
            app_border?: string;
            title_bar?: string;
        };
    });

    show(): void;
    hide(): void;
    toggle(): void;
    close(): void;
    fullScreen(): void;
    unfullscreen(): void;
    toggleFullScreen(): void;
    focus(): void;
    on(event: string, callback: Function): void;
    emit(event: string, ...args: any[]): void;
    setZIndex(zindex: number): void;
    setSize(width: number, height: number): void;
    setPosition(x: number, y: number): void;
    setContent(dom: HTMLElement): void;
    setTitle(title: string): void;
    setIcon(icon: string): void;
    setColor(color: { app_background: string; title_bar: string }): void;
    setLayer(layer: number): void;
}

declare const Setting: JsonFile;