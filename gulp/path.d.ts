export namespace path {
    export namespace build {
        let js: string;
        let css: string;
        let fonts: string;
    }
    export namespace src {
        let js_1: string;
        export { js_1 as js };
        export let scss: string;
        let fonts_1: string;
        export { fonts_1 as fonts };
        export let ejs: string;
    }
    export namespace watch {
        let scss_1: string;
        export { scss_1 as scss };
        export let catalogVue: string;
        export let MMVue: string;
    }
    export { buildFolder as clean };
    export { srcFolder as srcfolder };
}
export const buildFolder: "./assets/build";
export const srcFolder: "./assets/src";
