<script setup lang="ts">
import { connected } from "../stores/connected";
import { useStore } from "@nanostores/vue";

import { onMounted, onRenderTriggered } from "vue";

const $connected = useStore(connected);

onMounted(() => {
  if (
    $connected.value.address == null &&
    localStorage.getItem("connected-address") != null
  ) {
    connected.set({
      address: localStorage.getItem("connected-address"),
    });
  }
  if ($connected.value.address != null) {
    localStorage.setItem("connected-address", $connected.value.address);
  }
});

const updateAddress = (address: string) => {
  address = address.toLowerCase();
  if (!isValidAddressKinda(address)) {
    return;
  }
  connected.set({
    address: address ?? "",
  });
  if ($connected.value.address) {
    localStorage.setItem("connected-address", $connected.value.address);
  }
};
const isValidAddressKinda = (address: string) => {
  return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
};
</script>

<template>
  <div class="mx-auto w-fit">
    <input
      class="bg-transparent border border-base-100 text-center focus:border-primary/20 transition-all text-primary rounded-xl py-2 px-9 text-xs outline-none w-fit"
      type="text"
      placeholder="0x..."
      :value="$connected.address"
      @input=" (event: any) =>
      updateAddress(event.target.value)"
    />
  </div>
</template>
