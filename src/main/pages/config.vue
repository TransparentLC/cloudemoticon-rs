<template>
    <n-flex align="center" style="margin-bottom:.5em">
        <n-el tag="strong" style="color:var(--primary-color);flex-grow:1">通用设置</n-el>
        <n-button @click="saveConfig">
            <template #icon><n-mdi :icon="mdiContentSave"></n-mdi></template>
            保存
        </n-button>
    </n-flex>
    <n-list bordered show-divider style="margin-bottom:1em">
        <n-list-item>
            <n-text tag="div">主题颜色</n-text>
            <template #suffix>
                <n-select
                    v-model:value="store.config.theme"
                    :options="[
                        { label: '跟随系统', value: 'auto' },
                        { label: '浅色', value: 'light' },
                        { label: '深色', value: 'dark' },
                    ]"
                    style="width:10em"
                ></n-select>
            </template>
        </n-list-item>
        <n-list-item>
            <n-text tag="div">输入模式</n-text>
            <n-text v-if="store.config.mode === 'copy-paste'" depth="3" tag="small">复制粘贴：自动将颜文字复制然后执行粘贴</n-text>
            <n-text v-if="store.config.mode === 'auto-input'" depth="3" tag="small">自动输入：不占用剪贴板，但是偶尔会出现无法正常输入的情况</n-text>
            <template #suffix>
                <n-select
                    v-model:value="store.config.mode"
                    :options="[
                        { label: '复制粘贴', value: 'copy-paste' },
                        { label: '自动输入', value: 'auto-input' },
                    ]"
                    style="width:10em"
                ></n-select>
            </template>
        </n-list-item>
        <n-list-item>
            <n-text tag="div">触发快捷键</n-text>
            <n-text depth="3" tag="small">显示/隐藏自动输入窗口，修改后将在下次启动时生效</n-text>
            <template #suffix>
                <n-input
                    v-model:value="store.config.shortcut"
                    :status="checkShortcut(store.config.shortcut) ? undefined : 'error'"
                    style="width:10em"
                ></n-input>
            </template>
        </n-list-item>
        <n-list-item>
            <n-text tag="div">订阅源自动更新频率</n-text>
            <n-text depth="3" tag="small">单位为分钟，下次自动更新：{{ formatDate(store.nextUpdateTime) }}</n-text>
            <template #suffix>
                <n-input-number
                    v-model:value="store.config.updateInterval"
                    min="1"
                    style="width:10em"
                ></n-input-number>
            </template>
        </n-list-item>
    </n-list>
    <n-flex align="center" style="margin-bottom:.5em">
        <n-el tag="strong" style="color:var(--primary-color);flex-grow:1">订阅源</n-el>
        <n-button @click="store.nextUpdateRightNowTrigger()">
            <template #icon><n-mdi :icon="mdiRefresh"></n-mdi></template>
            立即更新
        </n-button>
        <n-button @click="addSourceRemote">
            <template #icon><n-mdi :icon="mdiLinkVariant"></n-mdi></template>
            添加在线源
        </n-button>
        <n-button @click="addSourceLocal">
            <template #icon><n-mdi :icon="mdiFileDocumentOutline"></n-mdi></template>
            添加本地源
        </n-button>
    </n-flex>
    <n-list bordered show-divider style="margin-bottom:1em">
        <n-list-item v-if="!store.sources.length">
            <n-result
                title="这里空空的"
                description="请添加一个订阅源～"
            ></n-result>
        </n-list-item>
        <n-list-item v-else v-for="e, i in store.sources">
            <template #prefix>
                <n-flex align="center">
                    <n-avatar
                        v-if="store.emoticon.get(getCacheKey(e))?.metadata.author.avatarUrl"
                        round
                        size="large"
                        :src="store.emoticon.get(getCacheKey(e))?.metadata.author.avatarUrl"
                    ></n-avatar>
                    <n-avatar v-else round size="large"><n-mdi :icon="mdiAccount"></n-mdi></n-avatar>
                </n-flex>
            </template>
            <n-text
                tag="div"
                style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden"
            >{{
                store.emoticon.get(getCacheKey(e))
                    ? `${store.emoticon.get(getCacheKey(e))?.metadata.name} by ${store.emoticon.get(getCacheKey(e))?.metadata.author.name}`
                    : ''
            }}</n-text>
            <n-text
                depth="3"
                tag="small"
                underline
                style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;display:block;cursor:pointer"
                @click="writeText(e).then(() => chiya.message.info('已复制 URL'))"
            >{{ e }}</n-text>
            <template #suffix>
                <n-flex :wrap="false">
                    <n-button
                        quaternary circle
                        @click="addSource(e)"
                    >
                        <template #icon><n-mdi :icon="mdiRefresh"></n-mdi></template>
                    </n-button>
                    <n-button
                        quaternary circle
                        @click="deleteSource(i)"
                    >
                        <template #icon><n-mdi :icon="mdiClose"></n-mdi></template>
                    </n-button>
                </n-flex>
            </template>
        </n-list-item>
    </n-list>
    <n-flex align="center" style="margin-bottom:.5em">
        <n-el tag="strong" style="color:var(--primary-color);flex-grow:1">源商店</n-el>
        <n-button @click="storeListLoad">
            <template #icon><n-mdi :icon="mdiRefresh"></n-mdi></template>
            刷新
        </n-button>
        <n-button @click="
            chiya.dialog.prompt({
                title: '修改源商店仓库',
                defaultValue: store.config.storeRepository,
                placeholder: 'cloud-emoticon/store-repos',
            }).then(r => {
                if (r === null) return;
                r = r || 'cloud-emoticon/store-repos';
                if (!r.match(/^[^\s\/]+\/[^\s\/]+$/)) return chiya.message.error('请填写 GitHub 仓库名称，格式形如 owner/repo');
                store.config.storeRepository = r;
                storeListLoad();
            })
        ">
            <template #icon><n-mdi :icon="mdiStoreOutline"></n-mdi></template>
            设置仓库
        </n-button>
    </n-flex>
    <n-list bordered show-divider>
        <n-list-item v-if="storeListTotal === null">
            <n-spin style="width:100%;margin:1em 0">
                <template #description>加载中</template>
            </n-spin>
        </n-list-item>
        <n-list-item v-else-if="storeListLoaded < storeListTotal">
            <n-spin style="width:100%;margin:1em 0">
                <template #description>加载中（{{ storeListLoaded }}/{{ storeListTotal }}）</template>
            </n-spin>
        </n-list-item>
        <n-list-item v-else-if="storeListTotal === 0">
            <n-result
                title="这里空空的"
                description="这个仓库什么都没有呢……"
            ></n-result>
        </n-list-item>
        <n-list-item v-else v-for="e in storeList">
            <template #prefix>
                <n-flex align="center">
                    <n-avatar
                        v-if="e.metadata.author.avatarUrl"
                        round
                        size="large"
                        :src="e.metadata.author.avatarUrl"
                    ></n-avatar>
                    <n-avatar v-else round size="large"><n-mdi :icon="mdiAccount"></n-mdi></n-avatar>
                </n-flex>
            </template>
            <n-text
                tag="div"
                style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden"
            >{{ `${e.metadata.name} by ${e.metadata.author.name}` }}</n-text>
            <n-text
                depth="3"
                tag="small"
                underline
                style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;display:block;cursor:pointer"
                @click="writeText(e.source).then(() => chiya.message.info('已复制 URL'))"
            >{{ e.source }}</n-text>
            <template #suffix>
                <n-flex :wrap="false">
                    <n-button
                        quaternary circle
                        @click="addSource(e.source, true, true)"
                    >
                        <template #icon><n-mdi :icon="mdiPlus"></n-mdi></template>
                    </n-button>
                </n-flex>
            </template>
        </n-list-item>
    </n-list>
</template>

<script setup lang="ts">
import {
    mdiAccount,
    mdiClose,
    mdiContentSave,
    mdiFileDocumentOutline,
    mdiLinkVariant,
    mdiPlus,
    mdiRefresh,
    mdiStoreOutline,
} from '@mdi/js';
import { emit } from '@tauri-apps/api/event';
import { join } from '@tauri-apps/api/path';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { open } from '@tauri-apps/plugin-dialog';
import { remove, writeTextFile } from '@tauri-apps/plugin-fs';
import { NInput } from 'naive-ui';
import asyncPool from 'tiny-async-pool';
import { onMounted, ref } from 'vue';
import wretch from 'wretch';
import NMdi from '../../components/mdi.vue';
import { cacheEmoticon, fetchEmoticon, getCacheKey } from '../emoticon';
import { configFile, emoticonCacheDir, sourcesFile } from '../path';
import store from '../store';

const chiya = window.chiya;

const formatDate = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

// https://github.com/tauri-apps/global-hotkey/blob/dev/src/hotkey.rs
const checkShortcut = (hotkey: string) => {
    // biome-ignore format: 以下键位来自parse_hotkey，键位太多了
    const modifiers = new Set(['OPTION', 'ALT', 'CONTROL', 'CTRL', 'COMMAND', 'CMD', 'SUPER', 'SHIFT', 'COMMANDORCONTROL', 'COMMANDORCTRL', 'CMDORCTRL', 'CMDORCONTROL', 'COMMANDORCONTROL', 'COMMANDORCTRL', 'CMDORCTRL', 'CMDORCONTROL']);
    // biome-ignore format: 以下键位来自parse_key，键位太多了
    const keys = new Set(["BACKQUOTE", "`", "BACKSLASH", "\\", "BRACKETLEFT", "[", "BRACKETRIGHT", "]", "PAUSE", "PAUSEBREAK", "COMMA", ",", "DIGIT0", "0", "DIGIT1", "1", "DIGIT2", "2", "DIGIT3", "3", "DIGIT4", "4", "DIGIT5", "5", "DIGIT6", "6", "DIGIT7", "7", "DIGIT8", "8", "DIGIT9", "9", "EQUAL", "=", "KEYA", "A", "KEYB", "B", "KEYC", "C", "KEYD", "D", "KEYE", "E", "KEYF", "F", "KEYG", "G", "KEYH", "H", "KEYI", "I", "KEYJ", "J", "KEYK", "K", "KEYL", "L", "KEYM", "M", "KEYN", "N", "KEYO", "O", "KEYP", "P", "KEYQ", "Q", "KEYR", "R", "KEYS", "S", "KEYT", "T", "KEYU", "U", "KEYV", "V", "KEYW", "W", "KEYX", "X", "KEYY", "Y", "KEYZ", "Z", "MINUS", "-", "PERIOD", ".", "QUOTE", "'", "SEMICOLON", ";", "SLASH", "/", "BACKSPACE", "CAPSLOCK", "ENTER", "SPACE", "TAB", "DELETE", "END", "HOME", "INSERT", "PAGEDOWN", "PAGEUP", "PRINTSCREEN", "SCROLLLOCK", "ARROWDOWN", "DOWN", "ARROWLEFT", "LEFT", "ARROWRIGHT", "RIGHT", "ARROWUP", "UP", "NUMLOCK", "NUMPAD0", "NUM0", "NUMPAD1", "NUM1", "NUMPAD2", "NUM2", "NUMPAD3", "NUM3", "NUMPAD4", "NUM4", "NUMPAD5", "NUM5", "NUMPAD6", "NUM6", "NUMPAD7", "NUM7", "NUMPAD8", "NUM8", "NUMPAD9", "NUM9", "NUMPADADD", "NUMADD", "NUMPADPLUS", "NUMPLUS", "NUMPADDECIMAL", "NUMDECIMAL", "NUMPADDIVIDE", "NUMDIVIDE", "NUMPADENTER", "NUMENTER", "NUMPADEQUAL", "NUMEQUAL", "NUMPADMULTIPLY", "NUMMULTIPLY", "NUMPADSUBTRACT", "NUMSUBTRACT", "ESCAPE", "ESC", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "AUDIOVOLUMEDOWN", "VOLUMEDOWN", "AUDIOVOLUMEUP", "VOLUMEUP", "AUDIOVOLUMEMUTE", "VOLUMEMUTE", "MEDIAPLAY", "MEDIAPAUSE", "MEDIAPLAYPAUSE", "MEDIASTOP", "MEDIATRACKNEXT", "MEDIATRACKPREV", "MEDIATRACKPREVIOUS", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24"]);

    const tokens = hotkey.toUpperCase().split('+');
    if (tokens.length === 1) return keys.has(tokens[0]);
    let key: string | undefined;
    for (const token of tokens) {
        if (!token || key) return false;
        if (!modifiers.has(token)) {
            if (keys.has(token)) {
                key = token;
            } else {
                return false;
            }
        }
    }
    return true;
};

const saveConfig = async () => {
    if (!checkShortcut(store.config.shortcut)) {
        return window.chiya.message.error('触发快捷键无效');
    }
    await writeTextFile(configFile, JSON.stringify(store.config, null, 4));
    window.chiya.message.success('保存成功');
};

const addSource = async (
    source: string,
    checkDuplicate: boolean = false,
    writeSources: boolean = false,
) => {
    if (checkDuplicate && store.sources.includes(source)) {
        return window.chiya.message.warning('这个源已经添加过了');
    }
    try {
        const cacheKey = getCacheKey(source);
        const emoticon = await fetchEmoticon(source);
        if (!store.sources.includes(source)) store.sources.push(source);
        store.emoticon.set(cacheKey, emoticon);
        await emit('update-emoticon', { key: cacheKey, value: emoticon });
        await cacheEmoticon(emoticon);
        if (writeSources) {
            await writeTextFile(
                sourcesFile,
                JSON.stringify(store.sources, null, 4),
            );
            window.chiya.message.success(`已添加“${emoticon.metadata.name}”`);
        } else {
            window.chiya.message.success(`已更新“${emoticon.metadata.name}”`);
        }
    } catch (e) {
        window.chiya.message.error((e as Error).toString());
    }
};

const addSourceLocal = async () => {
    const source = await open({
        directory: false,
        multiple: false,
        filters: [{ extensions: ['meta.json'], name: 'Emoticon metadata' }],
    });
    if (!source) return;
    await addSource(source, true, true);
};

const addSourceRemote = async () => {
    const source = await window.chiya.dialog.prompt({
        title: '添加在线源',
        placeholder: '输入源的 URL',
    });
    if (source === null) return;
    if (URL.canParse(source) && source.match(/^https?:\/\//)) {
        await addSource(source, true, true);
    } else if (source) {
        window.chiya.message.error('不是有效的在线源 URL');
    }
};

const deleteSource = async (sourceIndex: number) => {
    const source = store.sources[sourceIndex];
    const cacheKey = getCacheKey(source);
    const name = store.emoticon.get(cacheKey)?.metadata.name || source;
    if (
        !(await window.chiya.dialog.confirm({
            title: '删除源',
            content: `是否要删除“${name}”？`,
        }))
    )
        return;
    store.sources.splice(sourceIndex, 1);
    store.emoticon.delete(cacheKey);
    await emit('update-emoticon', { key: cacheKey, value: null });
    await remove(await join(emoticonCacheDir, `${cacheKey}.meta.json`)).catch(
        () => {},
    );
    await remove(await join(emoticonCacheDir, `${cacheKey}.json`)).catch(
        () => {},
    );
    await writeTextFile(sourcesFile, JSON.stringify(store.sources, null, 4));
    window.chiya.message.success(`已删除“${name}”`);
};

const storeListLoaded = ref(0);
const storeListTotal = ref<number | null>(null);
const storeList = ref<{ source: string; metadata: EmoticonMetadata }[]>([]);
const storeListLoad = async () => {
    storeListLoaded.value = 0;
    storeList.value.length = 0;
    if (!store.config.storeRepository) {
        storeListTotal.value = 0;
        return;
    } else {
        storeListTotal.value = null;
    }
    try {
        const repoContents = await wretch(
            `https://api.github.com/repos/${store.config.storeRepository}/contents/`,
        )
            .get()
            .json<
                { name: string; download_url: string; type: 'file' | 'dir' }[]
            >()
            .then(r =>
                r.filter(
                    e => e.type === 'file' && e.name.match(/\.meta\.json$/i),
                ),
            );
        storeListTotal.value = repoContents.length;
        for await (const [source, metadata] of asyncPool(
            4,
            repoContents,
            (repoContent: {
                name: string;
                download_url: string;
            }): Promise<[string, EmoticonMetadata]> =>
                wretch(repoContent.download_url)
                    .get()
                    .json<EmoticonMetadata>()
                    .then(metadata => [repoContent.download_url, metadata]),
        )) {
            storeList.value.push({ source, metadata });
            storeListLoaded.value++;
        }
        storeList.value = storeList.value.sort((a, b) =>
            a.metadata.name.localeCompare(b.metadata.name),
        );
    } catch (e) {
        window.chiya.message.error((e as Error).toString());
    }
};
onMounted(storeListLoad);
</script>