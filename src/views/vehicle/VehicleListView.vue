<script>
import {useAuthStore} from "@/stores/auth";
import axios from "axios";
import {onMounted, ref} from "vue";

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
import {useRoute} from "vue-router";
import vehicleTypeParser from "@/utils/vehicle/vehicleTypeParser";
import vehiclePositionParser from "@/utils/vehicle/vehiclePositionParser";
import vehicleVehicleDriverParser from "@/utils/vehicle/vehicleVehicleDriverParser";
import vehiclePartyParser from "../../utils/vehicle/vehiclePartyParser";
export default {
  name: 'AffiliateListView',
  setup() {
    const authStore = useAuthStore()
    const route = useRoute()
    const currentPage = route.query.page ? parseInt(route.query.page) : 1
    const pageSize = route.query.pagesize ? parseInt(route.query.pagesize) : 20
    return {authStore, currentPage, pageSize}
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
    this.vehicleData = await this.getVehicleList()
  },
  methods: {
    vehiclePartyParser,
    vehicleVehicleDriverParser,
    vehiclePositionParser,
    vehicleTypeParser,
    async getVehicleList() {
      await this.authStore.tokenRefresh()
      const vehicleUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/vehicle/`;
      const option = {
        method: 'get', url: vehicleUrl, params: {page: this.currentPage}, headers: {Authorization: `Bearer ${this.authStore.accessToken}`}
      }
      const response = await axios.request(option)
      return response.data
    },
    navigatePage(pageNumber) {
      document.getElementById('queryFormPage').value = pageNumber
      document.getElementById('queryForm').submit()
    }
  }
}




</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">차량 목록</h1>
        <!--        <p class="mt-2 text-sm text-gray-700">Your team is on the <strong-->
        <!--            class="font-semibold text-gray-900">Startup</strong> vehicle. The next payment of $80 will be due on August 4,-->
        <!--          2022.</p>-->
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <router-link :to="{name: 'vehicle_create'}" type="button"
                class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          신규 차량 등록
        </router-link>
      </div>
    </div>

    <form method="get" id="queryForm" hidden="hidden">
      <input type="number" name="page" id="queryFormPage" v-bind:value="currentPage">
    </form>
    <div class="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
        <tr>
          <th scope="col" class="py-3.5 pl-5 pr-3 text-left text-sm font-semibold text-gray-900">
            차량번호
          </th>
          <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
            차명
          </th>
          <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
            차량타입
          </th>
          <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
            소유자
          </th>
          <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
            사용자
          </th>
          <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
            관리자
          </th>
          <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
            용도
          </th>
          <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
            배정기사</th>
          <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
            기사연락처</th>
          <th scope="col" class="relative py-3.5 px-3 pr-4 sm:pr-3">
            <span class="sr-only">Select</span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(vehicle, vehicleIdx) in vehicleData?.results" :key="vehicle.id">
          <td :class="[vehicleIdx === 0 ? '' : 'border-t border-gray-200', 'hidden pl-5 pr-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ vehicle.car_no }}
          </td>
          <td :class="[vehicleIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ vehicle.name }}
          </td>
          <td :class="[vehicleIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ vehicleTypeParser(vehicle.vehicle_type) }}
          </td>
          <td :class="[vehicleIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ vehiclePartyParser(vehicle.owner_party) }}
          </td>
          <td :class="[vehicleIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ vehiclePartyParser(vehicle.user_party) }}
          </td>
          <td :class="[vehicleIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ vehiclePartyParser(vehicle.manager_party) }}
          </td>
          <td :class="[vehicleIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ vehiclePositionParser(vehicle.position) }}
          </td>
          <td :class="[vehicleIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
            <template v-if="vehicleVehicleDriverParser(vehicle.vehicle_driver_set)">
              {{vehicleVehicleDriverParser(vehicle.vehicle_driver_set)?.driver_user_name || '-'}}({{vehicleVehicleDriverParser(vehicle.vehicle_driver_set)?.driver_user_username}})
            </template>
            <template v-else>
              미배정
            </template>
          </td>
          <td :class="[vehicleIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
            <template v-if="vehicleVehicleDriverParser(vehicle.vehicle_driver_set)">
              {{vehicleVehicleDriverParser(vehicle.vehicle_driver_set)?.driver_user_cellphone || '-'}}
            </template>
            <template v-else>
              미배정
            </template>
          </td>
          <td :class="[vehicleIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
            <router-link type="button" :to="{name: 'vehicle_detail', params: {vehicleId: vehicle.id}}"
                         class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
            >
              자세히<span class="sr-only">, {{ vehicle.name }}</span>
            </router-link>
            <div v-if="vehicleIdx !== 0" class="absolute -top-px left-0 right-6 h-px bg-gray-200"/>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <a href="#"
             class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
          <a href="#"
             class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between" v-if="vehicleData">
          <div>
            <p class="text-sm text-gray-700">
              {{ vehicleData.count.toLocaleString() }}개 중 {{pageSize}} 개 표시
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <a href="#" v-if="vehicleData.previous !== null" @click.prevent="navigatePage(currentPage - 1)"
                 class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <span class="sr-only">이전</span>
                <chevron-left-icon class="h-5 w-5" aria-hidden="true"/>
              </a>
              <template v-for="pageIndex in Math.ceil(vehicleData.count/pageSize)">

                <template v-if="pageIndex >= currentPage-5 && pageIndex <= currentPage+5">
                  <template v-if="pageIndex === currentPage">
                    <a href="#" aria-current="page" @click.prevent="navigatePage(pageIndex)"
                       class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{pageIndex}}</a>
                  </template>
                  <template v-else>
                    <a href="#" @click.prevent="navigatePage(pageIndex)"
                       class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{{pageIndex}}</a>
                  </template>
                </template>
              </template>
              <a href="#" v-if="vehicleData.next !== null" @click.prevent="navigatePage(currentPage + 1)"
                 class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <span class="sr-only">다음</span>
                <chevron-right-icon class="h-5 w-5" aria-hidden="true"/>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>