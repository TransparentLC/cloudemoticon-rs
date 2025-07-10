<template>
    <n-flex style="height:calc(100vh - 96px);padding:24px" justify="center" align="center" vertical>
        <n-result
            :title="`云颜文字 v${version}`"
            description="在云中找到你所爱的颜文字"
            style="margin:12px"
        >
            <template #icon>
                <n-image
                    width="96"
                    height="96"
                    :src="icon"
                    class="logo-icon"
                    preview-disabled
                ></n-image>
            </template>
            <template #footer>
                <n-popover trigger="hover">
                    <template #trigger>
                        <n-button @click="openUrl('https://github.com/TransparentLC/cloudemoticon-rs')">
                            <template #icon><n-mdi :icon="mdiGithub"></n-mdi></template>
                            GitHub 仓库
                        </n-button>
                    </template>
                    <n-image
                        src="https://img.shields.io/github/stars/TransparentLC/cloudemoticon-rs?style=social"
                        preview-disabled
                    ></n-image>
                </n-popover>
            </template>
        </n-result>
        <div>
            <n-p>从本地或者在线的源加载颜文字，将它们在分类的列表中展示出来，然后一键输入或复制。</n-p>
            <n-p>这样你就不需要手动折腾输入法，也不需要使用不能一键复制或不能自定义颜文字的其它 APP。</n-p>
            <n-p>本家：<n-a href="#" @click="openUrl('https://github.com/cloud-emoticon')">https://github.com/cloud-emoticon</n-a></n-p>
            <n-p>
                作者：
                <n-tag
                    round
                    @click="openUrl('https://github.com/TransparentLC')"
                    style="cursor:pointer;vertical-align:middle"
                >
                    ✨小透明・宸✨
                    <template #avatar>
                        <n-avatar src="https://avatars.githubusercontent.com/u/47057319?v=4"></n-avatar>
                    </template>
                </n-tag>
            </n-p>
        </div>
    </n-flex>
</template>

<script setup lang="ts">
import { mdiGithub } from '@mdi/js';
import { getVersion } from '@tauri-apps/api/app';
import { openUrl } from '@tauri-apps/plugin-opener';
import { onMounted, ref } from 'vue';
import icon from '../../assets/icon.svg';
import NMdi from '../../components/mdi.vue';

const version = ref('');

onMounted(() =>
    getVersion().then(r => {
        version.value = r;
    }),
);
</script>

<style>
.logo-icon {
    box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);
    border-radius: 18px;
    transition: box-shadow .5s cubic-bezier(.4,0,.2,1);
    will-change: box-shadow;
}
.logo-icon:hover {
    box-shadow: 0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);
}
</style>