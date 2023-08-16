<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white">
    <body class="h-full">
    ```
  -->
  <div>
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
                                       :class="[item.router_name === this.$route.name ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                            <component :is="item.icon"
                                       :class="[item.router_name === this.$route.name ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']"
                                       aria-hidden="true"/>
                            {{ item.name }}
                          </router-link>
                          <Disclosure as="div" v-else v-slot="{ open }">
                            <DisclosureButton
                                :class="[item.router_name === this.$route.name ? 'bg-gray-50 text-indigo-600' : 'hover:bg-gray-50', 'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700']">
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
                                                  :class="[subItem.router_name === this.$route.name ? 'bg-gray-50 text-indigo-600' : 'hover:bg-gray-50', 'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700']">
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
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
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
                               :class="[item.router_name === this.$route.name ? 'bg-gray-50 text-indigo-600' : 'hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700']">
                    <component :is="item.icon" class="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true"/>
                    {{ item.name }}
                  </router-link>
                  <Disclosure as="div" v-else v-slot="{ open }">
                    <DisclosureButton
                        :class="[item.router_name === this.$route.name ? 'bg-gray-50 text-indigo-600' : 'hover:bg-gray-50', 'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700']">
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
                                          :class="[subItem.router_name === this.$route.name ? 'bg-gray-50 text-indigo-600' : 'hover:bg-gray-50', 'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700']">
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
            <!-- teams -->
            <li>
              <div class="text-xs font-semibold leading-6 text-gray-400">외부 서비스</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="team in teams" :key="team.name">
                  <a :href="team.href"
                     class="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                    <span
                        class="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">{{
                        team.initial
                      }}</span>
                    <span class="truncate">{{ team.name }}</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="-mx-6 mt-auto">
              <router-link :to="{name: 'profile'}"
                           class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                <!--                <img class="h-8 w-8 rounded-full bg-gray-50"-->
                <!--                     src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"-->
                <!--                     alt=""/>-->

                <span
                    class="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                  {{ authStore.profile.name ? authStore.profile.name[0] : authStore.profile.username[0] }}
                </span>
                <span class="sr-only">{{ authStore.profile.name || authStore.profile.username }}</span>
                <span aria-hidden="true">{{ authStore.profile.name || authStore.profile.username }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="h-6 w-6" aria-hidden="true"/>
      </button>
      <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">{{ this.$route.meta.name || '천일 관리자' }}</div>
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


<!--    <nav class="flex border-b border-gray-200 bg-white" aria-label="Breadcrumb">-->
<!--      <ol role="list" class="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8">-->
<!--        <li class="flex">-->
<!--          <div class="flex items-center">-->
<!--            <router-link :to="{name: 'home'}" class="text-gray-400 hover:text-gray-500">-->
<!--              <HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true"/>-->
<!--              <span class="sr-only">Home</span>-->
<!--            </router-link>-->
<!--          </div>-->
<!--        </li>-->
<!--        <li v-for="matched in route.matched" :key="matched.name" class="flex">-->
<!--          <div class="flex items-center">-->
<!--            <svg class="h-full w-6 flex-shrink-0 text-gray-200" viewBox="0 0 24 44" preserveAspectRatio="none"-->
<!--                 fill="currentColor" aria-hidden="true">-->
<!--              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"/>-->
<!--            </svg>-->
<!--            <template v-if="matched.name">-->
<!--            <router-link :to="{name: matched.name}" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"-->
<!--               :aria-current="matched.name === route.name ? 'page' : undefined">{{ matched.meta.name }}</router-link>-->
<!--            </template>-->
<!--            <template v-else>-->
<!--              <span class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"-->
<!--                 :aria-current="matched.name === route.name ? 'page' : undefined">{{ matched.meta.name }}</span>-->
<!--            </template>-->
<!--          </div>-->
<!--        </li>-->
<!--        &lt;!&ndash;        <li v-for="page in pages" :key="page.name" class="flex">&ndash;&gt;-->
<!--        &lt;!&ndash;          <div class="flex items-center">&ndash;&gt;-->
<!--        &lt;!&ndash;            <svg class="h-full w-6 flex-shrink-0 text-gray-200" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">&ndash;&gt;-->
<!--        &lt;!&ndash;              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />&ndash;&gt;-->
<!--        &lt;!&ndash;            </svg>&ndash;&gt;-->
<!--        &lt;!&ndash;            <a :href="page.href" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700" :aria-current="page.current ? 'page' : undefined">{{ page.name }}</a>&ndash;&gt;-->
<!--        &lt;!&ndash;          </div>&ndash;&gt;-->
<!--        &lt;!&ndash;        </li>&ndash;&gt;-->
<!--      </ol>-->
<!--    </nav>-->
    <main class="py-10 lg:pl-72">
      <div class="px-4 sm:px-6 lg:px-8">
        <!-- Your content -->
        <router-view/>
      </div>
    </main>
  </div>
  <NotificationListComponent/>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue'
import {ChevronRightIcon} from '@heroicons/vue/20/solid'

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
const logout = () => {
  authStore.logout()
}
const sidebarOpen = ref(false)
</script>