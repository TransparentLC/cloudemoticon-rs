<template>
    <n-icon
        :color="color"
        :depth="depth"
        :size="size"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path :d="icon"></path>
        </svg>
    </n-icon>
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui';

type NIconProps = InstanceType<typeof NIcon>['$props'];

defineProps<{
    icon: string;
    color?: NIconProps['color'];
    depth?: NIconProps['depth'];
    size?: NIconProps['size'];
}>();
</script>
