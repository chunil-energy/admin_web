<script>
import {useAuthStore} from "@/stores/auth";
import axios from "axios";
import {onMounted, ref} from "vue";

import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/20/solid'
import {useRoute} from "vue-router";
import vehicleTypeParser from "@/utils/vehicleTypeParser";
import vehiclePositionParser from "@/utils/vehiclePositionParser";
import vehicleVehicleDriverParser from "@/utils/vehicleVehicleDriverParser";

export default {
  setup() {
    const authStore = useAuthStore()
    const route = useRoute()
    const vehicleId = route.params.vehicleId
    return {authStore, route, vehicleId}
  },
  components: {
    'chevron-left-icon': ChevronLeftIcon,
    'chevron-right-icon': ChevronRightIcon,
  },
  data() {
    return {
      vehicleData: null
    }
  },
  async mounted() {
    this.vehicleData = await this.getVehicleData()
  },
  methods: {
    vehicleVehicleDriverParser,
    vehiclePositionParser,
    vehicleTypeParser,
    async getVehicleData() {
      await this.authStore.tokenRefresh()
      const vehicleUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/vehicle/${this.vehicleId}`;
      const option = {
        method: 'get', url: vehicleUrl, headers: {Authorization: `Bearer ${this.authStore.accessToken}`}
      }
      const response = await axios.request(option)
      return response.data
    }
  }
}


</script>

<template>
  <!--  <div class="px-4 sm:px-6 lg:px-8" v-if="vehicleData">-->
  <!--    <div class="sm:flex sm:items-center">-->
  <!--      <div class="sm:flex-auto">-->
  <!--        <h1 class="text-base font-semibold leading-6 text-gray-900"></h1>-->
  <!--        <p class="mt-2 text-sm text-gray-700">Your team is on the <strong-->
  <!--            class="font-semibold text-gray-900">Startup</strong> vehicle. The next payment of $80 will be due on August 4,-->
  <!--          2022.</p>-->
  <!--      </div>-->
  <!--      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">-->
  <!--        <button type="button"-->
  <!--                class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">-->
  <!--          신규 차량 등록-->
  <!--        </button>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div class="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">-->
  <!--      {{vehicleData}}-->
  <!--    </div>-->
  <!--  </div>-->
  {{ vehicleData }}
  <div class="overflow-hidden bg-white shadow sm:rounded-lg" v-if="vehicleData">
    <div class="px-4 py-6 sm:px-6">
      <h3 class="text-base font-semibold leading-7 text-gray-900">{{ vehicleData.car_no }} 차량상세</h3>
<!--      <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>-->
    </div>
    <div class="border-t border-gray-100">
      <dl class="grid grid-cols-1 sm:grid-cols-4">
        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">차량번호</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{{vehicleData.car_no}}</dd>
        </div>
        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">차명</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{{vehicleData.name}}</dd>
        </div>
        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">차량타입</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{{ vehicleTypeParser(vehicleData.vehicle_type) }}</dd>
        </div>
        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">용도</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{{ vehiclePositionParser(vehicleData.position) }}</dd>
        </div>
      </dl>
      <dl class="divide-y divide-gray-100 border-t border-gray-100">
<!--        <div class="grid grid-cols-1 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">-->
<!--          <dt class="text-sm font-medium text-gray-900">Full name</dt>-->
<!--          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">Margot Foster</dd>-->
<!--        </div>-->
<!--        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">-->
<!--          <dt class="text-sm font-medium text-gray-900">Application for</dt>-->
<!--          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">Backend Developer</dd>-->
<!--        </div>-->
<!--        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">-->
<!--          <dt class="text-sm font-medium text-gray-900">Email address</dt>-->
<!--          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">margotfoster@example.com</dd>-->
<!--        </div>-->
<!--        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">-->
<!--          <dt class="text-sm font-medium text-gray-900">Salary expectation</dt>-->
<!--          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">$120,000</dd>-->
<!--        </div>-->
<!--        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">-->
<!--          <dt class="text-sm font-medium text-gray-900">About</dt>-->
<!--          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">Fugiat ipsum ipsum deserunt culpa aute-->
<!--            sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id-->
<!--            mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing-->
<!--            reprehenderit deserunt qui eu.-->
<!--          </dd>-->
<!--        </div>-->
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">자동차보험</dt>
          <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
              <li v-for="insurance in vehicleData.insurance_list" v-bind:key="insurance.id" class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                <div class="flex w-0 flex-1 items-center">
                  <PaperClipIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true"/>
                  <div class="ml-4 flex min-w-0 flex-1 gap-2">
                    <span class="truncate font-medium">{{insurance.insurer_display}}</span>
                    <span class="flex-shrink-0 text-gray-400">{{insurance.insurance_duration_list[0]}} ~ {{insurance.insurance_duration_list[1]}}</span>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Download</a>
                </div>
              </li>
              <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                <div class="flex w-0 flex-1 items-center">
                  <PaperClipIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true"/>
                  <div class="ml-4 flex min-w-0 flex-1 gap-2">
                    <span class="truncate font-medium">coverletter_back_end_developer.pdf</span>
                    <span class="flex-shrink-0 text-gray-400">dd</span>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Download</a>
                </div>
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
