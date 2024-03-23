<template>
  <aside
    class="bg-zinc-950 text-white p-6 rounded-lg w-full max-w-md font-mono mt-2"
  >
    <div class="flex justify-between items-center">
      <div class="flex space-x-2 text-red-500">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <p class="text-sm">bash</p>
    </div>
    <div class="mt-4">
      <p class="text-green-400">$ {{ command }}</p>
      <p class="text-white">{{ res }}</p>
    </div>
  </aside>
</template>

<script lang="ts" setup>
const props = defineProps({
  command: String,
  res: String,
});
</script>

<style></style>
