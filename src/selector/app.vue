<template>
    <n-config-provider
        :locale="zhCN"
        :date-locale="dateZhCN"
        :theme="theme"
        :theme-overrides="themeOverrides"
    >
        <n-layout position="absolute">
            <n-layout-content>
                <n-flex vertical style="height:100vh">
                    <div style="padding:12px">
                        <n-flex align="center">
                            <n-button
                                quaternary circle type="primary"
                                :disabled="!emoticon.size"
                                @click="emoticonRepositoryIndex = emoticonRepositoryIndex === 0 ? (emoticonSortedArray.length - 1) : (emoticonRepositoryIndex - 1)"
                            >
                                <template #icon><n-mdi :icon="mdiChevronLeft"></n-mdi></template>
                            </n-button>
                            <n-text strong type="primary" tag="div" style="flex-grow:1;text-align:center">{{ currentEmoticonRepository?.metadata.name }}</n-text>
                            <n-button
                                quaternary circle type="primary"
                                :disabled="!emoticon.size"
                                @click="emoticonRepositoryIndex = (emoticonRepositoryIndex + 1) % emoticonSortedArray.length"
                            >
                                <template #icon><n-mdi :icon="mdiChevronRight"></n-mdi></template>
                            </n-button>
                        </n-flex>
                        <n-select
                            v-if="emoticon.size"
                            style="margin-top:12px"
                            size="small"
                            v-model:value="emoticonCategoryIndex"
                            :options="currentEmoticonRepository?.repository.categories.map((e, i) => ({ label: e.name, value: i }))"
                        ></n-select>
                        <n-select
                            v-else
                            style="margin-top:12px"
                            size="small"
                        ></n-select>
                    </div>
                    <n-list
                        style="flex-grow:1;display:grid;grid-template-columns:minmax(0,1fr)"
                        bordered
                        clickable
                        hoverable
                    >
                        <n-list-item
                            v-for="i in 10"
                            @click="triggerInput(i - 1)"
                            :style="{
                                backgroundColor: currentEmoticonPage[i - 1] ? undefined : 'unset',
                                cursor: currentEmoticonPage[i - 1] ? undefined : 'unset',
                            }"
                        >
                            <n-text
                                tag="div"
                                :style="{
                                    whiteSpace: (currentEmoticonPage[i - 1] ? currentEmoticonPage[i - 1].emoticon : '').includes('\n') ? 'nowrap' : 'pre',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                }"
                            >{{ currentEmoticonPage[i - 1] ? currentEmoticonPage[i - 1].emoticon : '' }}</n-text>
                            <template #suffix>
                                <n-kbd
                                    :style="{ visibility: currentEmoticonPage[i - 1] ? undefined : 'hidden' }"
                                    :keys="(i % 10).toString()"
                                    :dark="isDarkKey"
                                ></n-kbd>
                            </template>
                        </n-list-item>
                    </n-list>
                    <div style="padding:12px;padding-bottom:24px;margin:0 auto;display:grid;grid-template-columns:auto 1fr;gap:12px 24px">
                        <div><n-kbd keys="-" :dark="isDarkKey"></n-kbd> / <n-kbd keys="=" :dark="isDarkKey"></n-kbd></div>
                        <div style="display:flex;align-items:center">
                            翻页
                            <n-button
                                quaternary circle size="tiny"
                                :disabled="!emoticon.size"
                                @click="(emoticonPageIndex > 0) && emoticonPageIndex--"
                            >
                                <template #icon><n-mdi :icon="mdiChevronLeft"></n-mdi></template>
                            </n-button>
                            <span style="text-align:center;width:1.5em">{{ emoticonPageIndex + 1 }}</span>/<span style="text-align:center;width:1.5em">{{ currentEmoticonPageLimit || 1 }}</span>
                            <n-button
                                quaternary circle size="tiny"
                                :disabled="!emoticon.size"
                                @click="(emoticonPageIndex < currentEmoticonPageLimit - 1) && emoticonPageIndex++"
                            >
                                <template #icon><n-mdi :icon="mdiChevronRight"></n-mdi></template>
                            </n-button>
                        </div>

                        <div><n-kbd keys="Shift" :dark="isDarkKey"></n-kbd> + <n-kbd keys="-" :dark="isDarkKey"></n-kbd> / <n-kbd keys="=" :dark="isDarkKey"></n-kbd></div>
                        <div>切换分组</div>

                        <div><n-kbd keys="Ctrl" :dark="isDarkKey"></n-kbd> + <n-kbd keys="-" :dark="isDarkKey"></n-kbd> / <n-kbd keys="=" :dark="isDarkKey"></n-kbd></div>
                        <div>切换订阅源</div>
                    </div>
                </n-flex>
            </n-layout-content>
        </n-layout>
    </n-config-provider>
</template>

<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { invoke } from '@tauri-apps/api/core';
import { emit, listen } from '@tauri-apps/api/event';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import {
    darkTheme,
    dateZhCN,
    GlobalThemeOverrides,
    lightTheme,
    useOsTheme,
    zhCN,
} from 'naive-ui';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import NKbd from '../components/kbd.vue';
import NMdi from '../components/mdi.vue';

const config = reactive<CloudEmoticonConfig>({
    theme: 'auto',
    mode: 'copy-paste',
    shortcut: 'Ctrl+Shift+E',
    updateInterval: 480,
    storeRepository: 'cloud-emoticon/store-repos',
    githubToken: '',
});

const osTheme = useOsTheme();
onMounted(() =>
    listen<CloudEmoticonConfig>('update-config', e =>
        Object.assign(config, e.payload),
    ),
);
const theme = computed(() => {
    switch (config.theme) {
        case 'auto':
            return osTheme.value === 'light' ? lightTheme : darkTheme;
        case 'light':
            return lightTheme;
        case 'dark':
            return darkTheme;
    }
});
const isDarkKey = computed(() => {
    switch (config.theme) {
        case 'auto':
            return osTheme.value === 'dark';
        case 'light':
            return false;
        case 'dark':
            return true;
    }
});
const themeOverrides: GlobalThemeOverrides = {
    common: {
        fontFamilyMono:
            'v-mono, SFMono-Regular, Menlo, "Cascadia Code", Consolas, Courier, monospace',
        fontWeightStrong: 'bold',
        primaryColor: '#f69',
        primaryColorHover: '#f8a',
        primaryColorPressed: '#f37',
        primaryColorSuppl: '#f8a',
    },
};

const emoticon = ref(new Map<string, Emoticon>());
onMounted(async () => {
    await listen<{ key: string; value: Emoticon | null }>(
        'update-emoticon',
        e =>
            e.payload.value === null
                ? emoticon.value.delete(e.payload.key)
                : emoticon.value.set(e.payload.key, e.payload.value),
    );
    await emit('update-emoticon-emit');
});

const emoticonSortedArray = computed(() =>
    Array.from(emoticon.value.values()).sort((v0, v1) =>
        v0.metadata.name.localeCompare(v1.metadata.name),
    ),
);
const emoticonRepositoryIndex = ref(0);
const emoticonCategoryIndex = ref(0);
const emoticonPageIndex = ref(0);
const currentEmoticonRepository = computed(
    () => emoticonSortedArray.value[emoticonRepositoryIndex.value] || null,
);
const currentEmoticonCategory = computed(
    () =>
        currentEmoticonRepository.value?.repository.categories[
            emoticonCategoryIndex.value
        ] || null,
);
const currentEmoticonPageLimit = computed(() =>
    Math.ceil(currentEmoticonCategory.value?.entries.length / 10),
);
const currentEmoticonPage = computed(
    () =>
        currentEmoticonCategory.value?.entries.slice(
            emoticonPageIndex.value * 10,
            (emoticonPageIndex.value + 1) * 10,
        ) || [],
);
watch(emoticonRepositoryIndex, () => {
    emoticonCategoryIndex.value = 0;
    emoticonPageIndex.value = 0;
});
watch(emoticonCategoryIndex, () => {
    emoticonPageIndex.value = 0;
});
watch(emoticonSortedArray, () => {
    if (emoticonRepositoryIndex.value >= emoticonSortedArray.value.length)
        emoticonRepositoryIndex.value = emoticonSortedArray.value.length - 1;
});

const triggerInput = (i: number) => {
    if (currentEmoticonPage.value[i]) {
        getCurrentWebviewWindow()
            .hide()
            .then(() =>
                invoke('input_text', {
                    mode: config.mode,
                    text: currentEmoticonPage.value[i].emoticon,
                }),
            );
    }
};

onMounted(() =>
    addEventListener('keydown', e => {
        if (e.key === 'Escape') return invoke('show_selector');
        if (!emoticon.value.size) return;
        if (e.ctrlKey && e.key === '-') {
            emoticonRepositoryIndex.value =
                emoticonRepositoryIndex.value === 0
                    ? emoticonSortedArray.value.length - 1
                    : emoticonRepositoryIndex.value - 1;
        } else if (e.ctrlKey && e.key === '=') {
            emoticonRepositoryIndex.value =
                (emoticonRepositoryIndex.value + 1) %
                emoticonSortedArray.value.length;
        } else if (e.shiftKey && e.key === '_') {
            emoticonCategoryIndex.value =
                emoticonCategoryIndex.value === 0
                    ? currentEmoticonRepository.value.repository.categories
                          .length - 1
                    : emoticonCategoryIndex.value - 1;
        } else if (e.shiftKey && e.key === '+') {
            emoticonCategoryIndex.value =
                (emoticonCategoryIndex.value + 1) %
                currentEmoticonRepository.value.repository.categories.length;
        } else if (e.key === '-') {
            if (emoticonPageIndex.value > 0) emoticonPageIndex.value--;
        } else if (e.key === '=') {
            if (emoticonPageIndex.value < currentEmoticonPageLimit.value - 1)
                emoticonPageIndex.value++;
        } else {
            for (let i = 0; i < 10; i++) {
                const key = '1234567890'[i];
                if (e.key === key) {
                    triggerInput(i);
                    break;
                }
            }
        }
    }),
);
</script>

<style>
html {
    user-select: none;
}
.n-list .n-list-item .n-list-item__main {
    min-width: 0;
}
</style>