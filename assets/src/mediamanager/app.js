import { createApp } from "vue";
import App from "./App.vue";

export function MountMediaManager(data) {
    let app = createApp(App);
    app.provide("uploadUrl", data.url);
    app.provide("toJsonId", data.toJsonId);
    app.provide("config", data.config);
    app.provide("managerId", data.managerId);
    app.provide("initList", data.list);
    app.mount(data.id);
}

window.MountMediaManager = MountMediaManager;
