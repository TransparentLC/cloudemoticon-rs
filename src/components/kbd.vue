<template>
    <n-el tag="span">
        <template v-for="e, i in Array.isArray(keys) ? keys : [keys]">
            <template v-if="i">&nbsp;+&nbsp;</template>
            <kbd :class="{ dark }">{{ e }}</kbd>
        </template>
    </n-el>
</template>

<script setup lang="ts">
defineProps<{
    keys: string | string[];
    dark?: boolean;
}>();
</script>

<style>
/* https://github.com/auth0/kbd */

kbd {
    font-family: var(--font-family-mono);
    display: inline-block;
    border-radius: 3px;
    padding: 0px 4px;
    box-shadow: 1px 1px 1px #777, 0px 0px 0px #ddd inset;
    font-size: smaller;
    vertical-align: text-bottom;
    background-color: #eee;
    font-weight: 500;
    color: #555;
    cursor: pointer;
    font-weight: 600;
    user-select: none;
    transition: background-color .25s ease-in-out, color .1s ease-in-out, box-shadow .05s ease-in-out;
}
kbd:hover {
    color: black;
}
kbd:active {
    color: black;
    box-shadow: 0px 0px 0px #777, 1px 1px 0px #ddd inset;
}

kbd.dark {
    background-color: #333;
    color: #ddd;
}
kbd.dark:hover {
    color: #fff;
}
</style>