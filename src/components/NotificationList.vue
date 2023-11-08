<script setup>

import {CheckCircleIcon, XCircleIcon, MinusCircleIcon} from '@heroicons/vue/24/outline'
import {ExclamationTriangleIcon} from '@heroicons/vue/20/solid'

import {XMarkIcon} from '@heroicons/vue/20/solid'
import {useErrorStore} from "@/stores/error";
import {ref} from "vue";


const errorStore = useErrorStore()
const show = ref(true)

const color = (status) => {
  return {error: 'red', success: 'green', warning: 'yellow'}[status]
}
</script>

<template>
  <!-- Global notification live region, render this permanently at the end of the document -->
  <div aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-start px-4 py-6 sm:p-6">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-center">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->

      <TransitionGroup enter-active-class="transform ease-out duration-300 transition"
                       enter-from-class="translate-y-0 opacity-0 sm:translate-y-2"
                       enter-to-class="translate-y-0 opacity-100 sm:translate-y-0"
                       leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                       leave-to-class="opacity-0">
        <div v-for="error in errorStore.errorArray" v-bind:key="error.id"
             class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <template v-if="error.status === 'error'">
                  <XCircleIcon class="h-6 w-6 text-red-400" aria-hidden="true"/>
                </template>
                <template v-else-if="error.status === 'success'">
                  <CheckCircleIcon class="h-6 w-6 text-green-400" aria-hidden="true"/>
                </template>
                <template v-else-if="error.status === 'warning'">
                  <ExclamationTriangleIcon class="h-6 w-6 text-yellow-400" aria-hidden="true"/>
                </template>
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p :class="`text-sm font-medium text-${color(error.status)}-900`">{{ error.title }}</p>
                <ul class="list-disc">
                  <li :class="`mt-1 text-sm text-${color(error.status)}-500`" v-for="msg in error.message">{{ msg }}
                  </li>
                </ul>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="errorStore.remove(error.id)"
                        class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>

</style>