<template>
    <div style="padding:24px;padding-bottom:0">
        <n-h2 prefix="bar">
            <n-text type="primary">{{ currentEmoticon?.metadata.name }}</n-text>
        </n-h2>
        <n-flex align="center">
            <n-tooltip trigger="hover">
                <template #trigger>
                    <n-tag
                        round
                        @click="currentEmoticon?.metadata.author.url ? openUrl(currentEmoticon?.metadata.author.url) : null"
                        :style="{ cursor: currentEmoticon?.metadata.author.url ? 'pointer' : undefined }"
                    >
                        {{ currentEmoticon?.metadata.author.name }}
                        <template #avatar>
                            <n-avatar
                                v-if="currentEmoticon?.metadata.author.avatarUrl"
                                :src="currentEmoticon?.metadata.author.avatarUrl"
                            ></n-avatar>
                            <n-mdi v-else :icon="mdiAccount"></n-mdi>
                        </template>
                    </n-tag>
                </template>
                查看作者主页
            </n-tooltip>
            <n-tooltip trigger="hover">
                <template #trigger>
                    <n-button
                        tertiary circle size="small"
                        @click="chiya.dialog.create({
                            title: '详细说明',
                            content: () => currentEmoticon?.repository.information.map(e => h(NP, () => e)),
                        })"
                    >
                        <template #icon><n-mdi :icon="mdiInformation"></n-mdi></template>
                    </n-button>
                </template>
                详细说明
            </n-tooltip>
            <n-tooltip v-if="currentEmoticon?.isLocal" trigger="hover">
                <template #trigger>
                    <n-button
                        tertiary circle size="small"
                        @click="revealItemInDir(currentEmoticon?.source).catch(e => chiya.message.error(e))"
                    >
                        <template #icon><n-mdi :icon="mdiFileEyeOutline"></n-mdi></template>
                    </n-button>
                </template>
                查看原始文件
            </n-tooltip>
            <n-tooltip v-else trigger="hover">
                <template #trigger>
                    <n-button
                        tertiary circle size="small"
                        @click="writeText(currentEmoticon?.source!).then(() => chiya.message.info('已复制 URL'))"
                    >
                        <template #icon><n-mdi :icon="mdiLinkVariant"></n-mdi></template>
                    </n-button>
                </template>
                复制 URL
            </n-tooltip>
            <n-text tag="small" depth="3">{{ currentEmoticon?.repository.categories.length }} 个分组，{{ currentEmoticon?.repository.categories.reduce((a, c) => a += c.entries.length, 0) }} 个颜文字</n-text>
        </n-flex>
        <n-p>{{ currentEmoticon?.metadata.description }}</n-p>
    </div>
    <n-divider style="margin-bottom:0"></n-divider>
    <n-list
        v-for="e, i in currentEmoticon?.repository.categories"
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
        </n-list-item>
        <n-list-item
            v-for="t in e.entries"
            @click="writeText(t.emoticon).then(() => chiya.message.info(t.emoticon.includes('\n') ? '已复制' : `已复制“${t.emoticon}”`))"
        >
            <n-text
                tag="div"
                :style="{
                    whiteSpace: t.emoticon.includes('\n') ? 'nowrap' : 'pre',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                }"
            >{{ t.emoticon }}</n-text>
            <n-text depth="3" tag="small">{{ t.description }}</n-text>
            <template #suffix>
                <n-button
                    v-if="t.emoticon.includes('\n')"
                    quaternary circle
                    @click.stop="chiya.dialog.create({
                        title: t.description || '多行颜文字',
                        content: () => h(NInput, {
                            type: 'textarea',
                            readonly: true,
                            value: t.emoticon,
                            rows: t.emoticon.split('\n').length,
                            inputProps: { style: { whiteSpace: 'pre' }},
                        }),
                        negativeText: '复制',
                        onNegativeClick: () => writeText(t.emoticon).then(() => chiya.message.info('已复制')),
                    })"
                >
                    <template #icon><n-mdi :icon="mdiMagnify"></n-mdi></template>
                </n-button>
            </template>
        </n-list-item>
    </n-list>
</template>

<script setup lang="ts">
import {
    mdiAccount,
    mdiFileEyeOutline,
    mdiInformation,
    mdiLinkVariant,
    mdiMagnify,
} from '@mdi/js';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { openUrl, revealItemInDir } from '@tauri-apps/plugin-opener';
import { NInput, NP } from 'naive-ui';
import { computed, h } from 'vue';
import { useRoute } from 'vue-router';
import NMdi from '../../components/mdi.vue';
import store from '../store';

const route = useRoute();
const currentEmoticon = computed(() =>
    store.emoticon.get(route.params.key as string),
);
const chiya = window.chiya;
</script>