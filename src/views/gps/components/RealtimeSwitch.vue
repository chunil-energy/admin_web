<script>
import {TransitionChild, TransitionRoot, Switch} from '@headlessui/vue'
import {defaultTextInput} from "@/styles";
import 'dayjs/locale/ko';

import {getSessionDetailAPI} from "@/apis/gps";

export default {
  name: "RealtimeSwitch",
  setup() {
    const interval = 30000
    return {defaultTextInput, interval}
  },
  components: {
    TransitionChild, TransitionRoot, Switch
  },
  props: {
    tripDialogShow: {
      type: Boolean,
      required: true,
      default: false
    },
    sessionId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 실시간 처리
      pooling: false,
      poolTimerId: null,
      elapsed: 0
    }
  },
  emits: [
    'pooledData', 'closeTripDialog'
  ],
  methods: {
    startPooling() {
      this.elapsed = 0
      this.pooling = true
      this.poolTimerId = setInterval(async () => {
        this.elapsed += this.interval
        let response = await getSessionDetailAPI(this.sessionId)
        this.$emit('pooledData', response)
      }, this.interval)

    },
    async endPooling() {
      clearInterval(this.poolTimerId)
      this.elapsed = 0
      this.poolTimerId = null
      this.pooling = false
    },
    async togglePooling() {
      if (this.pooling === true) {
        // 현재 풀링중. 풀링 종료해야함
        await this.endPooling()
      } else {
        // 현재 풀링 중 아님.
        if (this.tripDialogShow === true) {
          // 경로 보는 중
          if (confirm('경로 보기 중엔 실시간 기능을 사용할 수 없습니다.\n경로 보기를 종료하겠습니까?')) {
            this.$emit('closeTripDialog')
            await this.startPooling()
          }
        } else {
          await this.startPooling()
        }
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.poolTimerId)
  }
}
</script>

<template>

  <Switch @click="togglePooling" v-model="pooling"
          :class="[pooling ? 'bg-indigo-600' : '' +
           'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2']">
    <span class="sr-only">Use Realtime</span>
    <span
        :class="[pooling ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                                    <span
                                        :class="[pooling ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']"
                                        aria-hidden="true">
                                      <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor"
                                              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                    </span>
                                    <span
                                        :class="[pooling ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']"
                                        aria-hidden="true">
                                      <svg class="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
                                        <path
                                            d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"/>
                                      </svg>
                                    </span>
                                  </span>
  </Switch>
</template>

<style scoped>

</style>