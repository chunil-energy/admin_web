<template>
  <div class="grid grid-cols-12 items-center gap-2">
    <div :class="selectedUser ? 'col-span-10' : 'col-span-12'">
      <input type="text" id="owner_party_display" name="vehicle_party_display" @click="open = !open" readonly :placeholder="placeholderString"
             :class="[...defaultTextInput, 'clickable']" :value="selectedUser ? userParser(selectedUser) : ''">
    </div>
    <div :class="selectedUser ? 'col-span-2' : 'hidden'">
      <XMarkIcon class="w-5 h-5" @click="clearUser"></XMarkIcon>
    </div>
  </div>
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
                      <li v-for="(user, userIdx) in userData?.results || []" :key="user.id" @click="selectUser(user)">
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
import getUserList from "@/apis/user/list";
import userParser from "@/utils/common/userParser";

export default defineComponent({
  name: 'UserSelector',
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
    placeholderString: {
      type: String,
      required: false,
      default: ''
    },
    labelString: {
      type: String,
      required: false,
      default: '임직원'
    },
    initialUser: {
      type: Object,
      required: false,
      default: null
    },
  },
  emits: ['selectUser'],
  data() {
    return {
      open: false,
      userData: null,
      userQuery: '',
      selectedUser: null
    }
  },
  async mounted() {
    this.open = this.openProp
    if (this.initialUser) {
      this.selectedUser = this.initialUser
      this.$emit('selectUser', this.selectedUser.id)
    }
  },
  watch: {
    async open(newValue, oldValue) {
      if (newValue === oldValue) return
      if (newValue) {
        this.userData = await getUserList()
        setTimeout(() => {this.$refs.userInput.focus()}, 0)
      }
    }
  },
  methods: {
    userParser,
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
    async selectUser(userData) {
      this.selectedUser = userData
      this.$emit('selectUser', this.selectedUser.id)
      this.open = false
    },
    clearUser() {
      this.selectedUser = null
      this.$emit('selectUser', null)
    }
  }
})
</script>