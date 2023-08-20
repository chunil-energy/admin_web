<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white">
    <body class="h-full">
    ```
  -->
  <div>

    <Transition as="template" enter="ease-in-out duration-200" enter-from="opacity-0" enter-to="opacity-100"
                     leave="ease-in-out duration-200" leave-from="opacity-100" leave-to="opacity-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity h-full" style="z-index: 9999999999999999" v-if="layoutStore.showOverlay">
        <div class="flex justify-center items-center h-full">
          <div role="status">
            <svg aria-hidden="true" class="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </Transition>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
                         enter-to="opacity-100" leave="transition-opacity ease-linear duration-300"
                         leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80"/>
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                           enter-from="-translate-x-full" enter-to="translate-x-0"
                           leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                           leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                               enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100"
                               leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true"/>
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div class="flex h-16 shrink-0 items-center">
                  <img class="h-8 w-auto" src="@/assets/img/mark.svg" alt="천일"/>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <router-link v-if="!item.children" :to="{name: item.router_name}" @click="sidebarOpen = false"
                                       :class="[item.router_name === route.name ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                            <component :is="item.icon"
                                       :class="[item.router_name === route.name ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']"
                                       aria-hidden="true"/>
                            {{ item.name }}
                          </router-link>
                          <Disclosure as="div" v-else v-slot="{ open }">
                            <DisclosureButton
                                :class="[item.router_name === route.name ? 'bg-gray-50 text-indigo-600' : 'hover:bg-gray-50', 'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700']">
                              <component :is="item.icon" class="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true"/>
                              {{ item.name }}
                              <ChevronRightIcon
                                  :class="[open ? 'rotate-90 text-gray-500' : 'text-gray-400', 'ml-auto h-5 w-5 shrink-0']"
                                  aria-hidden="true"/>
                            </DisclosureButton>
                            <DisclosurePanel as="ul" class="mt-1 px-2">
                              <li v-for="subItem in item.children" :key="subItem.name">
                                <!-- 44px -->
                                <!--                        <DisclosureButton as="a" :href="subItem.href"-->
                                <DisclosureButton :as="RouterLink" :to="{name: subItem.router_name}"
                                                  @click="sidebarOpen = false"
                                                  :class="[subItem.router_name === route.name ? 'bg-gray-50 text-indigo-600' : 'hover:bg-gray-50', 'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700']">
                                  {{ subItem.name }}
                                </DisclosureButton>
                              </li>
                            </DisclosurePanel>
                          </Disclosure>
                        </li>
                        <li>
                          <a href="#" @click="logout"
                             :class="'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'">
                            <component :is="ArrowRightOnRectangleIcon"
                                       :class="'text-gray-400 group-hover:text-indigo-600 h-6 w-6 shrink-0'"
                                       aria-hidden="true"/>
                            로그아웃
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <div class="text-xs font-semibold leading-6 text-gray-400">외부 서비스</div>
                      <ul role="list" class="-mx-2 mt-2 space-y-1">
                        <li v-for="team in teams" :key="team.name">
                          <a :href="team.href"
                             class="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                            <span
                                class="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                              {{ team.initial }}
                            </span>
                            <span class="truncate">{{ team.name }}</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div :class="['hidden', 'lg:fixed', 'lg:inset-y-0', 'lg:z-50', 'lg:flex', 'lg:flex-col', desktopSidebarShow ? 'lg:w-72':'lg:w-16']" @mouseenter="() => desktopSidebarHover = true" @mouseleave="() => desktopSidebarHover = false">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto" src="@/assets/img/mark.svg" alt="천일"/>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">

                <li v-for="item in navigation" :key="item.name">
                  <router-link v-if="!item.children" :to="{name: item.router_name}"
                               :class="[item.router_name === route.name ? 'bg-gray-50 text-indigo-600' : 'hover:bg-gray-50', desktopSidebarShow ? '' : 'justify-center', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700']">
                    <component :is="item.icon" class="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true"/>
                    <template v-if="desktopSidebarShow">
                    {{ item.name }}
                    </template>
                  </router-link>
                  <Disclosure as="div" v-else v-slot="{ open }">
                    <DisclosureButton
                        :class="[item.router_name === route.name ? 'bg-gray-50 text-indigo-600' : 'hover:bg-gray-50', 'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700', desktopSidebarShow ? '' : 'justify-center']">
                      <component :is="item.icon" class="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true"/>
                      <template v-if="desktopSidebarShow">
                      {{ item.name }}
                      <ChevronRightIcon
                          :class="[open ? 'rotate-90 text-gray-500' : 'text-gray-400', 'ml-auto h-5 w-5 shrink-0']"
                          aria-hidden="true"/>
                      </template>
                    </DisclosureButton>
                    <template v-if="desktopSidebarShow">
                      <DisclosurePanel as="ul" class="mt-1 px-2">
                        <li v-for="subItem in item.children" :key="subItem.name">
                          <!-- 44px -->
                          <!--                        <DisclosureButton as="a" :href="subItem.href"-->
                          <DisclosureButton :as="RouterLink" :to="{name: subItem.router_name}"
                                            :class="[subItem.router_name === route.name ? 'bg-gray-50 text-indigo-600' : 'hover:bg-gray-50', 'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700']">
                            {{ subItem.name }}
                          </DisclosureButton>
                        </li>
                      </DisclosurePanel>
                    </template>
                  </Disclosure>
                </li>
                <li>
                  <button type="button" @click="logout" :class="[desktopSidebarShow ? '' : 'justify-center']"
                     class="text-gray-700 hover:text-indigo-600 w-full hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                    <component :is="ArrowRightOnRectangleIcon"
                               :class="'text-gray-400 group-hover:text-indigo-600 h-6 w-6 shrink-0'"
                               aria-hidden="true"/>
                    <template v-if="desktopSidebarShow">
                    로그아웃
                    </template>
                  </button>
                </li>

              </ul>
            </li>
          </ul>
            <!-- teams -->
<!--            <li v-if="desktopSidebarShow">-->
<!--              <div class="text-xs font-semibold leading-6 text-gray-400">외부 서비스</div>-->
<!--              <ul role="list" class="-mx-2 mt-2 space-y-1">-->
<!--                <li v-for="team in teams" :key="team.name">-->
<!--                  <a :href="team.href"-->
<!--                     class="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">-->
<!--                    <span-->
<!--                        class="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">{{-->
<!--                        team.initial-->
<!--                      }}</span>-->
<!--                    <span class="truncate">{{ team.name }}</span>-->
<!--                  </a>-->
<!--                </li>-->
<!--              </ul>-->
<!--            </li>-->

          <ul role="list" class="gap-y-7">
            <li class="-mx-6 mt-auto">
              <button type="button" @click="toggleDesktopSidebarLock"
                  class="flex items-center gap-x-4 px-6 py-3 w-full text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50" :class="[desktopSidebarShow ? '' : 'justify-center']">
                <template v-if="desktopSidebarLock">
                <LockClosedIcon
                    class="text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium bg-white"/>
                </template>
                <template v-else>
                  <LockOpenIcon
                      class="text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium bg-white"/>
                </template>

                <template v-if="desktopSidebarShow">
                  <template v-if="desktopSidebarLock">
                    <span class="sr-only">메뉴 고정 해제</span>
                    <span aria-hidden="true">메뉴 고정 해제</span>
                  </template>
                  <template v-else>
                    <span class="sr-only">메뉴 고정</span>
                    <span aria-hidden="true">메뉴 고정</span>
                  </template>
                </template>
              </button>
            </li>
            <li class="-mx-6 mt-auto">
              <router-link :to="{name: 'profile'}"
                           class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50" :class="[desktopSidebarShow ? '' : 'justify-center']">
                <!--                <img class="h-8 w-8 rounded-full bg-gray-50"-->
                <!--                     src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"-->
                <!--                     alt=""/>-->

                <span
                    class="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                  {{ authStore.profile.name ? authStore.profile.name[0] : authStore.profile.username[0] }}
                </span>
                <template v-if="desktopSidebarShow">
                  <span class="sr-only">{{ authStore.profile.name || authStore.profile.username }}</span>
                  <span aria-hidden="true">{{ authStore.profile.name || authStore.profile.username }}</span>
                </template>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <!-- Static sidebar for Mobile -->
    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
        <span class="sr-only">Open Sidebar</span>
        <Bars3Icon class="h-6 w-6" aria-hidden="true"/>
      </button>
      <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">{{ route.meta.name || '천일 관리자' }}</div>
      <router-link :to="{name: 'profile'}"
                   class="flex items-center gap-x-3 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                <span
                    class="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                  {{ authStore.profile.name[0] }}
                </span>
        <span class="sr-only">{{ authStore.profile.name || authStore.profile.username }}</span>
        <span aria-hidden="true">{{ authStore.profile.name || authStore.profile.username }}</span>
        <!--        <img class="h-8 w-8 rounded-full bg-gray-50"-->
        <!--             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"-->
        <!--             alt=""/>-->
      </router-link>
    </div>

    <main class="py-10" :class="['py-10', desktopSidebarShow ? 'lg:pl-72' : 'lg:pl-16']">
      <div class="px-4 sm:px-6 lg:px-8">
        <!-- Your content -->
        <router-view/>
      </div>
    </main>
  </div>
  <NotificationListComponent/>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue'
import {ChevronRightIcon, LockOpenIcon, LockClosedIcon} from '@heroicons/vue/20/solid'

import {
  Bars3Icon,
  HomeIcon,
  XMarkIcon,
  TruckIcon,
  HomeModernIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import {RouterLink, useRoute} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import NotificationListComponent from "@/components/NotificationList.vue";
import {useLayoutStore} from "@/stores/layout";

const route = useRoute()

const navigation = [
  {name: 'Home', router_name: 'home', icon: HomeIcon},
  {
    name: '사업장관리',
    icon: HomeModernIcon,
    children: [
      {name: '사업장 목록', router_name: 'affiliate_list'},
      // { name: 'Human Resources', href: '#' },
      // { name: 'Customer Success', href: '#' },
    ],
  },
  {
    name: '차량/기사관리',
    icon: TruckIcon,
    children: [
      {name: '차량목록', router_name: 'vehicle_list'},
      // { name: 'Human Resources', href: '#' },
      // { name: 'Customer Success', href: '#' },
    ],
  },
  // {
  //   name: 'Projects',
  //   icon: FolderIcon,
  //   current: false,
  //   children: [
  //     { name: 'GraphQL API', href: '#' },
  //     { name: 'iOS App', href: '#' },
  //     { name: 'Android App', href: '#' },
  //     { name: 'New Customer Portal', href: '#' },
  //   ],
  // },
  // { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  // { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
  // { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]
const teams = [
  {id: 1, name: '인계서 관리자', href: 'https://naver.com', initial: 'R', current: false},
  // { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  // { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]

// onMounted(() => {
//   route.matched.forEach((m) => {
//     console.log(m)})
// })


const authStore = useAuthStore()
const layoutStore = useLayoutStore()

const logout = () => {
  authStore.logout()
}
const sidebarOpen = ref(false)

const desktopSidebarLockStorage = localStorage.getItem('desktopSidebarLock')
const desktopSidebarLock = ref(desktopSidebarLockStorage ? JSON.parse(desktopSidebarLockStorage):true)
const desktopSidebarHover = ref(false)
const desktopSidebarShow = computed(() => {
  let show = true
  if (desktopSidebarLock.value === true) {
    show = true
  } else {
    show = desktopSidebarHover.value
  }
  console.log('show ', show)
  return show
})
const toggleDesktopSidebarLock = () => {
  const currentState = desktopSidebarLock.value
  desktopSidebarLock.value = !currentState
  localStorage.setItem('desktopSidebarLock', JSON.parse(desktopSidebarLock.value))
}
</script>