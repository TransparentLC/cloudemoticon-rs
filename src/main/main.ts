import { invoke } from '@tauri-apps/api/core';
import { emit, listen } from '@tauri-apps/api/event';
import {
    exists,
    mkdir,
    readTextFile,
    writeTextFile,
} from '@tauri-apps/plugin-fs';
import { register, unregister } from '@tauri-apps/plugin-global-shortcut';
import { fetch } from '@tauri-apps/plugin-http';
import { createApp } from 'vue';
import wretch from 'wretch';
import app from './app.vue';
import { updateSources } from './emoticon';
import { configDir, configFile, emoticonCacheDir, sourcesFile } from './path';
import router from './router';
import store from './store';

wretch.polyfills({ fetch });

await Promise.all([
    mkdir(configDir, { recursive: true }),
    mkdir(emoticonCacheDir, { recursive: true }),
]);
if (await exists(configFile)) {
    Object.assign(store.config, JSON.parse(await readTextFile(configFile)));
} else {
    await writeTextFile(configFile, JSON.stringify(store.config, null, 4));
}
if (await exists(sourcesFile)) {
    Object.assign(store.sources, JSON.parse(await readTextFile(sourcesFile)));
} else {
    await writeTextFile(sourcesFile, JSON.stringify(store.sources, null, 4));
}

// 自动输入窗口会触发这个事件来获取已加载的源
// 但是要等到初始加载完成后才能返回
let emoticonStoreInitedResolve: () => void;
const emoticonStoreInited = new Promise<void>(resolve => {
    emoticonStoreInitedResolve = resolve;
});
listen('update-emoticon-emit', async () => {
    await emoticonStoreInited;
    store.emoticon.forEach((v, k) =>
        emit('update-emoticon', {
            key: k,
            value: v,
        }),
    );
});

createApp(app).use(router).mount('#app');

// 注册显示和隐藏自动输入窗口的快捷键
await unregister(store.config.shortcut).catch(() => {});
await register(store.config.shortcut, e => {
    if (e.state === 'Pressed') invoke('show_selector');
}).catch(e =>
    window.chiya.dialog.error({
        title: '触发快捷键绑定失败',
        content: e.toString(),
        maskClosable: false,
        positiveText: '确认',
    }),
);

// 初始加载所有订阅源
await updateSources(true)
    .then(() => emoticonStoreInitedResolve())
    .catch(e => window.chiya.message.error(e));

// 定时更新所有订阅源
setTimeout(async () => {
    while (true) {
        const timeout = store.config.updateInterval * 60000;
        store.nextUpdateTime = new Date(Date.now() + timeout);
        let updateMessage = false;
        await new Promise(resolve => {
            store.nextUpdateRightNowTrigger = () => {
                updateMessage = true;
                resolve(null);
            };
            setTimeout(resolve, timeout);
        });
        await updateSources(false).catch(e => window.chiya.message.error(e));
        if (updateMessage) window.chiya.message.success('已更新所有订阅源');
    }
});
