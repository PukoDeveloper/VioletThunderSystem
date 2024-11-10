

const PATH_ExtensionPack = "extensions";
const PATH_Language = "lang";
const PATH_Image = "img";
const PATH_Sound = "sound";

const LAYER_System = 0;
const LAYER_Desktop = 10;
const LAYER_Window = 50;
const LAYER_Taskbar = 100;

const VTS_Version = "1.0.0";
const VTS_PackageName = "com.pukodev.violet_thunder";

class ExtensionPackError extends Error {
    constructor(message) {
        super(message);
        this.name = "ExtensionPackError";
    }
}

class StateError extends Error {
    constructor(message) {
        super(message);
        this.name = "StateError";
    }
}

class Utils {
    constructor() {
        if (new.target === Utils) {
            throw new SyntaxError("This class cannot be instantiated");
        }
    }
    static getPlatform() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/iPad|iPhone|iPod/i.test(userAgent) && !window.MSStream) {
            return "Ios";
        }
        // 檢查是否為 Android 裝置
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        // 檢查是否為 Windows 裝置
        if (/windows phone/i.test(userAgent)) {
            return "WindowsPhone";
        }
        if (/windows nt/i.test(userAgent)) {
            return "Windows";
        }
        console.log(userAgent); //TODO: 排除其他可能的環境
        return "Unknown";
    }
    static getEnvironment() {
        if (typeof nw === 'object') {
            return "NWjs";
        }
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            return "WebServer";
        }
        else if (window.location.protocol === 'file:') {
            return "WebFile";
        }
        else {
            return "Unknown";
        }
    }
    static get dirname() {
        if (this.getEnvironment() === "NWjs") {
            return Utils.getParentDirectory(process.mainModule.filename);
        }
        else if (this.getEnvironment() === "WebServer") {
            const currentPath = window.location.href;
            const directoryPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            return directoryPath;
        }
        else if (this.getEnvironment() === "WebFile") {
            const currentPath = window.location.href;
            const directoryPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            return directoryPath;
        }
        else {
            return "";
        }
    }
    static getParentDirectory(inputPath) {
        // 把所有的 `\` 替換成 `/`，確保統一處理
        const normalizedPath = inputPath.replace(/\\/g, "/");

        // 拆分路徑並移除最後一部分
        const pathParts = normalizedPath.split("/");
        pathParts.pop();

        // 重組為上一層的路徑
        return pathParts.join("/");
    }
    static pathJoin(...args) {
        let path = '';
        for (let i = 0; i < args.length; i++) {
            if (i === 0) path = args[i];
            else path = path + '/' + args[i];
        }
        return path;
    }

    static openBoot() {
        document.getElementById('desktop').style.display = 'none';
        document.getElementById('taskbar').style.display = 'none';
        document.getElementById('boot-screen').classList.remove('close');
    }
    static closeBoot() {
        document.getElementById('desktop').style.display = 'flex';
        document.getElementById('taskbar').style.display = 'flex';
        document.getElementById('boot-screen').classList.add('close');
    }
    static setBoot(key, options) {
        if (!options) return;
        if (key === 'loading') {
            if (options.progress) document.getElementById('boot-loading-fill').style.width = `${options.progress}%`;
            if (options.text) document.getElementById('boot-loading-text').textContent = options.text;

            document.getElementById('boot-error').style.display = 'none';
            document.getElementById('boot-spinner').style.display = 'none';
            document.getElementById('boot-loading').style.display = 'block';
        }
        else if (key === 'error') {
            if (options.title) document.getElementById('boot-error-title').textContent = options.title;
            if (options.text) document.getElementById('boot-error-text').innerHTML = options.text;
            if (options.callback) {
                document.getElementById('boot-error-button').style.display = 'block';
                document.getElementById('boot-error-button').textContent = options.btn;
                document.getElementById('boot-error-button').onclick = options.callback;
            }
            else {
                document.getElementById('boot-error-button').style.display = 'none';
                document.getElementById('boot-error-button').onclick = null;
            }

            document.getElementById('boot-spinner').style.display = 'none';
            document.getElementById('boot-loading').style.display = 'none';
            document.getElementById('boot-error').style.display = 'block';
        }
        else if (key === 'spinner') {
            if (options.text) document.getElementById('boot-spinner-text').textContent = options.text;

            document.getElementById('boot-loading').style.display = 'none';
            document.getElementById('boot-error').style.display = 'none';
            document.getElementById('boot-spinner').style.display = 'flex';
        }
    }
}

class SystemEventManager {
    static #events = new Map();
    constructor() {
        if (new.target === SystemEventManager) {
            throw new SyntaxError("This class cannot be instantiated");
        }
    }
    static on(eventType, callback, key = 'global') {
        if (!this.#events.has(eventType)) {
            this.#events.set(eventType, new Map());
        }
        if (!this.#events.get(eventType).has(key)) {
            this.#events.get(eventType).set(key, []);
        }
        this.#events.get(eventType).get(key).push(callback);
    }
    static once(eventType, callback, key = 'global') {
        const onceCallback = (...args) => {
            callback(...args);
            this._off(eventType, onceCallback, key);
        };
        this._on(eventType, onceCallback, key);
    }
    static off(eventType, callback, key = 'global') {
        if (this.#events.has(eventType)) {
            if (this.#events.get(eventType).has(key)) {
                this.#events.get(eventType).set(key, this.#events.get(eventType).get(key).filter(cb => cb !== callback));
            }
        }
    }
    static emit(eventType, args = {}) {
        const result = {
            event: eventType,
            break: false,
            args
        };
        if (this.#events.has(eventType)) {
            for (let key of this.#events.get(eventType).keys()) {
                for (let callback of this.#events.get(eventType).get(key)) {
                    callback(result);
                    if (result.break) break;
                }
                if (result.break) break;
            }
        }
        return result;
    }
    static clear_all() {
        this.#events.clear();
    }
    static clear_event(eventType) {
        if (this.#events.has(eventType)) {
            this.#events.delete(eventType);
        }
    }
    static clear_key(key) {
        for (let [eventType, event] of this.#events) {
            if (event.has(key)) {
                event.delete(key);
            }
        }
    }
    static clear_eventKey(eventType, key) {
        if (this.#events.has(eventType) && this.#events.get(eventType).has(key)) {
            this.#events.get(eventType).delete(key);
        }
    }
}

class SystemOptions {
    static #options = {
        language: 'zh_tw',
    };
    constructor() {
        if (new.target === SystemOptions) {
            throw new SyntaxError("This class cannot be instantiated");
        }
    }
    static init() {
        const ev = SystemEventManager.emit('options.init', {
            options: this.#options,
            continue: true,
        });
        if (!ev.args.continue) return;


        if (Utils.getEnvironment() === "NWjs") {
            const fs = require('fs');
            if (fs.existsSync(Utils.dirname + '/options.json')) {
                let options = JSON.parse(fs.readFileSync(Utils.dirname + '/options.json'));
                for (let key in options) {
                    this.#options[key] = options[key];
                }
            }
            else {
                const ws = fs.createWriteStream(Utils.dirname + '/options.json');
                ws.write(JSON.stringify(this.#options));
                ws.close();
            }
        }
        else if (Utils.getEnvironment() === "WebServer") {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', Utils.dirname + '/options.json', false);
            xhr.send();
            if (xhr.status === 200) {
                let options = JSON.parse(xhr.responseText);
                for (let key in options) {
                    this.#options[key] = options[key];
                }
            }
            else {
                console.warn(`options.json not found.`);
            }

        }
        else { }

        let options = window.localStorage.getItem('options');
        if (options) {
            for (let key in JSON.parse(options)) {
                this.#options[key] = JSON.parse(options)[key];
            }
        }

        SystemEventManager.emit('options.init_end', {
            options: this.#options,
        });
    }
    static set(key, value) {
        const ev = SystemEventManager.emit('options.set', {
            key: key,
            value: value,
            continue: true,
        });
        if (!ev.args.continue) return;

        this.#options[ev.args.key] = ev.args.value;
        this.save();

        SystemEventManager.emit('options.set_end', {
            key: ev.args.key,
            value: ev.args.value,
        });
    }
    static get(key) {
        return this.#options[key];
    }
    static copy() {
        return JSON.parse(JSON.stringify(this.#options));
    }
    static save() {
        if (Utils.getEnvironment() === "NWjs") {
            const fs = require('fs');
            fs.writeFileSync(Utils.dirname + '/options.json', JSON.stringify(this.#options));
        }
        else {
            window.localStorage.setItem('options', JSON.stringify(this.#options));
        }
    }
}

class SystemState {
    static #state = 'init';
    constructor() {
        if (new.target === SystemState) {
            throw new SyntaxError("This class cannot be instantiated");
        }
    }
    static get() {
        return this.#state;
    }
    static set(state) {
        var ev = SystemEventManager.emit('state.set', {
            state: state,
            continue: true,
        });
        if (!ev.args.continue) return;

        this.#state = state;

        SystemEventManager.emit('state.set_end', {
            state: state,
        });
    }
    static wait(state) {
        return new Promise(resolve => {
            const intervalId = setInterval(() => {
                if (SystemState.get() === state) {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 100);
        });
    }
}

class WindowManager {
    static windows = [];
    constructor() {
        if (new.target === WindowManager) {
            throw new SyntaxError("This class cannot be instantiated");
        }
    }
    static add(window) {
        this.windows.push(window);
        return this.windows.length - 1;
    }
    static get(id) {
        for (let i = 0; i < this.windows.length; i++) {
            if (this.windows[i].id === id) {
                return this.windows[i];
            }
        }
        return null;
    }
    static getIndex(id) {
        for (let i = 0; i < this.windows.length; i++) {
            if (this.windows[i].id === id) {
                return i;
            }
        }
        return -1;
    }
    static focus(id) {
        let win = this.get(id);
        if (win) {
            win.index = this.windows.length;
            this.sort();
        }
    }
    static remove(id) {
        const index = this.getIndex(id);
        if (index !== -1) {
            this.windows.splice(index, 1);
        }
    }
    static sort() {
        this.windows.sort((a, b) => {
            if (a.options.alwaysOnTop) return 1;
            if (b.options.alwaysOnTop) return -1;
            if (a.options.layer > b.options.layer) return 1;
            if (a.options.layer < b.options.layer) return -1;
            return b.index - a.index;
        });
        for (let i = 0; i < this.windows.length; i++) {
            this.windows[i].index = i;
            this.windows[i].setZIndex(i);
        }
    }
}

class VT_WindowOption {
    constructor(obj = {}) {
        this.width = obj.width || 400;
        this.height = obj.height || 300;
        this.x = obj.x || 0;
        this.y = obj.y || 0;
        this.title = obj.title || 'Untitled';
        this.icon = obj.icon || null;
        this.min_btn = obj.min_btn || true;
        this.max_btn = obj.max_btn || true;
        this.close_btn = obj.close_btn || true;
        this.show = obj.show || true;
        this.frame = obj.frame || true;
        this.resizable = obj.resizable || true;
        this.draggable = obj.draggable || true;
        this.screen_type = obj.screen_type || 'normal';
        this.alwaysOnTop = obj.alwaysOnTop || false;
        this.layer = obj.layer || 0;
        this.style = {
            background_color: obj.style?.background_color || '#fff',
            border_color: obj.style?.border_color || '#3a4b58',
            title_bar_color: obj.style?.title_bar_color || '#2e2e2e',
            close_btn_img: obj.style?.close_btn_img || 'img/close.svg',
            min_btn_img: obj.style?.min_btn_img || 'img/min.svg',
            max_btn_img: obj.style?.max_btn_img || 'img/max.svg',
        };
    }
}

class VT_Frame {
    constructor(id, options = {}) {
        this.options = new VT_WindowOption(options);
        this.id = id;
        this.class = new.target.name;
        this.index = WindowManager.add(this);
    }
    show() { }
    hide() { }
    toggle() { }
    close() { }
    fullScreen() { }
    unfullscreen() { }
    toggleFullScreen() { }
    focus() { }
    setZIndex(zindex) { }
    setSize(width, height) { }
    setPosition(x, y) { }
    setContent(dom) { }
    setTitle(title) { }
    setIcon(icon) { }
    setColor(color) { }
    setDraggable(draggable) { }
    setResizable(resizable) { }
    setAlwaysOnTop(alwaysOnTop) { }
    setLayer(layer) { }
}

class VT_Window extends VT_Frame {
    constructor(id, options = {}) {
        super(id, options);

        /* Window Dom */
        this.dom = document.createElement('div');
        this.dom.classList.add('window');
        this.dom.window = this;
        this.dom.id = id;
        this.dom.style.zindex = this.index;
        this.dom.style.width = `${this.options.width}px`;
        this.dom.style.height = `${this.options.height}px`;
        this.dom.style.left = `${this.options.x}px`;
        this.dom.style.top = `${this.options.y}px`;
        this.dom.style.backgroundColor = this.options.style.background_color;

        if (this.options.resizable) this.dom.style.resize = 'both';
        if (this.options.frame) this.dom.style.border = `${this.options.style.border_color} 1px solid`;

        /* TitleBar Dom */
        this.titleBar = null;
        this.titleBarApp = null;
        this.titleIcon = null;
        this.titleText = null;
        this.titleBarBtns = null;
        this.titleBarMinBtn = null;
        this.titleBarMaxBtn = null;
        this.titleBarCloseBtn = null;

        if (this.options.frame) {
            this.titleBar = document.createElement('div');
            this.titleBar.classList.add('title-bar');
            this.titleBar.style.backgroundColor = this.options.style.title_bar_color;
            this.titleBar.window = this;
            this.dom.appendChild(this.titleBar);

            this.titleBarApp = document.createElement('div');
            this.titleBarApp.classList.add('title-bar-app');
            this.titleBarApp.window = this;
            this.titleBar.appendChild(this.titleBarApp);

            if (this.options.icon != null) {
                this.titleIcon = document.createElement('img');
                this.titleIcon.classList.add('title-bar-icon');
                this.titleIcon.window = this;
                this.titleBarApp.appendChild(this.titleIcon);
                this.titleIcon.src = this.options.icon;

            }

            this.titleText = document.createElement('div');
            this.titleText.classList.add('title-bar-title');
            this.titleText.textContent = this.options.title;
            this.titleText.window = this;
            this.titleBarApp.appendChild(this.titleText);

            this.titleBarBtns = document.createElement('div');
            this.titleBarBtns.classList.add('title-bar-btns');
            this.titleBarBtns.window = this;
            this.titleBar.appendChild(this.titleBarBtns);

            if (this.options.min_btn) {
                this.titleBarMinBtn = document.createElement('img');
                this.titleBarMinBtn.classList.add('tilebar-btn');
                this.titleBarMinBtn.src = this.options.style.min_btn_img;
                this.titleBarMinBtn.addEventListener('click', this.hide.bind(this));
                this.titleBarMinBtn.addEventListener('mousedown', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.focus();
                })
                this.titleBarMinBtn.window = this;
                this.titleBarBtns.appendChild(this.titleBarMinBtn);
            }

            if (this.options.max_btn) {
                this.titleBarMaxBtn = document.createElement('img');
                this.titleBarMaxBtn.classList.add('tilebar-btn');
                this.titleBarMaxBtn.src = this.options.style.max_btn_img;
                this.titleBarMaxBtn.addEventListener('click', this.toggleFullScreen.bind(this));
                this.titleBarMaxBtn.addEventListener('mousedown', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.focus();
                })
                this.titleBarMaxBtn.window = this;
                this.titleBarBtns.appendChild(this.titleBarMaxBtn);
            }

            if (this.options.close_btn) {
                this.titleBarCloseBtn = document.createElement('img');
                this.titleBarCloseBtn.classList.add('tilebar-btn', 'red');
                this.titleBarCloseBtn.src = this.options.style.close_btn_img;
                this.titleBarCloseBtn.addEventListener('click', this.close.bind(this));
                this.titleBarCloseBtn.addEventListener('mousedown', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.focus();
                })
                this.titleBarCloseBtn.window = this;
                this.titleBarBtns.appendChild(this.titleBarCloseBtn);
            }

            let offsetX, offsetY, target;
            target = this;
            function startDrag(e) {
                // 防止默認行為（如滾動）
                e.preventDefault();

                // 判斷事件來源（鼠標或觸控）
                const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
                const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

                // 記錄拖曳的初始位置
                offsetX = clientX - target.dom.getBoundingClientRect().left;
                offsetY = clientY - target.dom.getBoundingClientRect().top;

                // 添加移動和釋放事件處理器
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                document.addEventListener('touchmove', onTouchMove);
                document.addEventListener('touchend', onTouchEnd);
            }
            function onMouseMove(e) {
                moveElement(e.clientX, e.clientY);
            }
            function onTouchMove(e) {
                moveElement(e.touches[0].clientX, e.touches[0].clientY);
            }
            function moveElement(clientX, clientY) {
                // 計算新的位置
                let newLeft = clientX - offsetX;
                let newTop = clientY - offsetY;

                // 獲取視口的寬高
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // 獲取元素的寬高
                const elementWidth = target.dom.offsetWidth;
                const elementHeight = target.dom.offsetHeight;

                // 計算元素的最大和最小位置
                newLeft = Math.max(0, Math.min(viewportWidth - elementWidth, newLeft));
                newTop = Math.max(0, Math.min(viewportHeight - elementHeight, newTop));
                // 更新元素的位置
                target.dom.style.left = newLeft + 'px';
                target.dom.style.top = newTop + 'px';
                target.options.x = newLeft;
                target.options.y = newTop;
            }
            function onMouseUp() {
                endDrag();
            }
            function onTouchEnd() {
                endDrag();
            }
            function endDrag() {
                // 移除移動和釋放事件處理器
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            }
            // 設置拖曳開始的事件處理器
            this.titleBar.addEventListener('mousedown', (e) => {
                target.focus();
                if (target.options.draggable && target.options.screen_type !== 'fullscreen') startDrag(e);
            });
            this.titleBar.addEventListener('touchstart', (e) => {
                target.focus();
                if (target.options.draggable && target.options.screen_type !== 'fullscreen') startDrag(e);
            });

        }

        this.content = document.createElement('div');
        this.content.classList.add('content');
        this.content.window = this;
        this.dom.appendChild(this.content);

        document.querySelector('main').appendChild(this.dom);

        new ResizeObserver(e => {
            if (this.options.screen_type === 'fullscreen') return;

            var ev = SystemEventManager.emit('window.resize', {
                window: this,
                width: this.dom.offsetWidth,
                height: this.dom.offsetHeight,
                continue: true,
            });
            if (!ev.args.continue) return;

            this.options.width = ev.args.width;
            this.options.height = ev.args.height;
        }).observe(this.dom);

        this.dom.addEventListener('mousedown', (e => {
            this.focus();
        }).bind(this))

        if (this.options.screen_type === 'fullscreen') {
            this.fullScreen();
        }
        else if (this.options.screen_type === 'minimized') {
            this.hide();
        }
        else {
            this.focus();
        }
        if (!this.options.show) {
            this.hide();
        }

        this.on('window.close_end', () => {
            SystemEventManager.clear_key(this.id);
        })

    }
    on(eventType, callback) {
        SystemEventManager.on(eventType, function (e) {
            if (e.window === this) {
                callback(e);
            }
        }, this.id)
    }
    show() {
        var ev = SystemEventManager.emit('window.show', {
            window: this,
            continue: true,
        });
        if (!ev.args.continue) return;

        this.dom.classList.remove('hide')
        this.options.show = true;

        SystemEventManager.emit('window.show_end', {
            window: this,
        });
    }
    hide() {
        var ev = SystemEventManager.emit('window.hide', {
            window: this,
            continue: true,
        });
        if (!ev.args.continue) return;

        this.dom.classList.add('hide')
        this.options.show = false;

        SystemEventManager.emit('window.hide_end', {
            window: this,
        });
    }
    toggle() {
        if (!this.options.show) this.show();
        else this.hide();
    }
    close() {
        var ev = SystemEventManager.emit('window.close', {
            window: this,
            continue: true,
        });
        if (!ev.args.continue) return;

        WindowManager.remove(this.id);
        this.dom.remove();

        SystemEventManager.emit('window.close_end', {
            window: this,
        });
    }
    fullScreen() {
        var ev = SystemEventManager.emit('window.fullscreen', {
            window: this,
            continue: true,
        });
        if (!ev.args.continue) return;

        this.options.screen_type = 'fullscreen';
        this.dom.style.width = '100%';
        this.dom.style.height = '100%';
        this.dom.style.left = '0';
        this.dom.style.top = '0';
        this.dom.style.resize = 'none';
        this.focus();

        SystemEventManager.emit('window.fullscreen_end', {
            window: this,
        });

    }
    unfullscreen() {
        var ev = SystemEventManager.emit('window.unfullscreen', {
            window: this,
            continue: true,
        });
        if (!ev.args.continue) return;

        this.options.screen_type = 'normal';
        this.dom.style.width = `${this.options.width}px`;
        this.dom.style.height = `${this.options.height}px`;
        this.dom.style.left = `${this.options.x}px`;
        this.dom.style.top = `${this.options.y}px`;
        this.dom.style.resize = 'both';
        this.focus();

        SystemEventManager.emit('window.unfullscreen_end', {
            window: this,
        });

    }
    toggleFullScreen() {

        if (this.options.screen_type === 'normal') {
            this.fullScreen();
        }
        else if (this.options.screen_type === 'fullscreen') {
            this.unfullscreen();
        }
        this.focus();
    }
    focus() {
        var ev = SystemEventManager.emit('window.focus', {
            window: this,
            continue: true,
        });
        if (!ev.args.continue) return;

        this.show();
        WindowManager.focus(this.id);
        WindowManager.sort();

        SystemEventManager.emit('window.focus_end', {
            window: this,
        });
    }
    setZIndex(zindex) {
        var ev = SystemEventManager.emit('window.setZIndex', {
            window: this,
            zIndex: zindex,
        });

        this.dom.style.zIndex = ev.args.zIndex;

        SystemEventManager.emit('window.setZIndex_end', {
            window: this,
        });
    }
    setSize(width, height) {
        var ev = SystemEventManager.emit('window.setSize', {
            window: this,
            width: width,
            height: height,
            continue: true,
        });
        if (!ev.args.continue) return;

        this.dom.style.width = `${ev.args.width}px`;
        this.dom.style.height = `${ev.args.height}px`;
        this.options.width = ev.args.width;
        this.options.height = ev.args.height;

        SystemEventManager.emit('window.setSize_end', {
            window: this,
        });
    }
    setPosition(x, y) {
        var ev = SystemEventManager.emit('window.setPosition', {
            window: this,
            continue: true,
            x: x,
            y: y,
        });
        if (!ev.args.continue) return;

        this.dom.style.left = `${ev.args.x}px`;
        this.dom.style.top = `${ev.args.y}px`;
        this.options.x = ev.args.x;
        this.options.y = ev.args.y;

        SystemEventManager.emit('window.setPosition_end', {
            window: this,
        });
    }
    setContent(dom) {
        var ev = SystemEventManager.emit('window.setContent', {
            window: this,
            continue: true,
            dom: dom,
        });
        if (!ev.args.continue) return;


        this.content.innerHTML = '';
        this.content.appendChild(ev.args.dom);
        this.options.content = ev.args.dom;

        SystemEventManager.emit('window.setContent_end', {
            window: this,
        });
    }
    setTitle(title) {
        var ev = SystemEventManager.emit('window.setTitle', {
            window: this,
            continue: true,
            title: title,
        });
        if (!ev.args.continue) return;

        this.titleText.textContent = ev.args.title;
        this.options.title = ev.args.title;

        SystemEventManager.emit('window.setTitle_end', {
            window: this,
        });

    }
    setIcon(icon) {
        var ev = SystemEventManager.emit('window.setIcon', {
            window: this,
            continue: true,
            icon: icon,
        });
        if (!ev.args.continue) return;

        this.titleIcon.src = ev.args.icon;
        this.options.icon = ev.args.icon;

        SystemEventManager.emit('window.setIcon_end', {
            window: this,
        });
    }
    setDraggable(draggable) {
        var ev = SystemEventManager.emit('window.setDraggable', {
            window: this,
            continue: true,
            draggable: draggable,
        });
        if (!ev.args.continue) return;

        this.options.draggable = ev.args.draggable;

        SystemEventManager.emit('window.setDraggable_end', {
            window: this,
        });

    }
    setResizable(resizable) {
        var ev = SystemEventManager.emit('window.setResizable', {
            window: this,
            continue: true,
            resizable: resizable,
        });
        if (!ev.args.continue) return;

        this.options.resizable = ev.args.resizable;
        if (this.options.resizable) this.dom.style.resize = 'both';
        else this.dom.style.resize = 'none';

        SystemEventManager.emit('window.setResizable_end', {
            window: this,
        });
    }
    setAlwaysOnTop(alwaysOnTop) {
        var ev = SystemEventManager.emit('window.setAlwaysOnTop', {
            window: this,
            continue: true,
            alwaysOnTop: alwaysOnTop,
        });
        if (!ev.args.continue) return;

        this.options.alwaysOnTop = ev.args.alwaysOnTop;
        WindowManager.sort();

        SystemEventManager.emit('window.setAlwaysOnTop_end', {
            window: this,
        });

    }
    setLayer(layer) {
        var ev = SystemEventManager.emit('window.setLayer', {
            window: this,
            continue: true,
            layer: layer,
        });
        if (!ev.args.continue) return;

        this.options.layer = ev.args.layer;
        WindowManager.sort();

        SystemEventManager.emit('window.setLayer_end', {
            window: this,
        });
    }
}

class ContentManager {
    constructor() {
        if (new.target === ContentManager) {
            throw new SyntaxError("This class cannot be instantiated");
        }
    }
    static loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => {
                resolve();
            };
            script.onerror = () => {
                reject(new Error(`Failed to load script from ${url}`));
            };
            document.head.appendChild(script);
        });
    }
}

class ExtensionPackManager {
    static #extensions = [];
    static #extension_state = {};
    constructor() {
        if (new.target === ExtensionPackManager) {
            throw new SyntaxError("This class cannot be instantiated");
        }
    }
    static init() {
        const error_list = [];
        if (!SystemState.get() === 'init') {
            throw new StateError(`ExtensionPackManager.init() should be called in init state.`);
        }
        if (Utils.getEnvironment() === "NWjs") {
            const fs = require('fs');
            const exdir = fs.readdirSync(Utils.pathJoin(Utils.dirname, PATH_ExtensionPack));
            for (let ex of exdir) {
                if (!fs.statSync(Utils.pathJoin(Utils.dirname, PATH_ExtensionPack, ex)).isDirectory()) continue;
                if (!fs.existsSync(Utils.pathJoin(Utils.dirname, PATH_ExtensionPack, ex, '/package.json'))) continue;
                const expackage = JSON.parse(fs.readFileSync(Utils.pathJoin(Utils.dirname, PATH_ExtensionPack, ex, '/package.json')));
                expackage.path = Utils.pathJoin(Utils.dirname, PATH_ExtensionPack, ex);
                if (ExtensionPackManager.find_pkg(expackage.package)) {
                    console.warn(`Duplicate package name detected: ${expackage.package}. Please check your extension packs.`);
                    if (semver.satisfies(expackage.version, ExtensionPackManager.find_pkg(expackage.package).version)) {
                        this.#override_pkg(expackage);
                    }
                }
                else {
                    this.#extensions.push(expackage);
                }
            }
        }
        else if (Utils.getEnvironment() === "WebServer") {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', Utils.pathJoin(Utils.dirname, PATH_ExtensionPack), false);
                xhr.send();
                this.#extensions = JSON.parse(xhr.responseText)
            }
            catch {
                throw new Error('Failed to load extension packs.');
            }
        }

        const sorter = [];
        const visited = new Set();
        const tempVisited = new Set();

        //Add VTS version.
        sorter.push({
            package: VTS_PackageName,
            version: VTS_Version,
        });
        visited.add(VTS_PackageName);

        function visit(package_name) {
            const target = ExtensionPackManager.find_pkg(package_name);
            if (!target) {
                error_list.push(`Extension pack ${package_name} not found.`);
                return;
            }
            if (tempVisited.has(package_name)) {
                error_list.push(`Circular dependency detected in package ${package_name}.`);
                return;
            }
            if (!visited.has(package_name)) {
                tempVisited.add(package_name);
                for (var dependence in target.dependence) {
                    const pkg = ExtensionPackManager.find_pkg(dependence);
                    if (semver.satisfies(pkg.version, target.dependence[dependence])) {
                        visit(dependence);
                    }
                    else {
                        error_list.push(`Extension pack ${target.package} requires version ${target.dependence[dependence]} of ${dependence}, but only version ${pkg.version} is available.`);
                        return;
                    }
                }
                tempVisited.delete(package_name);
                visited.add(package_name);
                sorter.push(target);
            };
        }
        this.#extensions.forEach(v => {
            visit(v.package)
        });
        this.#extensions = sorter;

        if (error_list.length > 0) {
            throw new ExtensionPackError(error_list.join('<br>'));
        }
    }

    static find_pkg(package_name) {
        return this.#extensions.find(v => v.package === package_name);
    }
    static #override_pkg(newpkg) {
        for (let i = 0; i < this.#extensions.length; i++) {
            if (this.#extensions[i].package === newpkg.package) {
                this.#extensions[i] = newpkg;
                return;
            }
        }
    }

    static set_state(package_name, state) {
        this.#extension_state[package_name] = state;
    }

    static get_state(package_name) {
        return this.#extension_state[package_name];
    }

    static foreach(callback) {
        for (let i = 0; i < this.#extensions.length; i++) {
            callback(this.#extensions[i]);
        }
    }

}

//error throw.

if (Utils.getEnvironment() === "NWjs") {
    window.onerror = (ev, source, lineno, colno, error) => {
        SystemState.set('error');
        Utils.setBoot('error', {
            'title': error.name,
            'text': error.message,
            'btn': 'Close',
            callback: () => {
                nw.App.quit();
            }
        });
        Utils.openBoot();
    }
    window.onunhandledrejection = (ev) => {
        SystemState.set('error');
        Utils.setBoot('error', {
            'title': ev.reason.name,
            'text': ev.reason.message,
            'btn': 'Close',
            callback: () => {
                nw.App.quit();
            }
        });
        Utils.openBoot();
    }
    process.on('uncaughtException', (err) => {
        SystemState.set('error');
        Utils.setBoot('error', {
            'title': err.name,
            'text': err.message,
            'btn': 'Close',
            callback: () => {
                nw.App.quit();
            }
        });
        Utils.openBoot();
    });
    process.on('unhandledRejection', (err) => {
        SystemState.set('error');
        Utils.setBoot('error', {
            'title': err.name,
            'text': err.message,
            'btn': 'Close',
            callback: () => {
                nw.App.quit();
            }
        });
        Utils.openBoot();
    });
}
else if (Utils.getEnvironment() === "WebServer") {
    window.onerror = (ev, source, lineno, colno, error) => {
        SystemState.set('error');
        Utils.setBoot('error', {
            'title': error.name,
            'text': error.message,
            'btn': 'Reload',
            callback: () => {
                window.location.reload(true);
            }
        });
        Utils.openBoot();
    }
    window.onunhandledrejection = (ev) => {
        SystemState.set('error');
        Utils.setBoot('error', {
            'title': 'Error',
            'text': ev.reason,
            'btn': 'Reload',
            callback: () => {
                window.location.reload(true);
            }
        });
        Utils.openBoot();
    }
}
else {
    window.onerror = (ev, source, lineno, colno, error) => {
        console.log(ev, source, lineno, colno, error)
        SystemState.set('error');
        Utils.setBoot('error', {
            'title': 'Error',
            'text': ev,
            'btn': 'Reload',
            callback: () => {
                window.location.reload(true);
            }
        });
        Utils.openBoot();
    }
    window.onunhandledrejection = (ev) => {
        SystemState.set('error');
        Utils.setBoot('error', {
            'title': 'Error',
            'text': ev,
            'btn': 'Reload',
            callback: () => {
                window.location.reload(true);
            }
        });
        Utils.openBoot();
    }
}