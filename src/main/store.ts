import { emit } from '@tauri-apps/api/event';
import { reactive, watch } from 'vue';

const store = reactive({
    config: {
        theme: 'auto',
        mode: 'copy-paste',
        shortcut: 'Ctrl+Shift+E',
        updateInterval: 480,
        storeRepository: 'cloud-emoticon/store-repos',
    } as CloudEmoticonConfig,
    sources: [] as string[],
    emoticon: new Map<string, Emoticon>(),
    nextUpdateTime: new Date(),
    nextUpdateRightNowTrigger: () => {},
});

watch(
    () => store.config,
    config => emit('update-config', config),
    { deep: true },
);
emit('update-config', { theme: store.config.theme });

export default store;
