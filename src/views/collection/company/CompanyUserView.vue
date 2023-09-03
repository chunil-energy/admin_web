<script>
import priceSchema from "@/validators/collection/price";
import {useForm} from "vee-validate";
import updateCompanyPrice from "@/apis/collection/company/updatePrice";
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {BanknotesIcon, BuildingOfficeIcon, UsersIcon} from "@heroicons/vue/20/solid";
import getUserList from "@/apis/collection/company/getUserList";
import {ref} from "vue";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/20/solid'
import getCompany from "@/apis/collection/company/get";
import userParser from "../../../utils/common/userParser";
import phoneNumberParser from "../../../utils/common/phoneNumberParser";
import {CheckCircleIcon, XCircleIcon} from '@heroicons/vue/24/outline'
export default {
  methods: {phoneNumberParser, userParser},
  components: {ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, XCircleIcon},
  setup() {
    const authStore = useAuthStore()
    const errorStore = useErrorStore()
    const router = useRouter()
    const route = useRoute()
    const companyId = parseInt(route.params.companyId)
    const userData = ref(null)
    const companyData = ref(null)
    const currentPage = route.query.page ? parseInt(route.query.page) : 1
    const tabs = [
      {
        name: '기본정보',
        value: 'default',
        to: {name: 'collection_company_detail', params: {companyId: companyId}},
        icon: BuildingOfficeIcon,
        current: false
      },
      {
        name: '직원',
        value: 'user',
        to: {name: 'collection_company_user', params: {companyId: companyId}},
        icon: UsersIcon,
        current: true
      },
      {
        name: '기본단가',
        value: 'price',
        to: {name: 'collection_company_price', params: {companyId: companyId}},
        icon: BanknotesIcon,
        current: false
      },
    ]
    try {
      getUserList(companyId, route.query).then((responseData) => {
        userData.value = responseData
      })
      getCompany(companyId).then((responseData) => {
        companyData.value = responseData
      })
    } catch (e) {
      console.log(e)
    }
    return {
      authStore, errorStore, router, route, companyId, userData, companyData, tabs, currentPage
    }
  },
  computed: {
    masterCompanyData() {
      return this.companyData?.master
    }
  }
}

</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">{{ masterCompanyData?.name }} 직원</h1>
      </div>
    </div>
    <div class="-mx-4 mt-10">
      <!--      <div class="sm:hidden">-->
      <!--        <label for="tabs">섹션 선택</label>-->
      <!--        &lt;!&ndash; Use an "onChange" listener to redirect the user to the selected tab URL. &ndash;&gt;-->
      <!--        <select id="tabs" name="tabs"-->
      <!--                class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"-->
      <!--                @change="router.push($event.target.value.value)">-->
      <!--          <option v-for="tab in tabs" :key="tab.name" :value="tab.href" :selected="tab.current">-->
      <!--            {{ tab.name }}-->
      <!--          </option>-->
      <!--        </select>-->
      <!--      </div>-->
      <div class="hidden sm:block">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <router-link :to="tab.to" v-for="tab in tabs" :key="tab.name"
                         :class="[tab.current ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium']"
                         :aria-current="tab.current ? 'page' : undefined">
              <component :is="tab.icon"
                         :class="[tab.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500', '-ml-0.5 mr-2 h-5 w-5']"
                         aria-hidden="true"/>
              <span>{{ tab.name }}</span>
            </router-link>
          </nav>
        </div>
      </div>
    </div>



<!--      <div class="px-4 sm:px-6 lg:px-8">-->
        <div class="mt-10 sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-base font-semibold leading-6 text-gray-900">거래처 직원 목록</h1>
            <!--        <p class="mt-2 text-sm text-gray-700">Your team is on the <strong-->
            <!--            class="font-semibold text-gray-900">Startup</strong> vehicle. The next payment of $80 will be due on August 4,-->
            <!--          2022.</p>-->
          </div>
          <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <router-link type="button" :to="{name: 'collection_company_user_create', params: {companyId}}"
                         class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              신규 직원 등록
            </router-link>
          </div>
        </div>

        <form method="get" id="queryForm" hidden="hidden">
          <input type="number" name="page" id="queryFormPage" :value="currentPage">
        </form>
        <div class="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
            <tr>
              <th scope="col" class="py-3.5 pl-5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                성명
              </th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                사용자
              </th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                직급
              </th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                전화번호
              </th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                휴대전화번호
              </th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                이메일
              </th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                관리자
              </th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Select</span>
              </th>
            </tr>
            </thead>
            <tbody>
            <template v-if="userData?.results">
              <tr v-for="(ud, udIndex) in userData?.results"
                  :key="ud.id">
                <td :class="[udIndex === 0 ? '' : 'border-t border-gray-200', 'hidden pl-6 pr-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
                  {{ ud.name || '' }}
                </td>
                <td :class="[udIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
                  {{ ud.user ? userParser(ud.user) : '미지정' }}
                </td>
                <td :class="[udIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
                  {{ ud.grade || '' }}
                </td>
                <td :class="[udIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
                  {{ ud.tel ? phoneNumberParser(ud.tel) : '' }}
                </td>
                <td :class="[udIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
                  {{ ud.hp ? phoneNumberParser(ud.hp) : '' }}
                </td>
                <td :class="[udIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
                  {{ ud.email || '' }}
                </td>
                <td :class="[udIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
<!--                  {{ ud.is_owner || '' }}-->
                  <template v-if="ud.is_owner === true">
                    <CheckCircleIcon class="w-6 h-6 text-green-400"/>
                  </template>
                  <template v-else>
                    <XCircleIcon class="w-6 h-6 text-red-400"/>
                  </template>
                </td>
                <td :class="[udIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
                  <router-link type="button"
                               :to="{name: 'collection_company_user_detail', params: {companyId, userId: ud.id}}"
                               class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  >
                    자세히<span class="sr-only">, {{ ud.name }}</span>
                  </router-link>
                  <div v-if="udIndex !== 0" class="absolute -top-px left-0 right-6 h-px bg-gray-200"/>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td class="hidden px-5 py-3.5 text-sm text-gray-500 lg:table-cell text-center" colspan="9">결과없음</td>
              </tr>
            </template>
            </tbody>
          </table>
          <div class="flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-white px-4 py-3 sm:px-6" v-if="userData?.results">
            <div class="flex flex-1 justify-between sm:hidden">
              <a href="#"
                 class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
              <a href="#"
                 class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  {{ userData.count.toLocaleString() }}개 중 {{ userData.results.length }} 개 표시
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
<!--                  <a href="#" v-if="userData.previous !== null" @click.prevent="navigatePage(currentPage - 1)"-->
                  <a href="#" v-if="userData.previous !== null"
                     class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span class="sr-only">이전</span>
                    <ChevronLeftIcon class="h-5 w-5" aria-hidden="true"/>
                  </a>
                  <template v-for="pageIndex in Math.ceil(userData.count/20)">

                    <template v-if="pageIndex >= currentPage-5 && pageIndex <= currentPage+5">
                      <template v-if="pageIndex === currentPage">
<!--                        <a href="#" aria-current="page" @click.prevent="navigatePage(pageIndex)"-->
                        <a href="#" aria-current="page"
                           class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{ pageIndex }}</a>
                      </template>
                      <template v-else>
<!--                        <a href="#" @click.prevent="navigatePage(pageIndex)"-->
                        <a href="#"
                           class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{{ pageIndex }}</a>
                      </template>
                    </template>
                  </template>
<!--                  <a href="#" v-if="userData.next !== null" @click.prevent="navigatePage(currentPage + 1)"-->
                  <a href="#" v-if="userData.next !== null"
                     class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span class="sr-only">다음</span>
                    <ChevronRightIcon class="h-5 w-5" aria-hidden="true"/>
                  </a>
                </nav>
              </div>
            </div>
          </div>


        </div>
<!--      </div>-->
    </div>

</template>

<style scoped>

</style>