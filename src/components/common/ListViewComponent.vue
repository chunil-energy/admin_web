<script setup>
import {useRoute} from "vue-router";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/20/solid'
import {onMounted, ref} from "vue";

import {CheckCircleIcon, XCircleIcon} from '@heroicons/vue/24/outline'
const props = defineProps({
  titleString: {
    type: String,
    required: true,
  },
  addRouterName: {
    type: String,
    required: false,
    default: null
  },
  columns: {
    type: Array,
    required: false,
    default: []
  },
  itemData: {
    type: Object,
    required: false,
    default: null
  }
})


const route = useRoute()
const queryForm = ref()
const queryFormPageInput = ref()

const currentPage = route.query.page ? parseInt(route.query.page) : 1

// const getFormData = () => {
//   let query = {}
//   const fd = new FormData(queryForm.value)
//   fd.forEach((v, k) => query[k] = v)
//   return query
// }

const navigatePage = (pageNo) => {
  queryFormPageInput.value.value = pageNo
  onQueryFormSubmit()
}

const onQueryFormSubmit = () => {
  queryForm.value.submit()
}

</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8" v-if="itemData">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">{{ props.titleString }}</h1>
      </div>
      <!--      <button @click="navigatePage(3)">sdf</button>-->
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none" v-if="props.addRouterName">
        <router-link type="button" :to="{name: props.addRouterName}"
                     class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          신규 등록
        </router-link>
      </div>
    </div>

    <form method="get" id="queryForm" ref="queryForm">
      <input type="number" name="page" hidden="hidden" id="queryFormPageInput" ref="queryFormPageInput"
             v-bind:value="currentPage">
      <slot name="queryForm">

      </slot>
    </form>
    <div class="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
        <template v-if="columns">
          <tr>
            <th v-for="column in columns"
                :class="column.class ? column.class : 'py-3.5 px-3 text-left text-sm font-semibold text-gray-900' ">
              {{ column.name }}
            </th>
          </tr>
        </template>
        <template v-else>
          <slot name="thead"></slot>
        </template>
        </thead>
        <tbody>
        <template v-if="itemData?.results">
          <template v-if="itemData.results.length === 0">
            <tr>
              <td class="border-t border-gray-200 hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                  :colspan="columns.length">
                조회 결과가 없습니다.
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="(item, itemIndex) in itemData.results" v-bind:key="itemIndex">
              <template v-for="(column, columnIndex) in columns">
                <td :class="[itemIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
                  <template v-if="column.type === 'data'">
                    {{ item[column.field] }}
                  </template>
                  <template v-if="column.type === 'bool'">
                    <CheckCircleIcon class="h-5 w-5 text-green-400" v-if="item[column.field]"/>
                    <XCircleIcon class="h-5 w-5 text-red-400" v-else/>
                  </template>
                  <template v-if="column.type === 'button'">
                    <router-link type="button" :to="{name: column.pathName, params: {[column.pathParamName]: item[column.pathParamFieldName]}}"
                                 class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      {{column.name}}<span class="sr-only">, {{ column.name }}</span>
                    </router-link>
                  </template>
                </td>
              </template>
            </tr>
          </template>
        </template>
        <template v-else>
          <tr>
            <td class="border-t border-gray-200 hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                :colspan="columns.length">
              데이터 조회중
            </td>
          </tr>
        </template>
        </tbody>
      </table>
      <div class="flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <a href="#"
             class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
          <a href="#"
             class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div v-if="itemData?.results">
            <p class="text-sm text-gray-700">
              {{ itemData.count.toLocaleString() }}개 중 {{ itemData.results.length }} 개 표시
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <a href="#" v-if="itemData.previous !== null" @click.prevent="navigatePage(currentPage - 1)"
                 class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <span class="sr-only">이전</span>
                <chevron-left-icon class="h-5 w-5" aria-hidden="true"/>
              </a>
              <template v-for="pageIndex in itemData.page_list">
                <template v-if="pageIndex === currentPage">
                  <a href="#" aria-current="page" @click.prevent="navigatePage(pageIndex)"
                     class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{ pageIndex }}</a>
                </template>
                <template v-else>
                  <a href="#" @click.prevent="navigatePage(pageIndex)"
                     class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{{ pageIndex }}</a>
                </template>
              </template>
              <a href="#" v-if="itemData.next !== null" @click.prevent="navigatePage(currentPage + 1)"
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

<style scoped>

</style>