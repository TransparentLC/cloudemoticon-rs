import { emit } from '@tauri-apps/api/event';
import { reactive, watch } from 'vue';

const store = reactive({
    config: {
        theme: 'auto',
        mode: 'copy-paste',
        shortcut: 'Ctrl+Shift+E',
        updateInterval: 480,
    } as CloudEmoticonConfig,
    sources: [] as string[],
    emoticon: new Map<string, Emoticon>(),
    nextUpdateTime: new Date(),
    nextUpdateRightNowTrigger: (..._args: unknown[]) => {},
});

watch(
    () => store.config,
    config => emit('update-config', config),
    { deep: true },
);
emit('update-config', { theme: store.config.theme });

export default store;
