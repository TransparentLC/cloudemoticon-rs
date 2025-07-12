<template>
    <n-tabs
        type="line"
        animated
        style="min-height:100vh;padding-top:24px"
        pane-wrapper-style="flex-grow:1;position:relative"
        pane-style="position:absolute;height:100%"
    >
        <template #prefix>
            <div style="padding-left:12px"></div>
        </template>
        <template #suffix>
            <n-flex style="padding-right:24px">
                <n-button @click="resetEditor">
                    <template #icon><n-mdi :icon="mdiFileOutline"></n-mdi></template>
                    新建
                </n-button>
                <n-button @click="openEmoticon">
                    <template #icon><n-mdi :icon="mdiFileDocumentOutline"></n-mdi></template>
                    打开
                </n-button>
                <n-button @click="exportEmoticon">
                    <template #icon><n-mdi :icon="mdiContentSaveOutline"></n-mdi></template>
                    保存
                </n-button>
            </n-flex>
        </template>
        <n-tab-pane name="metadata" tab="基本信息">
            <n-form
                label-placement="left"
                label-width="auto"
                require-mark-placement="right-hanging"
                style="padding-left:24px;padding-right:24px"
            >
                <n-form-item
                    label="订阅源名称"
                    :rule="{ required: true, trigger: ['blur', 'input'], message: '' }"
                >
                    <n-input clearable v-model:value="edittingEmoticonMetadata.name"></n-input>
                </n-form-item>
                <n-form-item
                    label="订阅源简介"
                    :rule="{ required: false }"
                >
                    <n-input clearable v-model:value="edittingEmoticonMetadata.description"></n-input>
                </n-form-item>
                <n-form-item
                    label="作者名称"
                    :rule="{ required: true, trigger: ['blur', 'input'], message: '' }"
                >
                    <n-input clearable v-model:value="edittingEmoticonMetadata.author.name"></n-input>
                </n-form-item>
                <n-form-item
                    label="作者头像链接"
                    :rule="{ required: false }"
                >
                    <n-input v-model:value="edittingEmoticonMetadata.author.avatarUrl">
                        <template #suffix>
                            <n-avatar
                                v-if="edittingEmoticonMetadata.author.avatarUrl?.match(/^https?:\/\//)"
                                round
                                :size="24"
                                :src="edittingEmoticonMetadata.author.avatarUrl"
                            ></n-avatar>
                        </template>
                    </n-input>
                </n-form-item>
                <n-form-item
                    label="作者主页"
                    :rule="{ required: false }"
                >
                    <n-input clearable v-model:value="edittingEmoticonMetadata.author.url"></n-input>
                </n-form-item>
                <n-form-item
                    label="详细说明"
                    :rule="{ required: false }"
                >
                    <n-input
                        v-model:value="edittingEmoticonRepositoryInfo"
                        type="textarea"
                        rows="5"
                        clearable
                    ></n-input>
                </n-form-item>
            </n-form>
        </n-tab-pane>
        <n-tab-pane name="emoticon" tab="颜文字">
            <n-split
                direction="horizontal"
                :resize-trigger-size="2"
                style="height:100%;margin-top:-12px"
                :min="1 / 3" :max="2 / 3"
                pane1-style="overflow-y:auto;padding-top:12px"
                pane2-style="padding-top:12px"
            >
                <template #1>
                    <n-scrollbar>
                        <n-list
                            v-for="e, i in edittingEmoticonRepository.categories"
                            hoverable clickable
                        >
                            <n-divider v-if="i" style="margin:0"></n-divider>
                            <n-list-item style="background-color:unset;cursor:unset">
                                <n-text
                                    strong
                                    type="primary"
                                    tag="div"
                                    style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden"
                                >{{ e.name }}</n-text>
                                <template #suffix>
                                    <n-flex :wrap="false" :size="0">
                                        <n-tooltip trigger="hover">
                                            <template #trigger>
                                                <n-button
                                                    quaternary circle size="tiny" type="primary"
                                                    @click="chiya.dialog.prompt({
                                                        title: '修改分组名称',
                                                        defaultValue: e.name,
                                                    }).then(r => e.name = r || e.name)"
                                                >
                                                    <template #icon><n-mdi :icon="mdiRename"></n-mdi></template>
                                                </n-button>
                                            </template>
                                            修改分组名称
                                        </n-tooltip>
                                        <n-tooltip trigger="hover">
                                            <template #trigger>
                                                <n-button
                                                    quaternary circle size="tiny" type="primary"
                                                    @click="e.entries.push({ emoticon: '', description: '' })"
                                                >
                                                    <template #icon><n-mdi :icon="mdiPlus"></n-mdi></template>
                                                </n-button>
                                            </template>
                                            添加颜文字
                                        </n-tooltip>
                                        <n-tooltip trigger="hover">
                                            <template #trigger>
                                                <n-button
                                                    quaternary circle size="tiny" type="primary"
                                                    :disabled="i <= 0"
                                                    @click.stop="[edittingEmoticonRepository.categories[i], edittingEmoticonRepository.categories[i - 1]] = [edittingEmoticonRepository.categories[i - 1], edittingEmoticonRepository.categories[i]]"
                                                >
                                                    <template #icon><n-mdi :icon="mdiArrowUp"></n-mdi></template>
                                                </n-button>
                                            </template>
                                            上移
                                        </n-tooltip>
                                        <n-tooltip trigger="hover">
                                            <template #trigger>
                                                <n-button
                                                    quaternary circle size="tiny" type="primary"
                                                    :disabled="i >= edittingEmoticonRepository.categories.length - 1"
                                                    @click.stop="[edittingEmoticonRepository.categories[i], edittingEmoticonRepository.categories[i + 1]] = [edittingEmoticonRepository.categories[i + 1], edittingEmoticonRepository.categories[i]]"
                                                >
                                                    <template #icon><n-mdi :icon="mdiArrowDown"></n-mdi></template>
                                                </n-button>
                                            </template>
                                            下移
                                        </n-tooltip>
                                        <n-tooltip trigger="hover">
                                            <template #trigger>
                                                <n-button
                                                    quaternary circle size="tiny" type="primary"
                                                    @click="chiya.dialog.confirm({
                                                        title: '删除分组',
                                                        content: `是否要删除分组“${e.name}”？`
                                                    }).then(r => r && edittingEmoticonRepository.categories.splice(i, 1))"
                                                >
                                                    <template #icon><n-mdi :icon="mdiClose"></n-mdi></template>
                                                </n-button>
                                            </template>
                                            删除分组
                                        </n-tooltip>
                                    </n-flex>
                                </template>
                            </n-list-item>
                            <n-list-item
                                v-for="t, j in e.entries"
                                @click="edittingEmoticonEntry = t"
                            >
                                <n-text
                                    tag="div"
                                    style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden"
                                    :depth="t.emoticon ? undefined : 3"
                                    :italic="!t.emoticon"
                                >{{ t.emoticon || '（空的颜文字）' }}</n-text>
                                <n-text depth="3" tag="small">{{ t.description }}</n-text>
                                <template #suffix>
                                    <n-flex :wrap="false" :size="0">
                                        <n-tooltip trigger="hover">
                                            <template #trigger>
                                                <n-button
                                                    quaternary circle size="tiny"
                                                    :disabled="j <= 0"
                                                    @click.stop="[e.entries[j], e.entries[j - 1]] = [e.entries[j - 1], e.entries[j]]"
                                                >
                                                    <template #icon><n-mdi :icon="mdiArrowUp"></n-mdi></template>
                                                </n-button>
                                            </template>
                                            上移
                                        </n-tooltip>
                                        <n-tooltip trigger="hover">
                                            <template #trigger>
                                                <n-button
                                                    quaternary circle size="tiny"
                                                    :disabled="j >= e.entries.length - 1"
                                                    @click.stop="[e.entries[j], e.entries[j + 1]] = [e.entries[j + 1], e.entries[j]]"
                                                >
                                                    <template #icon><n-mdi :icon="mdiArrowDown"></n-mdi></template>
                                                </n-button>
                                            </template>
                                            下移
                                        </n-tooltip>
                                        <n-tooltip trigger="hover">
                                            <template #trigger>
                                                <n-button
                                                    quaternary circle size="tiny"
                                                    @click.stop="e.entries.splice(j, 1)"
                                                >
                                                    <template #icon><n-mdi :icon="mdiClose"></n-mdi></template>
                                                </n-button>
                                            </template>
                                            删除颜文字
                                        </n-tooltip>
                                    </n-flex>
                                </template>
                            </n-list-item>
                        </n-list>
                        <div style="padding:24px;padding-top:12px">
                            <n-button
                                type="primary" block secondary
                                @click="edittingEmoticonRepository.categories.push({ name: '（新的分组）', entries: [] })"
                            >
                                <template #icon><n-mdi :icon="mdiPlus"></n-mdi></template>
                                添加分组
                            </n-button>
                        </div>
                    </n-scrollbar>
                </template>
                <template #2>
                    <n-flex vertical style="height:100%;padding-left:24px;padding-right:24px">
                        <n-form-item label="颜文字" style="flex-grow:1">
                            <n-input
                                type="textarea"
                                style="height:100%"
                                :input-props="{ style: { whiteSpace: 'pre' }}"
                                v-model:value="edittingEmoticonEntry.emoticon"
                            ></n-input>
                        </n-form-item>
                        <n-form-item label="描述（可选）">
                            <n-input
                                clearable
                                v-model:value="edittingEmoticonEntry.description"
                            ></n-input>
                        </n-form-item>
                    </n-flex>
                </template>
            </n-split>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import {
    mdiArrowDown,
    mdiArrowUp,
    mdiClose,
    mdiContentSaveOutline,
    mdiFileDocumentOutline,
    mdiFileOutline,
    mdiPlus,
    mdiRename,
} from '@mdi/js';
import { open, save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { reactive, ref, watch } from 'vue';
import NMdi from '../../components/mdi.vue';
import { fetchEmoticon } from '../emoticon';

const chiya = window.chiya;

const emptyEmoticonMetadata: EmoticonMetadata = {
    $schema:
        'https://github.com/cloud-emoticon/store-repos/raw/master/schema/RepositoryMetadata.json',
    name: '',
    location: { type: 'localJson' },
    description: '',
    author: {
        name: '',
        url: undefined,
        avatarUrl: undefined,
    },
};
const emptyEmoticonRepository: EmoticonRepository = {
    $schema:
        'https://github.com/cloud-emoticon/store-repos/raw/master/schema/JsonRepository.json',
    information: [],
    categories: [],
};

const edittingEmoticonMetadata = reactive<EmoticonMetadata>(
    structuredClone(emptyEmoticonMetadata),
);
const edittingEmoticonRepository = reactive<EmoticonRepository>(
    structuredClone(emptyEmoticonRepository),
);
const edittingEmoticonRepositoryInfo = ref('');
watch(edittingEmoticonRepositoryInfo, () => {
    edittingEmoticonRepository.information =
        edittingEmoticonRepositoryInfo.value.split('\n').filter(e => e.trim());
});
const edittingEmoticonEntry = ref<
    EmoticonRepository['categories'][number]['entries'][number]
>({
    description: '',
    emoticon: '',
});

const resetEditor = async () => {
    if (
        !(await new Promise(resolve =>
            chiya.dialog.create({
                title: '确认',
                content: '编辑器的所有内容都会被清除，是否继续？',
                positiveText: '确认',
                negativeText: '取消',
                onPositiveClick: () => resolve(true),
                onNegativeClick: () => resolve(false),
                onMaskClick: () => resolve(false),
            }),
        ))
    )
        return;

    Object.assign(
        edittingEmoticonMetadata,
        structuredClone(emptyEmoticonMetadata),
    );
    Object.assign(
        edittingEmoticonRepository,
        structuredClone(emptyEmoticonRepository),
    );
    edittingEmoticonRepositoryInfo.value = '';
};

const openEmoticon = async () => {
    const source = await open({
        directory: false,
        multiple: false,
        filters: [{ extensions: ['meta.json'], name: 'Emoticon metadata' }],
    });
    if (!source) return;
    const { metadata, repository } = await fetchEmoticon(source);
    Object.assign(edittingEmoticonMetadata, metadata, {
        location: { type: 'localJson' },
    });
    Object.assign(edittingEmoticonRepository, repository);
    edittingEmoticonRepositoryInfo.value = repository.information.join('\n');
};

const exportEmoticon = async () => {
    if (!edittingEmoticonMetadata.name)
        return chiya.message.warning('订阅源名称不能为空');
    if (!edittingEmoticonMetadata.author.name)
        return chiya.message.warning('作者名称不能为空');
    if (edittingEmoticonMetadata.author.url) {
        if (!edittingEmoticonMetadata.author.url.match(/^https?:\/\//))
            return chiya.message.warning('作者主页不是有效的 URL');
    }
    if (edittingEmoticonMetadata.author.avatarUrl) {
        if (!edittingEmoticonMetadata.author.avatarUrl.match(/^https?:\/\//))
            return chiya.message.warning('作者头像链接不是有效的 URL');
    }
    const source = await save({
        filters: [{ extensions: ['meta.json'], name: 'Emoticon metadata' }],
    });
    if (!source) return;
    await writeTextFile(source, JSON.stringify(edittingEmoticonMetadata));
    await writeTextFile(
        source.replace(/\.meta\.json$/i, '.json'),
        JSON.stringify(edittingEmoticonRepository),
    );
    chiya.message.success('保存成功');
};
</script>