<script>
import {useAuthStore} from "@/stores/auth";
import axios from "axios";
import {onMounted, ref} from "vue";

import {ChevronLeftIcon, ChevronRightIcon, PaperClipIcon} from '@heroicons/vue/20/solid'
import {useRoute} from "vue-router";
import vehicleTypeParser from "@/utils/vehicle/vehicleTypeParser";
import vehiclePositionParser from "@/utils/vehicle/vehiclePositionParser";
import vehicleVehicleDriverParser from "@/utils/vehicle/vehicleVehicleDriverParser";
import {vehiclePositionChoice, vehicleTypeChoice} from "@/choices/vehicle";
import {defaultSelect, defaultTextInput} from "@/styles"
import CommonSelectComponent from "@/components/common/CommonSelectComponent.vue"
import VehiclePartySelector from "@/components/vehicle/VehiclePartySelector.vue";

export default {
  computed: {
    vehiclePositionChoice() {
      return vehiclePositionChoice
    }
  },
  setup() {
    const authStore = useAuthStore()
    const route = useRoute()
    return {authStore, route, defaultTextInput, vehicleTypeChoice, defaultSelect}
  },
  components: {
    VehiclePartySelector,
    CommonSelectComponent,
    'chevron-left-icon': ChevronLeftIcon,
    'chevron-right-icon': ChevronRightIcon,
    PaperClipIcon
  },
  data() {
    return {
      vehicleData: null
    }
  },
  async mounted() {
    // this.vehicleData = await this.getVehicleData()
  },
  methods: {
    vehicleVehicleDriverParser,
    vehiclePositionParser,
    vehicleTypeParser
  }
}


</script>

<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="px-4 py-6 sm:px-6">
      <h3 class="text-base font-semibold leading-7 text-gray-900">차량 등록</h3>
    </div>
    <div class="border-t border-gray-100">
      <dl class="grid grid-cols-1 sm:grid-cols-10">
        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">차량번호</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            <input type="text" id="car_no" name="car_no" :class="[...defaultTextInput]">
          </dd>
        </div>
        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-3 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">차대번호</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            <input type="text" id="vin" name="vin" :class="[...defaultTextInput]">
          </dd>
        </div>
        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">차명</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            <input type="text" id="name" name="name" :class="[...defaultTextInput]">
          </dd>
        </div>
      </dl>
      <dl class="grid grid-cols-1 sm:grid-cols-10">
        <div class="border-gray-100 px-4 py-6 sm:col-span-2 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">차량타입</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            <select id="position" name="position" :class="[...defaultSelect]">
              <option value="">선택</option>
              <template v-for="[vehicleTypeValue, vehicleTypeName] in Object.entries(vehicleTypeChoice)"
                        v-bind:key="vehicleTypeValue">
                <option :value="vehicleTypeValue">{{ vehicleTypeName }}</option>
              </template>
            </select>
          </dd>
        </div>
        <div class="border-gray-100 px-4 py-6 sm:col-span-2 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">용도</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            <select id="vehicle_type" name="vehicle_type" :class="[...defaultSelect]">
              <option value="">선택</option>
              <template v-for="[vehiclePositionValue, vehiclePositionName] in Object.entries(vehiclePositionChoice)"
                        v-bind:key="vehiclePositionValue">
                <option :value="vehiclePositionValue">{{ vehiclePositionName }}</option>
              </template>
            </select>
          </dd>
        </div>
      </dl>
    </div>
    <div class="border-t border-gray-100">
      <dl class="grid grid-cols-1 sm:grid-cols-3">
        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">소유자</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
<!--            //'owner_party', 'user_party', 'manager_party',-->
            <VehiclePartySelector :label-string="'차량 소유자'" @selectParty="(value) => {console.log('value ', value)}"/>
            <input type="text" id="owner_party" name="owner_party" :class="[...defaultTextInput]">
          </dd>
        </div>
        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">사용자</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">

            <VehiclePartySelector :label-string="'차량 사용자'" @selectParty="(value) => {console.log('value ', value)}"/>
            <input type="text" id="user_party" name="user_party" :class="[...defaultTextInput]">
          </dd>
        </div>
        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-6">
          <dt class="text-sm font-medium leading-6 text-gray-900">관리자</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">

            <VehiclePartySelector :label-string="'차량 관리자'" @selectParty="(value) => {console.log('value ', value)}"/>
            <input type="text" id="manager_party" name="manager_party" :class="[...defaultTextInput]">
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
