<script setup>
import {defineComponent, reactive, ref} from 'vue'
import getCompanyPrice from "@/apis/collection/company/getPrice";
import priceSchema from "@/validators/collection/price";
import {useForm} from "vee-validate";
import updateCompanyPrice from "@/apis/collection/company/updatePrice";
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useViewerStore} from "@/stores/viewer";
import {BanknotesIcon, BuildingOfficeIcon, UsersIcon} from "@heroicons/vue/20/solid";

const authStore = useAuthStore()
const errorStore = useErrorStore()
const router = useRouter()
const route = useRoute()
const companyId = parseInt(route.params.companyId)
const priceData = await getCompanyPrice(companyId)

const {
  values, errors, handleSubmit,
  defineInputBinds,
  setFieldValue
} = await useForm({validationSchema: priceSchema, initialValues: priceData});


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
    current: false
  },
  {
    name: '기본단가',
    value: 'price',
    to: {name: 'collection_company_price', params: {companyId: companyId}},
    icon: BanknotesIcon,
    current: true
  },
]

const price_1t_m_xs = defineInputBinds('price_1t_m_xs')
const price_1t_m_sm = defineInputBinds('price_1t_m_sm')
const price_1t_m_1o3 = defineInputBinds('price_1t_m_1o3')
const price_1t_m_1o2 = defineInputBinds('price_1t_m_1o2')
const price_1t_m_2o3 = defineInputBinds('price_1t_m_2o3')
const price_1t_m_1 = defineInputBinds('price_1t_m_1')

const price_1t_f_xs = defineInputBinds('price_1t_f_xs')
const price_1t_f_sm = defineInputBinds('price_1t_f_sm')
const price_1t_f_1o3 = defineInputBinds('price_1t_f_1o3')
const price_1t_f_1o2 = defineInputBinds('price_1t_f_1o2')
const price_1t_f_2o3 = defineInputBinds('price_1t_f_2o3')
const price_1t_f_1 = defineInputBinds('price_1t_f_1')

const price_1t_c_xs = defineInputBinds('price_1t_c_xs')
const price_1t_c_sm = defineInputBinds('price_1t_c_sm')
const price_1t_c_1o3 = defineInputBinds('price_1t_c_1o3')
const price_1t_c_1o2 = defineInputBinds('price_1t_c_1o2')
const price_1t_c_2o3 = defineInputBinds('price_1t_c_2o3')
const price_1t_c_1 = defineInputBinds('price_1t_c_1')

const price_1t_w_xs = defineInputBinds('price_1t_w_xs')
const price_1t_w_sm = defineInputBinds('price_1t_w_sm')
const price_1t_w_1o3 = defineInputBinds('price_1t_w_1o3')
const price_1t_w_1o2 = defineInputBinds('price_1t_w_1o2')
const price_1t_w_2o3 = defineInputBinds('price_1t_w_2o3')
const price_1t_w_1 = defineInputBinds('price_1t_w_1')

const price_25t_m_1 = defineInputBinds('price_25t_m_1')
const price_25t_f_1 = defineInputBinds('price_25t_f_1')
const price_25t_c_1 = defineInputBinds('price_25t_c_1')
const price_25t_w_1 = defineInputBinds('price_25t_w_1')

const onSubmit = handleSubmit(async value => {
  await updateCompanyPrice(companyId, value)
  await errorStore.set('success', '성공', '기본단가 정보가 저장되었습니다.')
  router.go(0)
})
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">{{ priceData.name }} 기본 단가</h1>
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


    <div class="-mx-4 mt-5  sm:mx-0 sm:rounded-lg">
      <div class="px-4 sm:px-6 lg:px-8" v-if="priceData">
        <form @submit.prevent="onSubmit">
          <div class="mt-8 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead>
                  <tr>
                    <th rowspan="2" scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">성상
                    </th>
                    <th colspan="6" scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">1톤
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">2.5톤</th>
                  </tr>
                  <tr>
                    <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">극소랑</th>
                    <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">소량기본</th>
                    <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">1/3차</th>
                    <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">1/2차</th>
                    <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">2/3차</th>
                    <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">1차</th>
                    <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">1차</th>
                  </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">혼합</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_m_xs" class="sr-only">price_1t_m_xs</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_m_xs" id="price_1t_m_xs"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 혼합 극소량" v-bind="price_1t_m_xs"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_m_xs-error" v-if="errors.price_1t_m_xs">
                          {{ errors.price_1t_m_xs }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_m_sm" class="sr-only">price_1t_m_sm</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_m_sm" id="price_1t_m_sm"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 혼합 소량기본" v-bind="price_1t_m_sm"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_m_sm-error" v-if="errors.price_1t_m_sm">
                          {{ errors.price_1t_m_sm }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_m_1o3" class="sr-only">price_1t_m_1o3</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_m_1o3" id="price_1t_m_1o3"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 혼합 1/3" v-bind="price_1t_m_1o3"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_m_1o3-error" v-if="errors.price_1t_m_1o3">
                          {{ errors.price_1t_m_1o3 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_m_1o2" class="sr-only">price_1t_m_1o2</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_m_1o2" id="price_1t_m_1o2"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 혼합 1/2" v-bind="price_1t_m_1o2"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_m_1o2-error" v-if="errors.price_1t_m_1o2">
                          {{ errors.price_1t_m_1o2 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_m_2o3" class="sr-only">price_1t_m_2o3</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_m_2o3" id="price_1t_m_2o3"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 혼합 2/3" v-bind="price_1t_m_2o3"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_m_2o3-error" v-if="errors.price_1t_m_2o3">
                          {{ errors.price_1t_m_2o3 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_m_1" class="sr-only">price_1t_m_1</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_m_1" id="price_1t_m_1"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 혼합 1차" v-bind="price_1t_m_1"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_m_1-error" v-if="errors.price_1t_m_1">
                          {{ errors.price_1t_m_1 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_25t_m_1" class="sr-only">price_25t_m_1</label>
                        <div class="mt-2">
                          <input type="number" name="price_25t_m_1" id="price_25t_m_1"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="2.5톤 혼합" v-bind="price_25t_m_1"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_25t_m_1-error" v-if="errors.price_25t_m_1">
                          {{ errors.price_25t_m_1 }}
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">합성</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_f_xs" class="sr-only">price_1t_f_xs</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_f_xs" id="price_1t_f_xs"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 합성 극소량" v-bind="price_1t_f_xs"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_f_xs-error" v-if="errors.price_1t_f_xs">
                          {{ errors.price_1t_f_xs }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_f_sm" class="sr-only">price_1t_f_sm</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_f_sm" id="price_1t_f_sm"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 합성 소량기본" v-bind="price_1t_f_sm"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_f_sm-error" v-if="errors.price_1t_f_sm">
                          {{ errors.price_1t_f_sm }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_f_1o3" class="sr-only">price_1t_f_1o3</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_f_1o3" id="price_1t_f_1o3"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 합성 1/3" v-bind="price_1t_f_1o3"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_f_1o3-error" v-if="errors.price_1t_f_1o3">
                          {{ errors.price_1t_f_1o3 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_f_1o2" class="sr-only">price_1t_f_1o2</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_f_1o2" id="price_1t_f_1o2"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 합성 1/2" v-bind="price_1t_f_1o2"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_f_1o2-error" v-if="errors.price_1t_f_1o2">
                          {{ errors.price_1t_f_1o2 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_f_2o3" class="sr-only">price_1t_f_2o3</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_f_2o3" id="price_1t_f_2o3"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 합성 2/3" v-bind="price_1t_f_2o3"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_f_2o3-error" v-if="errors.price_1t_f_2o3">
                          {{ errors.price_1t_f_2o3 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_f_1" class="sr-only">price_1t_f_1</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_f_1" id="price_1t_f_1"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 합성 1차" v-bind="price_1t_f_1"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_f_1-error" v-if="errors.price_1t_f_1">
                          {{ errors.price_1t_f_1 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_25t_f_1" class="sr-only">price_25t_f_1</label>
                        <div class="mt-2">
                          <input type="number" name="price_25t_f_1" id="price_25t_f_1"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="2.5톤 합성" v-bind="price_25t_f_1"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_25t_f_1-error" v-if="errors.price_25t_f_1">
                          {{ errors.price_25t_f_1 }}
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">폐콘</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_c_xs" class="sr-only">price_1t_c_xs</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_c_xs" id="price_1t_c_xs"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 폐콘 극소량" v-bind="price_1t_c_xs"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_c_xs-error" v-if="errors.price_1t_c_xs">
                          {{ errors.price_1t_c_xs }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_c_sm" class="sr-only">price_1t_c_sm</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_c_sm" id="price_1t_c_sm"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 폐콘 소량기본" v-bind="price_1t_c_sm"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_c_sm-error" v-if="errors.price_1t_c_sm">
                          {{ errors.price_1t_c_sm }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_c_1o3" class="sr-only">price_1t_c_1o3</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_c_1o3" id="price_1t_c_1o3"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 폐콘 1/3" v-bind="price_1t_c_1o3"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_c_1o3-error" v-if="errors.price_1t_c_1o3">
                          {{ errors.price_1t_c_1o3 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_c_1o2" class="sr-only">price_1t_c_1o2</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_c_1o2" id="price_1t_c_1o2"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 폐콘 1/2" v-bind="price_1t_c_1o2"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_c_1o2-error" v-if="errors.price_1t_c_1o2">
                          {{ errors.price_1t_c_1o2 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_c_2o3" class="sr-only">price_1t_c_2o3</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_c_2o3" id="price_1t_c_2o3"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 폐콘 2/3" v-bind="price_1t_c_2o3"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_c_2o3-error" v-if="errors.price_1t_c_2o3">
                          {{ errors.price_1t_c_2o3 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_c_1" class="sr-only">price_1t_c_1</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_c_1" id="price_1t_c_1"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 폐콘 1차" v-bind="price_1t_c_1"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_c_1-error" v-if="errors.price_1t_c_1">
                          {{ errors.price_1t_c_1 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_25t_c_1" class="sr-only">price_25t_c_1</label>
                        <div class="mt-2">
                          <input type="number" name="price_25t_c_1" id="price_25t_c_1"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="2.5톤 폐콘" v-bind="price_25t_c_1"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_25t_c_1-error" v-if="errors.price_25t_c_1">
                          {{ errors.price_25t_c_1 }}
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">폐목</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_w_xs" class="sr-only">price_1t_w_xs</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_w_xs" id="price_1t_w_xs"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 폐목 극소량" v-bind="price_1t_w_xs"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_w_xs-error" v-if="errors.price_1t_w_xs">
                          {{ errors.price_1t_w_xs }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_w_sm" class="sr-only">price_1t_w_sm</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_w_sm" id="price_1t_w_sm"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 폐목 소량기본" v-bind="price_1t_w_sm"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_w_sm-error" v-if="errors.price_1t_w_sm">
                          {{ errors.price_1t_w_sm }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_w_1o3" class="sr-only">price_1t_w_1o3</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_w_1o3" id="price_1t_w_1o3"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 폐목 1/3" v-bind="price_1t_w_1o3"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_w_1o3-error" v-if="errors.price_1t_w_1o3">
                          {{ errors.price_1t_w_1o3 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_w_1o2" class="sr-only">price_1t_w_1o2</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_w_1o2" id="price_1t_w_1o2"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 폐목 1/2" v-bind="price_1t_w_1o2"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_w_1o2-error" v-if="errors.price_1t_w_1o2">
                          {{ errors.price_1t_w_1o2 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_w_2o3" class="sr-only">price_1t_w_2o3</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_w_2o3" id="price_1t_w_2o3"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 폐목 2/3" v-bind="price_1t_w_2o3"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_w_2o3-error" v-if="errors.price_1t_w_2o3">
                          {{ errors.price_1t_w_2o3 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_1t_w_1" class="sr-only">price_1t_w_1</label>
                        <div class="mt-2">
                          <input type="number" name="price_1t_w_1" id="price_1t_w_1"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="1톤 폐목 1차" v-bind="price_1t_w_1"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_1t_w_1-error" v-if="errors.price_1t_w_1">
                          {{ errors.price_1t_w_1 }}
                        </p>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div>
                        <label for="price_25t_w_1" class="sr-only">price_25t_w_1</label>
                        <div class="mt-2">
                          <input type="number" name="price_25t_w_1" id="price_25t_w_1"
                                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                 placeholder="2.5톤 폐목" v-bind="price_25t_w_1"/>
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="price_25t_w_1-error" v-if="errors.price_25t_w_1">
                          {{ errors.price_25t_w_1 }}
                        </p>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="-mx-4 mt-6 flex items-center justify-end gap-x-6">
            <button type="submit"
                    class="w-24 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>