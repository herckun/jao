<template>
  <div
    class="w-fit mx-auto flex flex-col gap-1 place-content-center place-items-center"
  >
    <ConnectWithWallet />
    <div v-if="pending && !refreshing">
      <Loader />
    </div>
    <div v-else>
      <div v-if="success">
        <div
          class="bg-zinc-800 rounded-xl p-2 m-2 flex flex-col md:flex-row justify-between gap-1 w-[95vw] md:w-[55vw]"
        >
          <div class="text-2xl p-1 gap-1 flex flex-col">
            <span
              class="text-zinc-200 font-black"
              :class="{ 'blur-sm': $censored }"
            >
              ~{{
                new Intl.NumberFormat("en-EN", {
                  maximumSignificantDigits: 5,
                  roundingPriority: "morePrecision",
                  roundingMode: "floor",
                  style: "currency",
                  currency: "USD",
                }).format(totalBalance)
              }}
            </span>
            <span
              class="text-xs font-semibold"
              :class="{ 'text-red-400': pnl < 0, 'glowing-text': pnl > 0 }"
            >
              <span v-if="pnl > 0">+</span
              >{{
                new Intl.NumberFormat("en-EN", {
                  maximumSignificantDigits: 4,
                  roundingPriority: "morePrecision",
                  roundingMode: "floor",
                  style: "currency",
                  currency: "USD",
                }).format(pnl)
              }}
            </span>
          </div>
          <div
            class="grid grid-cols-2 gap-1 w-full place-items-end md:w-fit h-fit"
          >
            <button
              class="btn btn-ghost bg-white/10 col-span-1 w-full p-4"
              @click="refreshData(10)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="w-4 h-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <button
              class="btn btn-ghost bg-white/10 col-span-1 w-full p-4"
              @click="switchCensor"
            >
              <svg
                v-if="$censored"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="w-4 h-4"
              >
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                <path
                  fill-rule="evenodd"
                  d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="w-4 h-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l10.5 10.5a.75.75 0 1 0 1.06-1.06l-1.322-1.323a7.012 7.012 0 0 0 2.16-3.11.87.87 0 0 0 0-.567A7.003 7.003 0 0 0 4.82 3.76l-1.54-1.54Zm3.196 3.195 1.135 1.136A1.502 1.502 0 0 1 9.45 8.389l1.136 1.135a3 3 0 0 0-4.109-4.109Z"
                  clip-rule="evenodd"
                />
                <path
                  d="m7.812 10.994 1.816 1.816A7.003 7.003 0 0 1 1.38 8.28a.87.87 0 0 1 0-.566 6.985 6.985 0 0 1 1.113-2.039l2.513 2.513a3 3 0 0 0 2.806 2.806Z"
                />
              </svg>
            </button>
            <div
              role="tablist"
              class="tabs bg-white/10 tabs-boxed tabs-xs col-span-full w-full"
            >
              <a
                @click="changeTimeFrame('hour')"
                role="tab"
                class="tab"
                :class="{ 'tab-active': $timeframe == 'hour' }"
                >1h</a
              >
              <a
                @click="changeTimeFrame('day')"
                class="tab"
                :class="{ 'tab-active': $timeframe == 'day' }"
                >1d</a
              >
              <a
                @click="changeTimeFrame('week')"
                class="tab"
                :class="{ 'tab-active': $timeframe == 'week' }"
                >1w</a
              >
              <a
                @click="changeTimeFrame('month')"
                class="tab"
                :class="{ 'tab-active': $timeframe == 'month' }"
                >1m</a
              >
              <a
                @click="changeTimeFrame('year')"
                class="tab"
                :class="{ 'tab-active': $timeframe == 'year' }"
                >1y</a
              >
            </div>
          </div>
        </div>
        <div
          class="bg-zinc-800 rounded-xl p-1 m-2 grid grid-cols-1 md:grid-cols-2 gap-0.5 w-[95vw] md:w-[55vw]"
        >
          <Asset
            v-for="(item, index) in data.result"
            v-show="index < counters.show"
            :data="item"
            :refreshing="refreshing"
            :fill="index == counters.total - 1 && counters.total % 2 != 0"
          />
          <button
            v-if="counters.total > 6"
            class="btn btn-xs btn-ghost w-fit"
            @click="switchShow"
          >
            <span v-if="counters.show == counters.total">
              <span>See less</span>
            </span>
            <span class="align-middle" v-else>
              <span class="align-middle">See all</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="w-4 h-4 inline-block align-middle"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
      <div v-else>
        <Terminal command="fetch portfolio data" :res="msg" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Terminal from "./Terminal.vue";
import Asset from "./Asset.vue";
import Connect from "./Connect.vue";
import ConnectWithWallet from "./ConnectWithWallet.vue";
import Loader from "./Loader.vue";

import { connected } from "../stores/connected";
import { censored } from "../stores/censored";
import { useStore } from "@nanostores/vue";

import {
  computed,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import fetchnc from "../server/lib/fetchnc";
import { timeframe } from "../stores/timeframe";

const success = ref(false);
const msg = ref("...");

const refreshing = ref(false);
const pending = ref(false);
const error = ref(false);
const data = reactive({
  result: <any[]>[],
});
const counters = reactive({
  total: 0,
  show: 0,
});

const $connected = useStore(connected);
const $censored = useStore(censored);
const $timeframe = useStore(timeframe);

watch($connected, async () => {
  await fetchData($connected);
  if ($connected.value.address === "") {
    msg.value = "...";
  }
});

async function fetchData($connected: any, ttl: number = 30) {
  let address = $connected.value.address;
  if (address == null || address.length == 0) {
    success.value = false;
    return;
  }
  error.value = false;
  pending.value = true;

  try {
    const f = await fetchnc(`/api/portfolio/${address}`, ttl);
    const json = await f.json();
    let result = json?.result;

    counters.show = result.length > 4 ? 4 : result.length;
    counters.total = result.length;

    data.result = result;
    if (result.length == 0) {
      success.value = false;
      pending.value = false;
      msg.value = "no data available, syncing...";

      const sf = await fetch(`/api/sync/${address}`);
      if (sf.status == 200) {
        const rf = await sf.json();
        if (parseInt(rf.count) > 0) {
          await refreshData(0);
          return;
        } else {
          success.value = false;
          msg.value = "try again later";
          return;
        }
      } else {
        success.value = false;
        msg.value = "try again later";
        return;
      }
    }
    success.value = true;
  } catch (err) {
    msg.value = "try again later";
    success.value = false;
  } finally {
    pending.value = false;
  }
}

const totalBalance = computed(() => {
  let t = 0;
  data.result.forEach((element) => {
    t += element.token.totalValue;
  });

  return t;
});

const pnl = computed(() => {
  let t = 0;
  data.result.forEach((element) => {
    let change = element.token.price_change[$timeframe.value];
    let p = Math.abs(change) / 100;
    let n = element.token.unitPrice;
    let o = n / (p + 1);
    let oldValue = element.balance * o;
    let c = element.token.totalValue - oldValue;
    t = change < 0 ? t - c : t + c;
  });
  return t;
});

async function refreshData(ttl: number = 30) {
  refreshing.value = true;
  fetchnc(`/api/sync/${$connected.value.address}`, 30);
  await fetchData($connected, ttl);
  refreshing.value = false;
}

function switchShow() {
  if (counters.show == counters.total) {
    counters.show = 4 < counters.total ? 4 : counters.total;
  } else {
    counters.show = counters.total;
  }
}
function switchCensor() {
  censored.set(!$censored.value);
}
function changeTimeFrame(m: string) {
  timeframe.set(m);
}
</script>
<style>
.glowing-text {
  color: #fff;
  font-weight: bold;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #00ffaa,
    0 0 30px rgb(0, 255, 64), 0 0 40px rgb(0, 255, 64), 0 0 50px rgb(0, 255, 64),
    0 0 100px rgb(0, 255, 64);
}
</style>
