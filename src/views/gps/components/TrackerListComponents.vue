<script>
import {useRoute} from "vue-router";
import {useErrorStore} from "@/stores/error";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
  Switch
} from '@headlessui/vue'
import {XMarkIcon, ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/24/outline'
import {EllipsisVerticalIcon} from '@heroicons/vue/20/solid'
import {getTrackerList, setTrackerAPI} from "@/apis/gps";
import {defaultTextInput} from "@/styles";
import {useLayoutStore} from "@/stores/layout";

export default {
  name: 'TrackerListComponents',
  async setup() {
    const errorStore = useErrorStore()
    const route = useRoute()
    const layoutStore = useLayoutStore()
    return {errorStore, route, layoutStore}
  },
  data() {
    return {
      // show: false,
      trackerSetData: [],
      trackerListData: null,
      query: ''
    }
  },
  watch: {
    show: function (newValue, oldValue) {
      if (newValue !== oldValue && newValue === true) {
        this.$nextTick(async () => {
          this.query = ''
          this.trackerSetData = []
          this.trackerListData = null
          await this.setTrackerListData(1)
        })
      }
    }
  },
  props: {
    gpsSession: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['setTrackers', 'update:show'],
  components: {
    Dialog, DialogPanel, DialogTitle,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
    XMarkIcon, EllipsisVerticalIcon,
    ChevronLeftIcon, ChevronRightIcon,
    Switch
  },
  computed: {},
  methods: {
    defaultTextInput() {
      return defaultTextInput
    },
    async setTrackerListData(page) {
      // let trackerListData = await getTrackerList(page, this.query === '' ? null : this.query)
      this.trackerListData = await getTrackerList(page, this.query === '' ? null : this.query)
    },
    async navigatePage(page) {
      await this.setTrackerListData(page)
    },
    async search() {
      await this.setTrackerListData(1)
    },
    async addTrackers(trackerList) {
      const data = trackerList.map(tracker => {
        return {
          id: tracker.id,
          action: 'add'
        }
      })
      const response = await setTrackerAPI(this.gpsSession.id, data)
      this.$emit('setTrackers', response.map(response => {
        response['action'] = 'add'
        return response
      }))
      return response
    },
    async removeTrackers(trackerList) {
      const data = trackerList.map(tracker => {
        return {
          id: tracker.id,
          action: 'remove'
        }
      })
      const response = await setTrackerAPI(this.gpsSession.id, data)
      this.$emit('setTrackers', data)
      return response
    },
    async addTracker(tracker) {
      const response = await this.addTrackers([tracker])
      return response
    },
    async removeTracker(tracker) {
      const response = await this.removeTrackers([tracker])
      return response
    },
    async toggleTracker(tracker) {
      let selected = tracker.selected
      try {
        let response
        if (tracker.selected) {
          response = await this.removeTracker(tracker)
        } else {
          response = await this.addTracker(tracker)
        }
        return response
      } catch (e) {
        tracker.selected = selected
        await this.errorStore.set('error', '실패', `단말기 설정에 실패했습니다.: ${e}`)
      }
    }
  }
}
</script>

<template>

  <div v-if="show">

    <TransitionRoot as="template" :show="show">
      <Dialog as="div" class="relative z-50" @close="$emit('update:show', false)">
        <TransitionChild as="template" enter="ease-in-out duration-200" enter-from="opacity-0" enter-to="opacity-100"
                         leave="ease-in-out duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
        </TransitionChild>
        <div class="fixed inset-0"/>

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-16">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-200 sm:duration-200"
                               enter-from="translate-x-full" enter-to="translate-x-0"
                               leave="transform transition ease-in-out duration-200 sm:duration-200"
                               leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-4xl">
                  <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div class="p-6">
                      <div class="flex items-start justify-between">
                        <DialogTitle class="text-base font-semibold leading-6 text-gray-900">
                          단말기 목록
                        </DialogTitle>
                        <div class="ml-3 flex h-7 items-center">
                          <button type="button"
                                  class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                                  @click="$emit('update:show', false)">
                            <span class="absolute -inset-2.5"/>
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true"/>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="px-4 py-5" v-if="trackerListData">
                      <form class="sm:flex sm:items-center" @submit.prevent="search">
                        <div class="w-full sm:max-w-xs">
                          <input type="text" id="affiliateQuery" name="affiliateQuery" :class="[...defaultTextInput()]"
                                 ref="affiliateInput"
                                 @input="(event) => this.query = event.target.value.trim()">
                        </div>
                        <button type="submit"
                                class="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto">
                          검색
                        </button>
                      </form>
                      <div class="-mx-4 mt-5 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-300">
                          <thead>
                          <tr>
                            <th scope="col" class="py-3.5 pl-5 pr-3 text-left text-sm font-semibold text-gray-900">
                              장비
                            </th>
                            <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                              고유값
                            </th>
                            <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                              설치
                            </th>
<!--                            <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">-->
<!--                              현재위치-->
<!--                            </th>-->
                            <th scope="col" class="py-3.5 pl-3 pr-5 text-left text-sm font-semibold text-gray-900">
                              선택
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          <template v-for="(tracker, trackerIndex) in trackerListData?.results || []">
                            <tr>
                              <td :class="[trackerIndex === 0 ? '' : 'border-t border-gray-200', 'hidden pl-5 pr-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
                                {{ tracker.device_type_display }}
                              </td>
                              <td :class="[trackerIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell']">
                                {{ tracker.identifier }}
                              </td>
                              <td :class="[trackerIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell']">
                                <span class="font-bold">{{tracker.target.type_display + ' '}} </span>
                                <span>{{tracker.target.name}}</span>
                              </td>
                              <td :class="[trackerIndex === 0 ? '' : 'border-t border-gray-200', 'hidden pl-3 pr-5 py-3.5 text-sm text-gray-500 lg:table-cell']">
                                <!--                                {{ tracker.selected }}-->

                                <Switch @click="toggleTracker(tracker)" v-model="tracker.selected"
                                        :class="[tracker.selected ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2']">
                                  <span class="sr-only">Use setting</span>
                                  <span
                                      :class="[tracker.selected ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']">
                                    <span
                                        :class="[tracker.selected ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']"
                                        aria-hidden="true">
                                      <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor"
                                              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                    </span>
                                    <span
                                        :class="[tracker.selected ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']"
                                        aria-hidden="true">
                                      <svg class="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
                                        <path
                                            d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"/>
                                      </svg>
                                    </span>
                                  </span>
                                </Switch>
                              </td>
                            </tr>
                          </template>
                          </tbody>
                        </table>
                        <div
                            class="flex flex-col justify-center items-center rounded-b-lg border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                          <div class="small mb-2">
                            총 {{ trackerListData.count }}개의 결과 중 {{ trackerListData.results.length }}개를 보여줍니다.
                          </div>
                          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <a href="#" v-if="trackerListData.trackerListData !== null"
                                   @click.prevent="navigatePage(trackerListData.trackerListData)"
                                   class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                  <span class="sr-only">이전</span>
                                  <ChevronLeftIcon class="h-5 w-5" aria-hidden="true"/>
                                </a>
                                <template v-for="pageIndex in trackerListData.page_list">
                                  <template v-if="pageIndex === trackerListData.current_page">
                                    <a href="#" aria-current="page" @click.prevent="navigatePage(pageIndex)"
                                       class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{
                                        pageIndex
                                      }}</a>
                                  </template>
                                  <template v-else>
                                    <a href="#" @click.prevent="navigatePage(pageIndex)"
                                       class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{{
                                        pageIndex
                                      }}</a>
                                  </template>
                                </template>
                                <a href="#" v-if="trackerListData.next_page !== null"
                                   @click.prevent="navigatePage(trackerListData.next_page)"
                                   class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                  <span class="sr-only">다음</span>
                                  <ChevronRightIcon class="h-5 w-5" aria-hidden="true"/>
                                </a>
                              </nav>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--                  <ul role="list" class="flex-1 divide-y divide-gray-200 overflow-y-auto" v-if="affiliateData?.results ? affiliateData.results.length === 0 : true">-->
                    <!--                    <li>-->
                    <!--                      <div class="group relative flex items-center px-5 py-6 border-t">-->
                    <!--                        <div class="-m-1 block flex-1 p-1">-->
                    <!--                          <div class="absolute inset-0 group-hover:bg-gray-50" aria-hidden="true"/>-->
                    <!--                          <div class="relative min-w-0 items-center">-->
                    <!--                            <div class="ml-4 w-full">-->
                    <!--                              <p class="truncate text-sm text-gray-500">검색결과가 없습니다.</p>-->
                    <!--                            </div>-->
                    <!--                          </div>-->
                    <!--                        </div>-->
                    <!--                      </div>-->
                    <!--                    </li>-->
                    <!--                  </ul>-->
                    <!--                  <ul role="list" class="flex-1 divide-y divide-gray-200 overflow-y-auto clickable" v-else>-->
                    <!--                    <li v-for="(affiliate, affiliateIdx) in affiliateData?.results || []" :key="affiliate.id"-->
                    <!--                        @click="selectAffiliate(affiliate)">-->
                    <!--                      <div class="group relative flex items-center px-5 py-6"-->
                    <!--                           :class="affiliateIdx === 0 ? 'border-t' : ''">-->
                    <!--                        <div class="-m-1 block flex-1 p-1">-->
                    <!--                          <div class="absolute inset-0 group-hover:bg-gray-50" aria-hidden="true"/>-->
                    <!--                          <div class="relative min-w-0 grid grid-cols-4 items-center text-left">-->
                    <!--                            <div class="ml-4 col-span-1">-->
                    <!--                              <p class="truncate text-sm text-gray-500">사업장명</p>-->
                    <!--                              <p class="truncate font-medium text-gray-900">{{ affiliate.name }}</p>-->
                    <!--                            </div>-->
                    <!--                            <div class="ml-4 col-span-1">-->
                    <!--                              <p class="truncate text-sm text-gray-500">법인명</p>-->
                    <!--                              <p class="truncate font-medium text-gray-900">{{ affiliate.name_legal }}</p>-->
                    <!--                            </div>-->
                    <!--                            <div class="ml-4 col-span-1">-->
                    <!--                              <p class="truncate text-sm text-gray-500">사업자등록번호</p>-->
                    <!--                              <p class="truncate font-medium text-gray-900">-->
                    <!--                                {{ affiliate.brn ? brnParser(affiliate.brn) : null }}</p>-->
                    <!--                            </div>-->
                    <!--                            <div class="ml-4 col-span-1">-->
                    <!--                              <p class="truncate text-sm text-gray-500">대표자</p>-->
                    <!--                              <p class="truncate font-medium text-gray-900">{{ affiliate.rep }}</p>-->
                    <!--                            </div>-->
                    <!--                          </div>-->
                    <!--                        </div>-->
                    <!--                      </div>-->
                    <!--                    </li>-->
                    <!--                  </ul>-->
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>
