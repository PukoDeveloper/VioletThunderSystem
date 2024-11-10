declare const PATH_ExtensionPack: string;
declare const PATH_Language: string;
declare const PATH_Image: string;
declare const PATH_Sound: string;

declare const LAYER_System: number;
declare const LAYER_Desktop: number;
declare const LAYER_Window: number;
declare const LAYER_Taskbar: number;

declare const VTS_Version: string;
declare const VTS_PackageName: string;

type BootOptions_Loading = {
    progress: number;
    text: string;
};
type BootOptions_Error = {
    text: string;
    title: string;
    btn: string;
    callback?: () => void;
};
type BootOptions_Spinner = {
    text: string;
};
declare interface BootOptionMap {
    loading: BootOptions_Loading;
    error: BootOptions_Error;
    spinner: BootOptions_Spinner;
}

declare class Utils {
    constructor();

    static getPlatform(): "Ios" | "Android" | "WindowsPhone" | "Windows" | "Unknown";

    static getEnvironment(): "NWjs" | "WebServer" | "WebFile" | "Unknown";

    static get dirname(): string;

    static getParentDirectory(inputPath: string): string;

    static pathJoin(...args: string[]): string;

    static openBoot(): void;

    static closeBoot(): void;

    static setBoot<key extends keyof BootOptionMap>(mode: key, options: BootOptionMap[key]): void;
}

declare class SystemEventManager {

    constructor();

    static on(eventType: string, callback: Function, key?: string): void;

    static once(eventType: string, callback: Function, key?: string): void;

    static off(eventType: string, callback: Function, key?: string): void;

    static emit(eventType: string, args?: object): { event: string; break: boolean; args: object };

    static clear_all(): void;

    static clear_event(eventType: string): void;

    static clear_key(key: string): void;

    static clear_eventKey(eventType: string, key: string): void;
}

declare class SystemOptions {
    constructor();

    static init(): void;
    static set(key: string, value: any): void;
    static get(key: string): any;
    static copy(): { [key: string]: any }
    static save(): void;
}
                //初始化 讀取資源    就緒     活動中   閒置   錯誤     更新       關閉中
type StateType = 'init'|'loading'|'ready'|'active'|'idle'|'error'|'updating'|'closing';

declare class SystemState {
    static #state: StateType;
    constructor();
    static get(): StateType
    static set(state: StateType): void;
    static wait(state: StateType): Promise<void>;

}

declare class WindowManager {
    private static windows: VT_Frame[];

    constructor();

    static add(window: VT_Frame): number;

    static get(id: string): VT_Frame | null;

    static getIndex(id: string): number;

    static focus(id: string): void;

    static remove(id: string): void;

    static sort(): void;
}

declare class VT_WindowOption {
    width: number;
    height: number;
    x: number;
    y: number;
    title: string;
    icon: string | null;
    min_btn: boolean;
    max_btn: boolean;
    close_btn: boolean;
    show: boolean;
    frame: boolean;
    resizable: boolean;
    draggable: boolean;
    screen_type: string;
    alwaysOnTop: boolean;
    layer: number;
    style: {
        background_color: string;
        border_color: string;
        title_bar_color: string;
        close_btn_img: string;
        min_btn_img: string;
        max_btn_img: string;
    };

    constructor(obj?: Partial<VT_WindowOption>);
}

declare class VT_Frame {
    options: VT_WindowOption;
    id: string;
    class: string;
    index: number;

    constructor(id: string, options?: Partial<VT_WindowOption>);

    show(): void;

    hide(): void;

    toggle(): void;

    close(): void;

    fullScreen(): void;

    unfullscreen(): void;

    toggleFullScreen(): void;

    focus(): void;

    setZIndex(zindex: number): void;

    setSize(width: number, height: number): void;

    setPosition(x: number, y: number): void;

    setContent(dom: HTMLElement): void;

    setTitle(title: string): void;

    setIcon(icon: string): void;

    setColor(color: string): void;

    setDraggable(draggable: boolean): void;

    setResizable(resizable: boolean): void;

    setAlwaysOnTop(alwaysOnTop: boolean): void;

    setLayer(layer: number): void;
}

declare class VT_Window extends VT_Frame {
    // Constructor
    constructor(id: string, options?: VT_WindowOption);

    // DOM Elements
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

    // Options
    options: VT_WindowOption;

    // Methods
    on(eventType: string, callback: (e: any) => void): void;
    show(): void;
    hide(): void;
    toggle(): void;
    close(): void;
    fullScreen(): void;
    unfullscreen(): void;
    toggleFullScreen(): void;
    focus(): void;
    setZIndex(zindex: number): void;
    setSize(width: number, height: number): void;
    setPosition(x: number, y: number): void;
    setContent(dom: HTMLElement): void;
    setTitle(title: string): void;
    setIcon(icon: string): void;
    setDraggable(draggable: boolean): void;
    setResizable(resizable: boolean): void;
    setAlwaysOnTop(alwaysOnTop: boolean): void;
    setLayer(layer: number): void;
}

declare class ContentManager {
    constructor();
    static loadScript(url: URL | string): Promise<void>;
    static loadStyle(url: URL | string): Promise<void>;
}

declare interface ExtensionPack {
    package: string,
    displayName: string,
    main: URL,
    icon: URL,
    dependence: {
        [key: string]: string
    },
    files: []
}

type ExtensionPackType = 'init'|'loading'|'loaded'|'unloading'|'unloaded';

declare class ExtensionPackManager {
    static #extensions: Array<ExtensionPack>;
    static #extension_state: { [key: string]: ExtensionPackType };
    constructor();
    static init(): void;

    static find_pkg(package_name: string): ExtensionPack;

    static set_state(package_name: string, state: ExtensionPackType): void;

    static get_state(package_name: string): ExtensionPackType | undefined;

    static foreach(callback: (extension: ExtensionPack) => void): void;
}