<template>
  <input type="text" id="owner_party_display" name="vehicle_party_display" @click="open = !open" readonly
         :class="[...defaultTextInput]" :value="selectedParty ? vehiclePartyParser(selectedParty): ''">
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="open = false">
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
                      <DialogTitle class="text-base font-semibold leading-6 text-gray-900">{{ labelString }}
                      </DialogTitle>
                      <div class="ml-3 flex h-7 items-center">
                        <button type="button"
                                class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                                @click="open = false">
                          <span class="absolute -inset-2.5"/>
                          <span class="sr-only">Close panel</span>
                          <XMarkIcon class="h-6 w-6" aria-hidden="true"/>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="border-b border-gray-200">
                    <div class="px-6">
                      <nav class="-mb-px flex space-x-6">
                        <button v-for="tab in tabs" :key="tab.name" @click="() => selectedTab = tab.value"
                                :class="[tab?.value === selectedTab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium']">
                          {{ tab.name }}
                        </button>
                      </nav>
                    </div>
                  </div>
                  <template v-if="selectedTab === 'affiliate'">
                    <div class="px-4 py-5">
                      <input type="text" id="affiliateQuery" name="affiliateQuery" :class="[...defaultTextInput]"
                             @input="(event) => affiliateQuery = event.target.value" ref="affiliateInput">
                    </div>
                    <ul role="list" class="flex-1 divide-y divide-gray-200 overflow-y-auto">
                      <li v-for="(affiliate, affiliateIdx) in filteredAffiliates" :key="affiliate.id" class="clickable" @click.prevent="selectAffiliate(affiliate.id)">
                        <div class="group relative flex items-center px-5 py-6"
                             :class="affiliateIdx === 0 ? 'border-t' : ''">
                          <div class="-m-1 block flex-1 p-1">
                            <div class="absolute inset-0 group-hover:bg-gray-50" aria-hidden="true"/>
                            <div class="relative flex min-w-0 flex-1 items-center">
                              <div class="ml-4 truncate">
                                <p class="truncate text-sm font-medium text-gray-900">{{ affiliate.name }}</p>
                                <p class="truncate text-sm text-gray-500">{{ affiliate.name_legal }}</p>
                              </div>
                            </div>
                          </div>
                          <!--                                            <Menu as="div" class="relative ml-2 inline-block flex-shrink-0 text-left">-->
                          <!--                                              <MenuButton class="group relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">-->
                          <!--                                                <span class="absolute -inset-1.5" />-->
                          <!--                                                <span class="sr-only">Open options menu</span>-->
                          <!--                                                <span class="flex h-full w-full items-center justify-center rounded-full">-->
                          <!--                                                  <EllipsisVerticalIcon class="h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />-->
                          <!--                                                </span>-->
                          <!--                                              </MenuButton>-->
                          <!--                                              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">-->
                          <!--                                                <MenuItems class="absolute right-9 top-0 z-50 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">-->
                          <!--                                                  <div class="py-1">-->
                          <!--                                                    <MenuItem v-slot="{ active }">-->
                          <!--                                                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">View profile</a>-->
                          <!--                                                    </MenuItem>-->
                          <!--                                                    <MenuItem v-slot="{ active }">-->
                          <!--                                                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Send message</a>-->
                          <!--                                                    </MenuItem>-->
                          <!--                                                  </div>-->
                          <!--                                                </MenuItems>-->
                          <!--                                              </transition>-->
                          <!--                                            </Menu>-->
                        </div>
                      </li>
                    </ul>
                  </template>
                  <template v-if="selectedTab === 'user'">
                    <!--                    {{ userData }}-->
                    <div class="px-4 py-5">
                      <form class="sm:flex sm:items-center" @submit.prevent="searchPage">
                        <div class="w-full sm:max-w-xs">
                          <input type="text" id="userQuery" name="userQuery" :class="[...defaultTextInput]" ref="userInput"
                                 @input="(event) => userQuery = event.target.value">
                        </div>
                          <button type="submit"
                                  class="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto">
                            검색
                          </button>
                      </form>
                    </div>

                    <ul role="list" class="flex-1 divide-y divide-gray-200 overflow-y-auto" v-if="userData?.results ? userData.results.length === 0 : true">

                      <li>
                        <div class="group relative flex items-center px-5 py-6 border-t">
                          <div class="-m-1 block flex-1 p-1">
                            <div class="absolute inset-0 group-hover:bg-gray-50" aria-hidden="true"/>
                            <div class="relative min-w-0 items-center">
                              <div class="ml-4 w-full">
                                <p class="truncate text-sm text-gray-500">검색결과가 없습니다.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <ul role="list" class="flex-1 divide-y divide-gray-200 overflow-y-auto clickable" v-else>
                      <li v-for="(user, userIdx) in userData?.results || []" :key="user.id" @click="selectUser(user.id)">
                        <div class="group relative flex items-center px-5 py-6"
                             :class="userIdx === 0 ? 'border-t' : ''" >
                          <div class="-m-1 block flex-1 p-1">
                            <div class="absolute inset-0 group-hover:bg-gray-50" aria-hidden="true"/>
                            <div class="relative min-w-0 grid grid-cols-4 items-center text-left">
                              <div class="ml-4 col-span-1">
                                <p class="truncate text-sm text-gray-500">사용자명</p>
                                <p class="truncate font-medium text-gray-900">{{ user.username }}</p>
                              </div>
                              <div class="ml-4 col-span-1">
                                <p class="truncate text-sm text-gray-500">성명</p>
                                <p class="truncate font-medium text-gray-900">{{ user.name || '-' }}</p>
                              </div>
                              <div class="ml-4 col-span-1">
                                <p class="truncate text-sm text-gray-500">휴대전화</p>
                                <p class="truncate font-medium text-gray-900">{{ user.cellphone || '-' }}</p>
                              </div>
                              <div class="ml-4 col-span-1">
                                <p class="truncate text-sm text-gray-500">이메일</p>
                                <p class="truncate font-medium text-gray-900">{{ user.email || '-' }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div
                        class="flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between" v-if="userData">
                        <div>
                          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <a href="#" v-if="userData.previous_page !== null"
                               @click.prevent="navigatePage(userData.previous_page)"
                               class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                              <span class="sr-only">이전</span>
                              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true"/>
                            </a>
                            <template v-for="pageIndex in userData.page_list">
                              <template v-if="pageIndex === userData.current_page">
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
                            <a href="#" v-if="userData.next_page !== null"
                               @click.prevent="navigatePage(userData.next_page)"
                               class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                              <span class="sr-only">다음</span>
                              <ChevronRightIcon class="h-5 w-5" aria-hidden="true"/>
                            </a>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>


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
} from '@headlessui/vue'
import {XMarkIcon, ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/24/outline'
import {EllipsisVerticalIcon} from '@heroicons/vue/20/solid'
import {defaultTextInput} from "@/styles";
import {defineComponent} from "vue";
import getAllAffiliateList from "@/apis/affiliate/listAll";
import getUserList from "@/apis/user/list";
import getSetParty from "@/apis/vehicle/party";
import vehiclePartyParser from "@/utils/vehicle/vehiclePartyParser";

export default defineComponent({
  name: 'VehiclePartySelector',
  setup() {
    const errorState = useErrorStore()
    return {errorState, defaultTextInput}
  },
  components: {
    Dialog, DialogPanel, DialogTitle,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
    XMarkIcon, EllipsisVerticalIcon,
    ChevronLeftIcon, ChevronRightIcon
  },
  props: {
    openProp: {
      type: Boolean,
      required: false,
      default: false
    },
    labelString: {
      type: String,
      required: false,
      default: '차량관련자'
    },
    selectedVehicleParty: {
      type: Object,
      required: false,
      default: null
    },
  },
  emits: ['selectParty'],
  data() {
    return {
      open: false,
      tabs: [
        {name: '관계사', value: 'affiliate'},
        {name: '사용자', value: 'user'},
      ],
      selectedTab: 'affiliate',
      affiliates: [],
      userData: null,
      affiliateQuery: '',
      userQuery: '',
      selectedParty: null
    }
  },
  async mounted() {
    this.open = this.openProp
    if (this.open === true) {
      this.affiliates = await getAllAffiliateList()
    }
  },
  watch: {
    async open(newValue, oldValue) {
      if (newValue === oldValue) return
      if (newValue) {
        this.affiliates = await getAllAffiliateList()
        if (this.selectedTab === 'affiliate') {
          setTimeout(() => {this.$refs.affiliateInput.focus()}, 0)
        } else {
          setTimeout(() => {this.$refs.userInput.focus()}, 0)
        }
      }
    },
    async selectedTab(newValue, oldValue) {
      if (newValue === oldValue) return
      if (newValue === 'user') {
        this.userData = await getUserList()
      }
      if (newValue === 'affiliate') {
        setTimeout(() => {this.$refs.affiliateInput.focus()}, 0)
      } else {
        setTimeout(() => {this.$refs.userInput.focus()}, 0)
      }

    },
  },
  computed: {
    filteredAffiliates() {
      return this.affiliateQuery === '' ? this.affiliates : this.affiliates.filter((affiliate) => affiliate.name.search(this.affiliateQuery) > -1)
    }
  },
  methods: {
    vehiclePartyParser,
    async navigatePage(pageNo) {
      let params = {'page': pageNo}
      if (this.userQuery !== '') {
        params['query'] = this.userQuery
      }
      this.userData = await getUserList(params)
    },
    async searchPage() {
      let params = {'page': 1}
      if (this.userQuery !== '') {
        params['query'] = this.userQuery
      }
      this.userData = await getUserList(params)
    },
    async selectUser(userId) {
      const params = {user: userId}
      this.selectedParty = await getSetParty(params)
      this.$emit('selectParty', this.selectedParty.id)
      this.open = false
    },
    async selectAffiliate(affiliateId) {
      const params = {affiliate: affiliateId}
      this.selectedParty = await getSetParty(params)
      this.$emit('selectParty', this.selectedParty.id)
      this.open = false
    }
  }
})
</script>