<template>
  <div
    class="bg-affair-950 rounded-xl h-[5.5rem] grid grid-cols-8 gap-1 place-content-center p-2 shrink-0 row-span-1 w-full col-span-1 overflow-hidden"
  >
    <div
      class="col-span-1 w-full h-full flex place-content-center place-items-center"
    >
      <div v-if="refreshing" class="skeleton rounded-full w-12 h-12"></div>
      <img
        v-else
        :alt="data.token.name + '-icon'"
        class="w-9 object-cover"
        :src="data.token.iconURI"
      />
    </div>
    <div class="col-span-4 flex flex-col gap-1 p-2 place-content-center">
      <span
        class="flex place-items-center gap-1 font-bold text-sm text-white align-middle"
      >
        <div v-if="refreshing" class="skeleton w-6 h-4"></div>
        <span v-else>{{ data.token.name }}</span>
      </span>
      <span class="text-xs text-secondary flex place-items-center gap-1">
        <div v-if="refreshing" class="skeleton rounded-full w-4 h-4"></div>
        <img
          v-else
          :alt="data.chain.id + '-icon'"
          class="w-4 object-cover"
          :src="data.chain.iconURI"
        />
        <div v-if="refreshing" class="skeleton w-6 h-4"></div>
        <span v-else :class="{ 'blur-sm': $censored }">
          {{
            new Intl.NumberFormat("en-EN", {
              maximumSignificantDigits: 4,
            }).format(data.balance)
          }}
        </span>
        <div v-if="refreshing" class="skeleton w-6 h-4"></div>
        <span v-else class="text-base-content/50 text-xs">{{
          "@ $" +
          new Intl.NumberFormat("en-EN", {
            maximumSignificantDigits: 2,
          }).format(data.token.unitPrice)
        }}</span>
      </span>
    </div>

    <div
      class="col-span-3 flex h-fit flex-col gap-0 place-content-end place-items-end w-full text-ellipsis overflow-hidden rounded-md text-zinc-200 font-semibold text-base"
    >
      <div v-if="refreshing" class="skeleton w-20 h-6"></div>
      <span v-else :class="{ 'blur-sm': $censored }">
        {{
          new Intl.NumberFormat("en-EN", {
            maximumSignificantDigits: 8,
            style: "currency",
            currency: "USD",
          }).format(data.token.totalValue)
        }}
      </span>
      <div v-if="refreshing" class="skeleton w-12 h-6 mt-1"></div>
      <div v-else>
        <span
          v-if="data.token.dayPriceChange < 0"
          class="text-red-400 align-middle flex flex-wrap gap-0 place-content-end place-items-center text-xs font-normal"
        >
          <span class="w-full h-fit text-right">{{
            new Intl.NumberFormat("en-EN", {
              maximumSignificantDigits: 3,
              style: "currency",
              currency: "USD",
            }).format(pnl)
          }}</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="w-4 h-4 inline-block align-middle"
          >
            <path
              fill-rule="evenodd"
              d="M1.22 4.22a.75.75 0 0 1 1.06 0L6 7.94l2.761-2.762a.75.75 0 0 1 1.158.12 24.9 24.9 0 0 1 2.718 5.556l.729-1.261a.75.75 0 0 1 1.299.75l-1.591 2.755a.75.75 0 0 1-1.025.275l-2.756-1.591a.75.75 0 1 1 .75-1.3l1.097.634a23.417 23.417 0 0 0-1.984-4.211L6.53 9.53a.75.75 0 0 1-1.06 0L1.22 5.28a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
          <span :class="{ 'blur-sm': $censored }"
            >{{ data.token.dayPriceChange }}%</span
          >
        </span>
        <span
          v-else
          class="text-affair-200 align-middle flex flex-wrap gap-1 place-content-end place-items-center text-xs font-normal"
        >
          <span class="w-full text-right"
            >+{{
              new Intl.NumberFormat("en-EN", {
                maximumSignificantDigits: 3,
                style: "currency",
                currency: "USD",
              }).format(pnl)
            }}</span
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="w-4 h-4 inline-block align-middle"
          >
            <path
              fill-rule="evenodd"
              d="M9.808 4.057a.75.75 0 0 1 .92-.527l3.116.849a.75.75 0 0 1 .528.915l-.823 3.121a.75.75 0 0 1-1.45-.382l.337-1.281a23.484 23.484 0 0 0-3.609 3.056.75.75 0 0 1-1.07.01L6 8.06l-3.72 3.72a.75.75 0 1 1-1.06-1.061l4.25-4.25a.75.75 0 0 1 1.06 0l1.756 1.755a25.015 25.015 0 0 1 3.508-2.85l-1.46-.398a.75.75 0 0 1-.526-.92Z"
              clip-rule="evenodd"
            />
          </svg>
          <span :class="{ 'blur-sm': $censored }"
            >{{ data.token.dayPriceChange }}%</span
          >
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { censored } from "../stores/censored";
import { useStore } from "@nanostores/vue";
import { computed } from "vue";

const props = defineProps({
  data: Object,
  refreshing: Boolean,
});

const $censored = useStore(censored);

const pnl = computed(() => {
  let data = props.data;
  let p = Math.abs(data.token.dayPriceChange) / 100;
  let oldValue =
    data.token.dayPriceChange < 0
      ? data.balance * (data.token.unitPrice - p * data.token.unitPrice)
      : data.balance * (data.token.unitPrice + p * data.token.unitPrice);
  return oldValue - data.token.totalValue;
});
</script>
