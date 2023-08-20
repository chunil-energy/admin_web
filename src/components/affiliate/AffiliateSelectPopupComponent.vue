<script>
import {defineComponent} from 'vue'
import getAffiliateList from "@/apis/affiliate/list";
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { LinkIcon, PlusIcon, QuestionMarkCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'



export default defineComponent({
  name: "AffiliateSelectPopupComponent",
  setup() {
    return {}
  },
  components: {
    Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot,
    XMarkIcon, LinkIcon, PlusIcon, QuestionMarkCircleIcon, ChevronLeftIcon, ChevronRightIcon
  },
  data() {
    return {
      open: false,
      selectedAffiliate: null,
      affiliateData: null,
      page: 1,
      query: '',
      pageSize: 20
    }
  },
  emits: ['closePopup', 'affiliateSelect'],
  props: {
    entityName: {
      type: String,
      required: false,
      default: '사업장'
    },
    classList: {
      type: String,
      required: false,
      default: 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
    },
    queryParams : {
      type: Object,
      required: false,
      default: {parent: 'N'}
    },
    openValue: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    computedParams() {
      const newParams = this.queryParams
      newParams['query'] = this.query
      newParams['page'] = this.page
      return newParams
    }
  },
  async mounted() {
    this.affiliateData= await getAffiliateList(this.computedParams)
  },
  watch: {
    openValue(nv) {
      this.open = nv
    }
  },
  methods: {
    closePopup() {
      this.open = false
      this.$emit('closePopup', false)
    },
    async navigatePage(page)  {
      this.page = page
      this.affiliateData= await getAffiliateList(this.computedParams)
    },
    selectAffiliate(affiliateData) {
      this.$emit('affiliateSelect', affiliateData)
      this.selectedAffiliate = affiliateData
      this.closePopup()
    }
  }
})


</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="closePopup()">
      <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>
      <div class="fixed inset-0" />

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
              <DialogPanel class="pointer-events-auto w-screen max-w-2xl">
                <form class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div class="flex-1">
                    <!-- Header -->
                    <div class="bg-gray-50 px-4 py-6 sm:px-6">
                      <div class="flex items-start justify-between space-x-3">
                        <div class="space-y-1">
                          <DialogTitle class="text-base font-semibold leading-6 text-gray-900">{{entityName}} 선택</DialogTitle>
                        </div>
                        <div class="flex h-7 items-center">
                          <button type="button" class="relative text-gray-400 hover:text-gray-500" @click="closePopup()">
                            <span class="absolute -inset-2.5" />
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Divider container -->
                    <div class="space-y-6 py-6 px-3 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0" v-if="affiliateData">
                      <table class="min-w-full divide-y divide-gray-300">
                        <thead>
                        <tr>
                          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            사업장명
                          </th>
                          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                            법인명
                          </th>
                          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            대표자
                          </th>
                          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                            사업자등록번호
                          </th>
                          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                            법인등록번호
                          </th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">주사업장</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(affiliate, affiliateIdx) in affiliateData.results" :key="affiliate.id" class="rowSelect" @click.prevent="selectAffiliate(affiliate)">
                          <!--        <tr v-for="(vehicle, vehicleIdx) in plans" :key="vehicle.id">-->
                          <td :class="[affiliateIdx === 0 ? '' : 'border-t border-transparent', 'relative py-4 pl-4 pr-3 text-sm sm:pl-6']">
                            <div class="font-medium text-gray-900">
                              {{ affiliate.name }}
                            </div>
                            <div class="mt-1 flex flex-col text-gray-900 sm:block lg:hidden">
                              <span>{{ affiliate.name_legal }}</span>
                            </div>
                            <div v-if="affiliateIdx !== 0" class="absolute -top-px left-0 right-0 h-px bg-gray-200"/>
                          </td>
                          <td :class="[affiliateIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-900 lg:table-cell']">
                            {{ affiliate.name_legal }}
                          </td>
                          <!--          <td :class="[affiliateIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">-->
                          <!--            {{ affiliate. }}-->
                          <!--          </td>-->
                          <td :class="[affiliateIdx === 0 ? '' : 'border-t border-transparent', 'relative py-4 pl-4 pr-3 text-sm sm:pl-6']">
                            <div class="font-medium text-gray-900">
                              {{ affiliate.rep }}
                            </div>
                            <div class="mt-1 flex flex-col text-gray-900 sm:block lg:hidden">
                              <span>{{ brnParser(affiliate.brn) }}</span>
                              <span>{{ corpRegisterNoParser(affiliate.registration_no) }}</span>
                            </div>
                            <div v-if="affiliateIdx !== 0" class="absolute -top-px left-0 right-0 h-px bg-gray-200"/>
                          </td>
                          <td :class="[affiliateIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-900 lg:table-cell']">
                            {{ brnParser(affiliate.brn) }}
                          </td>
                          <td :class="[affiliateIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-900 lg:table-cell']">
                            {{ corpRegisterNoParser(affiliate.registration_no) }}
                          </td>
                          <td :class="[affiliateIdx === 0 ? '' : 'border-t border-gray-200', 'relative py-4 pl-4 pr-3 text-sm sm:pl-6']">
                            {{ affiliate.parent?.name }}
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
                        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between" v-if="affiliateData">
                          <div>
                            <p class="text-sm text-gray-700">
                              {{ affiliateData.count.toLocaleString() }}개 중 {{pageSize}} 개 표시
                            </p>
                          </div>
                          <div>
                            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                              <a href="#" v-if="affiliateData.previous !== null" @click.prevent="navigatePage(page - 1)"
                                 class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                <span class="sr-only">이전</span>
                                <chevron-left-icon class="h-5 w-5" aria-hidden="true"/>
                              </a>
                              <template v-for="pageIndex in Math.ceil(affiliateData.count/pageSize)">
                                <template v-if="pageIndex >= page-5 && pageIndex <= page+5">
                                  <template v-if="pageIndex === page">
                                    <a href="#" aria-current="page" @click.prevent="navigatePage(pageIndex)"
                                       class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{pageIndex}}</a>
                                  </template>
                                  <template v-else>
                                    <a href="#" @click.prevent="navigatePage(pageIndex)"
                                       class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{{pageIndex}}</a>
                                  </template>
                                </template>
                              </template>
                              <a href="#" v-if="affiliateData.next !== null" @click.prevent="navigatePage(page + 1)"
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
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.rowSelect {
  cursor: pointer;
  user-select: none;
}
</style>


<script setup>


import {TransitionChild, TransitionRoot} from "@headlessui/vue";
import brnParser from "../../utils/common/brnParser";
import corpRegisterNoParser from "../../utils/common/corpRegisterNoParser";
</script>
