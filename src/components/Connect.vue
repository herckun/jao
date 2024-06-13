<script setup lang="ts">
import { createWeb3Modal } from "@web3modal/wagmi";

import { connected } from "../stores/connected";
import { useStore } from "@nanostores/vue";

import {
  reconnect,
  http,
  createConfig,
  getAccount,
  watchAccount,
} from "@wagmi/core";

import { config, projectId, metadata } from "../server/lib/wagmi/config";
import { onMounted, onRenderTriggered } from "vue";

const $connected = useStore(connected);

reconnect(config);
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});
onMounted(() => {
  reconnect(config);
  const unwatch = watchAccount(config, {
    onChange(data) {
      let address = data.address?.toString();
      if ($connected.value.address == address) {
        return;
      }
      connected.set({
        address: data.address?.toString() ?? "",
      });
    },
  });
});
</script>

<template>
  <div class="mx-auto w-fit">
    <w3m-button />
  </div>
</template>
