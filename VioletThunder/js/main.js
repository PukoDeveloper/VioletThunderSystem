

// Constant
const PATH = {
    ExtensionPack: "extensions",
    Language: "lang",
    Image: "img",
    Sound: "sound",
}


class Main {
    constructor() {
        this.apps = {};
        this.ready_process = [];
        this.ready_process_count = 0;
    }
    init() {
        SystemState.set('init');
        SystemOptions.init();
        Utils.openBoot();
        Utils.setBoot('spinner', {
            text: 'Initialization...'
        });

        if (Utils.getEnvironment() === "NWjs") {
            const win = nw.Window.get();
            win.on('close', () => {
                nw.App.quit();
            });
            win.on('loaded', () => {
                ExtensionPackManager.init();
                this.load_lang();
                this.apply_extension();
                this.apply_lang();
                this.startLoad().then(() => {
                    this.readyToRun();
                });
            });
            // win.show();
        }
        else if (Utils.getEnvironment() === "WebServer") {
            window.addEventListener('DOMContentLoaded', () => {
                ExtensionPackManager.init();
                this.load_lang();
                this.apply_extension();
                this.apply_lang();
                this.startLoad().then(() => {
                    this.readyToRun();
                });
            });
        }
        else if (Utils.getEnvironment() === "WebFile") {
            // 暫不支援本地檔案模式。
            SystemState.set('error');
            Utils.setBoot('error', {
                'title': 'EnvironmentError',
                'text': `WebFile environment is not supported.`
            });

        }
    }


    apply_extension() {
        ExtensionPackManager.foreach(extension => {
            if (!extension.main) return;
            this.ready_process.push(function () {
                return new Promise(reslove => {
                    Utils.setBoot('loading', {
                        text: `Loading ${extension.package}...`
                    });
                    ContentManager.loadScript(Utils.pathJoin(extension.path, extension.main)).then(reslove);
                });
            })
        });
    }

    load_lang() {
        this.ready_process.push(function () {
            return new Promise(reslove => {
                Utils.setBoot('loading', {
                    text: 'Loading language...'
                });
                TextManager.load(Utils.pathJoin(Utils.dirname, PATH_Language, SystemOptions.get('language') + '.json')).then(reslove);
            });
        });
        ExtensionPackManager.foreach(extension => {
            if (!extension.language) return;
            this.ready_process.push(function () {
                return new Promise(reslove => {
                    Utils.setBoot('loading', {
                        text: `Loading ${extension.package} language...`
                    });
                    if (extension.language.support.indexOf(SystemOptions.get('language')) === -1) {
                        TextManager.load(Utils.pathJoin(extension.path, PATH_Language, extension.language.default + '.json')).then(reslove);
                    }
                    else {
                        TextManager.load(Utils.pathJoin(extension.path, PATH_Language, SystemOptions.get('language') + '.json')).then(reslove);
                    }
                });
            });
        });
    }

    apply_lang() {
        this.ready_process.push(function () {
            return new Promise(reslove => {
                Utils.setBoot('loading', {
                    text: 'Applying language...'
                });
                TextManager.apply();
                reslove();
            });
        });
    }

    async startLoad() {
        this.ready_process_count = this.ready_process.length;
        for (let i = 0; i < this.ready_process.length; i++) {
            await this.ready_process[i].call(this);
            Utils.setBoot('loading', {
                progress: ((i + 1) / this.ready_process.length) * 100
            });
        }
    }

    readyToRun() {
        // SystemState.state = SystemStateType.READY;
        Utils.closeBoot();
    }
}

new Main().init();
