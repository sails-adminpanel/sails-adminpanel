import { createApp } from "vue";
import App from "./App.vue";
import './style.css'

export function MountMediaManager(data) {
    let app = createApp(App);
    app.provide("uploadUrl", data.url);
    app.provide("toJsonId", data.toJsonId);
    app.provide("config", data.config);
    app.provide("managerId", data.managerId);
    app.provide("group", data.group);
    app.provide("initList", data.list);
    app.mount(data.id);
}

window.MountMediaManager = MountMediaManager;
