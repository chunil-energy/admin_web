<script setup>
import {BanknotesIcon, BuildingOfficeIcon, WrenchIcon, ClipboardIcon} from "@heroicons/vue/20/solid";
import {useRoute, useRouter} from "vue-router";
import {useErrorStore} from "@/stores/error";
import getVehicle from "@/apis/vehicle/get";
import {ref, computed} from "vue";
import VehicleDetailBaseComponent from "@/views/vehicle/vehicleDetail/VehicleDetailBaseComponent.vue";
import VehicleDetailInsuranceComponent from "@/views/vehicle/vehicleDetail/VehicleDetailInsuranceComponent.vue";
import VehicleDetailRegistrationComponent from "@/views/vehicle/vehicleDetail/VehicleDetailRegistrationComponent.vue";

const router = useRouter()
const errorStore = useErrorStore()
const route = useRoute()
const vehicleId = route.params.vehicleId

const vehicleData = await getVehicle(vehicleId)

const currentTab = computed(() => {
  let tab = route.query.tab
  if (!tab) {
    return 'base'
  }
  return tab
})

const tabs = ref([
  {
    name: '기본정보',
    value: 'base',
    to: {name: 'vehicle_detail', params: {vehicleId: vehicleId}, query: {tab: 'base'}},
    icon: BuildingOfficeIcon,
    current: 'base' === currentTab
  },
  {
    name: '보험정보',
    value: 'insurance',
    to: {name: 'vehicle_detail', params: {vehicleId: vehicleId}, query: {tab: 'insurance'}},
    icon: BanknotesIcon,
    current: 'insurance' === currentTab
  },
  {
    name: '등록증',
    value: 'registration',
    to: {name: 'vehicle_detail', params: {vehicleId: vehicleId}, query: {tab: 'registration'}},
    icon: ClipboardIcon,
    current: 'registration' === currentTab
  },
  {
    name: '정기점검',
    value: 'check',
    to: {name: 'vehicle_detail', params: {vehicleId: vehicleId}, query: {tab: 'check'}},
    icon: BanknotesIcon,
    current: 'check' === currentTab
  },
])


</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">{{ vehicleData.data.car_no }} /
          {{ vehicleData.data.name }}</h1>
      </div>
    </div>
    <div class="mt-10">
      <div class="hidden sm:block">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <router-link :to="tab.to" v-for="tab in tabs" :key="tab.name"
                         :class="[tab.value === currentTab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium']"
                         :aria-current="tab.value === currentTab ? 'page' : undefined">
              <component :is="tab.icon"
                         :class="[tab.value === currentTab ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500', '-ml-0.5 mr-2 h-5 w-5']"
                         aria-hidden="true"/>
              <span>{{ tab.name }}</span>
            </router-link>
          </nav>
        </div>
      </div>
    </div>
    <div class="mt-5 mb-10  sm:mx-0 sm:rounded-lg" v-if="currentTab === 'base'">
      <VehicleDetailBaseComponent/>
    </div>
    <div class="mt-5 mb-10  sm:mx-0 sm:rounded-lg" v-if="currentTab === 'insurance'">
      <VehicleDetailInsuranceComponent/>
    </div>
    <div class="mt-5 mb-10  sm:mx-0 sm:rounded-lg" v-if="currentTab === 'registration'">
      <VehicleDetailRegistrationComponent/>
    </div>
    <div class="mt-5 mb-10  sm:mx-0 sm:rounded-lg" v-if="currentTab === 'check'">
<!--      <VehicleDetailRegistrationComponent/>-->
    </div>
  </div>
</template>

