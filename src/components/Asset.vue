<template>
  <div
    class="bg-gradient-to-r from-base-200 to-base-100 border-0 border-r border-b border-zinc-700/50 shadow-zinc-700/30 shadow-md rounded-md h-[5.5rem] grid grid-cols-8 gap-1 place-content-center place-items-center p-2 shrink-0 row-span-1 w-full col-span-1 overflow-hidden"
    :class="{ 'col-span-full': fill }"
  >
    <div
      class="col-span-2 sm:col-span-1 w-full h-full flex place-content-center place-items-center p-px xl:p-2"
    >
      <div v-if="refreshing" class="skeleton rounded-full w-12 h-12"></div>
      <img
        v-else
        :alt="data.token.name + '-icon'"
        class="w-12 shrink-0 object-cover"
        :src="data.token.iconURI"
      />
    </div>
    <div
      class="col-span-3 sm:col-span-4 flex flex-col gap-1 p-2 place-items-start place-content-center w-full h-full"
    >
      <span
        class="flex place-items-center gap-1 font-bold text-sm text-white align-middle"
      >
        <div v-if="refreshing" class="skeleton w-6 h-4"></div>
        <span v-else>{{ data.token.name }}</span>
      </span>
      <span
        class="text-xs text-primary flex flex-col md:flex-row place-content-start place-items-start gap-1 w-full text-nowrap"
      >
        <div class="flex place-items-start gap-1">
          <div v-if="refreshing" class="skeleton rounded-full w-4 h-4"></div>
          <img
            v-else
            :alt="data.chain.id + '-icon'"
            class="w-4 object-cover"
            :src="data.chain.iconURI"
          />
          <div v-if="refreshing" class="skeleton w-6 h-4"></div>
          <span
            v-else
            class="w-9 md:w-fit text-ellipsis overflow-hidden"
            :class="{ 'blur-sm': $censored }"
          >
            {{
              new Intl.NumberFormat("en-EN", {
                maximumSignificantDigits: 4,
              }).format(data.balance)
            }}
          </span>
        </div>
        <div v-if="refreshing" class="skeleton w-6 h-4"></div>
        <span
          v-else
          class="text-base-content/50 w-9 md:w-fit text-xs text-nowrap text-ellipsis overflow-hidden"
          >{{
            "$" +
            new Intl.NumberFormat("en-EN", {
              maximumSignificantDigits: 2,
            }).format(data.token.unitPrice)
          }}</span
        >
      </span>
    </div>

    <div
      class="col-span-3 sm:col-span-3 flex h-fit flex-col gap-0 place-content-end place-items-end w-full text-ellipsis px-2"
    >
      <div v-if="refreshing" class="skeleton w-20 h-6"></div>
      <span
        class="font-bold text-sm text-white md:text-lg"
        v-else
        :class="{ 'blur-sm': $censored }"
      >
        {{
          new Intl.NumberFormat("en-EN", {
            maximumSignificantDigits: 3,
            style: "currency",
            currency: "USD",
          }).format(data.token.totalValue)
        }}
      </span>
      <div v-if="refreshing" class="skeleton w-12 h-6 mt-1"></div>
      <div v-else>
        <span
          class="align-middle flex flex-col gap-0 place-content-end place-items-center text-xs"
          :class="{
            'text-affair-300': data.token.price_change[$timeframe] > 0,
            'text-red-400': data.token.price_change[$timeframe] < 0,
            'hidden  ':
              data.token.price_change[$timeframe] == 0 ||
              data.token.price_change[$timeframe] == null,
          }"
        >
          <span
            class="w-full h-fit text-right"
            :class="{
              'glowing-text': data.token.price_change[$timeframe] > 0,
              '': data.token.price_change[$timeframe] < 0,
            }"
          >
            <span v-if="data.token.price_change[$timeframe] < 0">-</span>
            <span v-else>+</span>

            <span>
              {{
                new Intl.NumberFormat("en-EN", {
                  maximumSignificantDigits: 3,
                  style: "currency",
                  currency: "USD",
                }).format(pnl)
              }}
            </span>
          </span>
          <span>
            <svg
              v-if="data.token.price_change[$timeframe] < 0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="w-4 h-4 align-middle hidden sm:inline-block"
            >
              <path
                fill-rule="evenodd"
                d="M1.22 4.22a.75.75 0 0 1 1.06 0L6 7.94l2.761-2.762a.75.75 0 0 1 1.158.12 24.9 24.9 0 0 1 2.718 5.556l.729-1.261a.75.75 0 0 1 1.299.75l-1.591 2.755a.75.75 0 0 1-1.025.275l-2.756-1.591a.75.75 0 1 1 .75-1.3l1.097.634a23.417 23.417 0 0 0-1.984-4.211L6.53 9.53a.75.75 0 0 1-1.06 0L1.22 5.28a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="w-4 h-4 align-middle hidden sm:inline-block"
            >
              <path
                fill-rule="evenodd"
                d="M9.808 4.057a.75.75 0 0 1 .92-.527l3.116.849a.75.75 0 0 1 .528.915l-.823 3.121a.75.75 0 0 1-1.45-.382l.337-1.281a23.484 23.484 0 0 0-3.609 3.056.75.75 0 0 1-1.07.01L6 8.06l-3.72 3.72a.75.75 0 1 1-1.06-1.061l4.25-4.25a.75.75 0 0 1 1.06 0l1.756 1.755a25.015 25.015 0 0 1 3.508-2.85l-1.46-.398a.75.75 0 0 1-.526-.92Z"
                clip-rule="evenodd"
              />
            </svg>
            <span :class="{ 'blur-sm': $censored }"
              >{{
                new Intl.NumberFormat("en-EN", {
                  maximumSignificantDigits: 2,
                  roundingPriority: "morePrecision",
                  roundingMode: "floor",
                }).format(data.token.price_change[$timeframe])
              }}%
            </span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { censored } from "../stores/censored";
import { useStore } from "@nanostores/vue";
import { computed } from "vue";
import { timeframe } from "../stores/timeframe";

const props = defineProps({
  data: Object,
  refreshing: Boolean,
  fill: Boolean,
});

const $censored = useStore(censored);
const $timeframe = useStore(timeframe);

const pnl = computed(() => {
  let element = props.data;
  let change = element.token.price_change[$timeframe.value];
  let p = Math.abs(change) / 100;
  let n = element.token.unitPrice;
  let o = n / (p + 1);
  let oldValue = element.balance * o;
  return element.token.totalValue - oldValue;
});
</script>
