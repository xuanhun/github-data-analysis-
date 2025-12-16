<template>
  <select
    class="h-full px-2 bg-zinc-900 text-light text-sm rounded cursor-pointer hover:bg-zinc-800"
    :value="locale"
    @change="onChange"
  >
    <option v-for="code in locales" :key="code" :value="code">{{ code }}</option>
  </select>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { i18n, supportedLocales } from "../i18n";

const locales = supportedLocales;
const locale = computed(() => i18n.locale);
const onChange = (e: Event) => {
  const v = (e.target as HTMLSelectElement).value;
  i18n.setLocale(v);
};
</script>
