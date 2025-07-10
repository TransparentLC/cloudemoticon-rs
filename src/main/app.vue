<template>
    <n-config-provider
        :locale="zhCN"
        :date-locale="dateZhCN"
        :theme="theme"
        :theme-overrides="themeOverrides"
    >
        <n-space vertical size="large">
            <n-layout position="absolute">
                <n-layout has-sider position="absolute">
                    <n-layout-sider
                        bordered
                        :collapsed="menuCollapsed"
                        :collapsed-width="64"
                        :width="210"
                        collapse-mode="width"
                        show-trigger
                        @collapse="menuCollapsed = true"
                        @expand="menuCollapsed = false"
                        :native-scrollbar="false"
                    >
                        <n-menu
                            :collapsed="menuCollapsed"
                            :collapsed-width="64"
                            :collapsed-icon-size="24"
                            :options="menuOptions"
                            :value="menuValue"
                        ></n-menu>
                    </n-layout-sider>
                    <router-view v-slot="{ Component, route }">
                        <n-layout-content
                            :content-style="{ padding: route.meta.noPadding ? undefined : '24px' }"
                            :native-scrollbar="false"
                        >
                            <keep-alive>
                                <component v-if="route.meta.keepAlive" :is="Component" :key="route.fullPath"></component>
                            </keep-alive>
                            <component v-if="!route.meta.keepAlive" :is="Component"></component>
                        </n-layout-content>
                    </router-view>
                </n-layout>
            </n-layout>
        </n-space>
    </n-config-provider>
</template>

<script setup lang="ts">
import {
    mdiCogs,
    mdiEmoticon,
    mdiInformationOutline,
    mdiPlaylistEdit,
} from '@mdi/js';
import {
    type ConfigProviderProps,
    createDiscreteApi,
    darkTheme,
    dateZhCN,
    GlobalThemeOverrides,
    lightTheme,
    type MenuOption,
    NInput,
    useOsTheme,
    zhCN,
} from 'naive-ui';
import { computed, h, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import NMdi from '../components/mdi.vue';
import store from './store';

const route = useRoute();
const osTheme = useOsTheme();
const theme = computed(() => {
    switch (store.config.theme) {
        case 'auto':
            return osTheme.value === 'light' ? lightTheme : darkTheme;
        case 'light':
            return lightTheme;
        case 'dark':
            return darkTheme;
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
const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
    theme: theme.value,
    themeOverrides,
    locale: zhCN,
    dateLocale: dateZhCN,
}));

// @ts-expect-error 稍后添加额外的dialog相关方法
window.chiya = createDiscreteApi(['message', 'dialog', 'notification'], {
    notificationProviderProps: {
        placement: 'bottom-right',
    },
    configProviderProps: configProviderPropsRef,
});
window.chiya.dialog.alert = options =>
    new Promise((resolve, reject) =>
        window.chiya.dialog.create({
            positiveText: '确认',
            onPositiveClick: () => resolve(),
            onMaskClick: reject,
            ...options,
        }),
    );
window.chiya.dialog.confirm = options =>
    new Promise(resolve =>
        window.chiya.dialog.create({
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => resolve(true),
            onNegativeClick: () => resolve(false),
            onMaskClick: () => resolve(null),
            ...options,
        }),
    );
window.chiya.dialog.prompt = options => {
    let v = options.defaultValue || '';
    return new Promise(resolve =>
        window.chiya.dialog.create({
            content: () =>
                h(NInput, {
                    defaultValue: options.defaultValue,
                    placeholder: options.placeholder,
                    onInput(e) {
                        v = e;
                    },
                }),
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => resolve(v),
            onNegativeClick: () => resolve(null),
            onMaskClick: () => resolve(null),
            ...options,
        }),
    );
};

const menuCollapsed = ref(false);
const makeMenuOption = (to: string, label: string, icon?: string) =>
    ({
        label: () => h(RouterLink, { to }, { default: () => label }),
        key: to,
        icon: icon ? () => h(NMdi, { icon }) : undefined,
    }) as MenuOption;
const menuOptions = computed(() => {
    return [
        {
            label: '颜文字',
            key: '/emoticon',
            icon: () => h(NMdi, { icon: mdiEmoticon }),
            children: Array.from(store.emoticon.entries())
                .sort(([_k0, v0], [_k1, v1]) =>
                    v0.metadata.name.localeCompare(v1.metadata.name),
                )
                .map(([k, v]) =>
                    makeMenuOption(`/emoticon/${k}`, v.metadata.name),
                ),
        } as MenuOption,
        makeMenuOption('/editor', '编辑器', mdiPlaylistEdit),
        makeMenuOption('/config', '设置', mdiCogs),
        makeMenuOption('/about', '关于', mdiInformationOutline),
    ];
});

const menuValue = computed(() => route.path);
</script>

<style>
html {
    user-select: none;
}
.n-list .n-list-item .n-list-item__main {
    min-width: 0;
}
</style>