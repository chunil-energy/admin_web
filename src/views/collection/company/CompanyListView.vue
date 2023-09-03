<script>
import {useAuthStore} from "@/stores/auth";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/20/solid'
import {useRoute} from "vue-router";
import getAffiliateList from "@/apis/affiliate/list";
import onlyDigitParser from "@/utils/common/onlyDigitParser"
import brnParser from "@/utils/common/brnParser";
import corpRegisterNoParser from "@/utils/common/corpRegisterNoParser";
import getCollectionCompanyList from "@/apis/collection/company/list";
import {companyTypeChoice, companyWorkTypeChoice} from "@/choices/company";
import phoneNumberParser from "@/utils/common/phoneNumberParser";

export default {
  name: 'CompanyListView',
  computed: {
    companyWorkTypeChoice() {
      return companyWorkTypeChoice
    },
    companyTypeChoice() {
      return companyTypeChoice
    }
  },
  async setup() {
    const authStore = useAuthStore()
    const route = useRoute()
    const currentPage = route.query.page ? parseInt(route.query.page) : 1
    const pageSize = route.query.pagesize ? parseInt(route.query.pagesize) : 20
    const collectionCompanyList = await getCollectionCompanyList({page: currentPage})
    return {authStore, currentPage, pageSize, collectionCompanyList}
  },
  components: {
    'chevron-left-icon': ChevronLeftIcon,
    'chevron-right-icon': ChevronRightIcon,
  },
  methods: {
    phoneNumberParser,
    corpRegisterNoParser,
    brnParser,
    onlyDigitParser,
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
        <h1 class="text-base font-semibold leading-6 text-gray-900">거래처 목록</h1>
        <!--        <p class="mt-2 text-sm text-gray-700">Your team is on the <strong-->
        <!--            class="font-semibold text-gray-900">Startup</strong> vehicle. The next payment of $80 will be due on August 4,-->
        <!--          2022.</p>-->
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <router-link type="button" :to="{name: 'collection_company_create'}"
                     class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          신규 거래처 등록
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
          <th scope="col" class="py-3.5 pl-5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
            거래처명
          </th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
            사업자유형
          </th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
            업무유형
          </th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
            사업자등록번호
          </th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
            대표자명
          </th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
            담당자명
          </th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
            담당자 전화/휴대전화
          </th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
            담당자 이메일
          </th>
          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span class="sr-only">Select</span>
          </th>
        </tr>
        </thead>
        <tbody>

        <template v-if="collectionCompanyList?.results">
          <!--          {{collectionCompany}}-->
          <tr v-for="(collectionCompany, collectionCompanyIdx) in collectionCompanyList?.results"
               :key="collectionCompany.id">
            <td :class="[collectionCompanyIdx === 0 ? '' : 'border-t border-gray-200', 'hidden pl-5 pr-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
              {{ collectionCompany.master.name }}
            </td>
            <td :class="[collectionCompanyIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
              {{ companyTypeChoice[collectionCompany.master.type] }}
            </td>
            <td :class="[collectionCompanyIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
              {{ companyWorkTypeChoice[collectionCompany.master.work_type] }}
            </td>
            <td :class="[collectionCompanyIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
              {{ collectionCompany.master.brn ? brnParser(collectionCompany.master.brn) : null }}
            </td>
            <td :class="[collectionCompanyIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
              {{ collectionCompany.master.ceo_name }}
            </td>
            <td :class="[collectionCompanyIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
              {{ collectionCompany.master.manager_name }}
            </td>
            <td :class="[collectionCompanyIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
              <div>{{
                  collectionCompany.master.manager_tel ? phoneNumberParser(collectionCompany.master.manager_tel) : null
                }}
              </div>
              <div>{{
                  collectionCompany.master.manager_hp ? phoneNumberParser(collectionCompany.master.manager_hp) : null
                }}
              </div>
            </td>
            <td :class="[collectionCompanyIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
              {{ collectionCompany.master.manager_email }}
            </td>
            <td :class="[collectionCompanyIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
              <router-link type="button"
                           :to="{name: 'collection_company_detail', params: {companyId: collectionCompany.id}}"
                           class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
              >
                자세히<span class="sr-only">, {{ collectionCompany.master.name }}</span>
              </router-link>
              <div v-if="collectionCompanyIdx !== 0" class="absolute -top-px left-0 right-6 h-px bg-gray-200"/>
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
      <div class="flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-white px-4 py-3 sm:px-6" v-if="collectionCompanyList?.results">
        <div class="flex flex-1 justify-between sm:hidden">
          <a href="#"
             class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
          <a href="#"
             class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              {{ collectionCompanyList.count.toLocaleString() }}개 중 {{ pageSize }} 개 표시
              <!--              Showing<span class="font-medium"> {{(currentPage-1) * pageSize + 1}}</span>-->
              <!--              {{ ' ' }}-->
              <!--              to-->
              <!--              {{ ' ' }}-->
              <!--              <span class="font-medium">{{(currentPage) * pageSize}}</span>-->
              <!--              {{ ' ' }}-->
              <!--              of-->
              <!--              {{ ' ' }}-->
              <!--              <span class="font-medium">{{ collectionCompanyList.count }}</span>-->
              <!--              {{ ' ' }}-->
              <!--              results-->
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <a href="#" v-if="collectionCompanyList.previous !== null" @click.prevent="navigatePage(currentPage - 1)"
                 class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <span class="sr-only">이전</span>
                <chevron-left-icon class="h-5 w-5" aria-hidden="true"/>
              </a>
              <template v-for="pageIndex in Math.ceil(collectionCompanyList.count/pageSize)">

                <template v-if="pageIndex >= currentPage-5 && pageIndex <= currentPage+5">
                  <template v-if="pageIndex === currentPage">
                    <a href="#" aria-current="page" @click.prevent="navigatePage(pageIndex)"
                       class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{ pageIndex }}</a>
                  </template>
                  <template v-else>
                    <a href="#" @click.prevent="navigatePage(pageIndex)"
                       class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{{ pageIndex }}</a>
                  </template>
                </template>
              </template>
              <a href="#" v-if="collectionCompanyList.next !== null" @click.prevent="navigatePage(currentPage + 1)"
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
