<script setup>
import {useAuthStore} from "@/stores/auth";
import {useRoute, useRouter} from "vue-router";
import {Form, useForm} from 'vee-validate';
import {useErrorStore} from "@/stores/error";
import onlyDigitParser from "@/utils/common/onlyDigitParser";
import {companyTypeChoice, companyWorkTypeChoice} from "@/choices/company";
import {defaultSelect, defaultTextInput, disabledTextInput} from "@/styles";
import getCompany from "@/apis/collection/company/get";
import NaverMapComponent from "@/components/common/NaverMapComponent.vue";
import dateTimeParser from "@/utils/common/dateTimeParser";

import {BuildingOfficeIcon, BanknotesIcon, UsersIcon} from '@heroicons/vue/20/solid'
import {ref, computed} from "vue";
import userParser from "@/utils/common/userParser";
import companyUpdateSchema from "@/validators/collection/company/update";
import brnParser from "@/utils/common/brnParser";
import {useViewerStore} from "@/stores/viewer";
import getRegistration from "@/apis/collection/company/getRegistration";

const authStore = useAuthStore()
const errorStore = useErrorStore()
const viewerStore = useViewerStore()
const router = useRouter()
const route = useRoute()
const companyId = parseInt(route.params.companyId)
const companyData = ref(null)


const tabs = [
  {
    name: '기본정보',
    value: 'default',
    to: {name: 'collection_company_detail', params: {companyId: companyId}},
    icon: BuildingOfficeIcon,
    current: true
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
    current: false
  },
]


companyData.value = await getCompany(companyId)

const masterCompanyData = computed(() => {
  return companyData.value?.master
})

const {
  values: formValues, errors: formErrors, handleSubmit: formHandleSubmit,
  defineInputBinds: formDefineInputBinds,
  setFieldValue: formSetFieldValue
} = useForm({validationSchema: companyUpdateSchema, initialValues: masterCompanyData});

const name = formDefineInputBinds('name')
const type = formDefineInputBinds('type')
const work_type = formDefineInputBinds('work_type')
const ceo_name = formDefineInputBinds('ceo_name')
const manager_name = formDefineInputBinds('manager_name')
const manager_tel = formDefineInputBinds('manager_tel')
const manager_hp = formDefineInputBinds('manager_hp')
const manager_email = formDefineInputBinds('manager_email')


const onSubmit = formHandleSubmit(async values => {
  alert('업데이트 기능 개발중')
  // try {
  //   const response = await createCollectionCompany(values)
  //   if (response.status === 200) {
  //     await this.errorStore.set('success', '확인', '이미 등록된 거래처입니다.')
  //   } else {
  //     await this.errorStore.set('success', '성공', '거래처가 등록되었습니다.')
  //   }
  //   this.router.push({name: 'collection_company_list'})
  // } catch (e) {
  //   await this.errorStore.set('error', '등록 실패', e.toString())
  // }
})


const showRegistration = async () => {
  const registrationData = await getRegistration(companyId)
  await viewerStore.showViewer(registrationData.url)
}

</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">{{ masterCompanyData.name }}</h1>
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
      <form @submit.prevent="onSubmit" method="post">
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="sm:col-span-3">
                <label for="name" class="block text-sm font-medium leading-6 text-gray-900">거래처명 <span
                    class="text-red-600">*</span></label>
                <div class="mt-2">
                  <input type="text" id="name" name="name" :class="[...defaultTextInput]"
                         v-bind="name"
                  >
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  사업자일 경우 업체명, 개인일 경우 개인 성명
                </p>
                <p class="mt-2 text-sm text-red-600" id="name-error" v-if="formErrors.name">
                  {{ formErrors.name }}
                </p>
              </div>
              <div class="sm:col-span-3">
                <label for="type" class="block text-sm font-medium leading-6 text-gray-900">사업자유형 <span
                    class="text-red-600">*</span></label>
                <div class="mt-2">
                  <select id="type" name="type" :class="[...defaultSelect]" v-bind="type">
                    <option value="" disabled selected>선택</option>
                    <template v-for="[companyTypeValue, companyTypeName] in Object.entries(companyTypeChoice)"
                              v-bind:key="companyTypeValue">
                      <option :value="companyTypeValue">{{ companyTypeName }}</option>
                    </template>
                  </select>
                </div>
                <p class="mt-2 text-sm text-red-600" id="type-error" v-if="formErrors.type">
                  {{ formErrors.type }}
                </p>
              </div>
              <div class="sm:col-span-3">
                <label for="work_type" class="block text-sm font-medium leading-6 text-gray-900">업무유형 <span
                    class="text-red-600">*</span></label>
                <div class="mt-2">
                  <select id="work_type" name="work_type" :class="[...defaultSelect]" v-bind="work_type">
                    <option value="" disabled selected>선택</option>
                    <template v-for="[workTypeValue, workTypeName] in Object.entries(companyWorkTypeChoice)"
                              v-bind:key="workTypeValue">
                      <option :value="workTypeValue">{{ workTypeName }}</option>
                    </template>
                  </select>
                </div>
                <p class="mt-2 text-sm text-red-600" id="work_type-error" v-if="formErrors.work_type">
                  {{ formErrors.work_type }}
                </p>
              </div>
            </div>

            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">


              <div class="sm:col-span-2">
                <label for="brn" class="block text-sm font-medium leading-6 text-gray-900">사업자등록번호</label>
                <div class="mt-2">
                  <input type="text" name="brn" id="brn" readonly disabled
                         :class="[...disabledTextInput]"
                         :value="masterCompanyData.brn ? brnParser(masterCompanyData.brn) : null"/>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label for="ceo_name" class="block text-sm font-medium leading-6 text-gray-900">대표자명</label>
                <div class="mt-2">
                  <input type="text" name="ceo_name" id="ceo_name" v-bind="ceo_name"
                         :class="[...defaultTextInput]"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="type-error" v-if="formErrors.ceo_name">
                  {{ formErrors.ceo_name }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label for="recruiter" class="block text-sm font-medium leading-6 text-gray-900">영업 담당자</label>
                <div class="mt-2">
                  <input type="text" name="recruiter" id="recruiter" readonly disabled
                         :class="[...disabledTextInput]"
                         :value="companyData.recruiter ? userParser(companyData.recruiter): null"/>
                </div>
              </div>
            </div>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
              <div class="sm:col-span-2">
                <label for="manager_name" class="block text-sm font-medium leading-6 text-gray-900">담당자명</label>
                <div class="mt-2">
                  <input type="text" name="manager_name" id="manager_name" v-bind="manager_name"
                         :class="[...defaultTextInput]"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="manager_name-error" v-if="formErrors.manager_name">
                  {{ formErrors.manager_name }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label for="manager_tel" class="block text-sm font-medium leading-6 text-gray-900">담당자 전화번호</label>
                <div class="mt-2">
                  <input type="text" name="manager_tel" id="manager_tel" v-bind="manager_tel"
                         @input="formSetFieldValue('manager_tel', onlyDigitParser($event.target.value))"
                         :value="manager_tel.value"
                         :class="[...defaultTextInput]"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="manager_tel-error" v-if="formErrors.manager_tel">
                  {{ formErrors.manager_tel }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label for="manager_hp" class="block text-sm font-medium leading-6 text-gray-900">담당자 휴대전화번호</label>
                <div class="mt-2">
                  <input type="text" name="manager_hp" id="manager_hp" v-bind="manager_hp"
                         @input="formSetFieldValue('manager_hp', onlyDigitParser($event.target.value))"
                         :value="manager_hp.value"
                         :class="[...defaultTextInput]"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="manager_hp-error" v-if="formErrors.manager_hp">
                  {{ formErrors.manager_hp }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label for="manager_email" class="block text-sm font-medium leading-6 text-gray-900">담당자 이메일</label>
                <div class="mt-2">
                  <input type="email" name="manager_email" id="manager_email" v-bind="manager_email"
                         :class="[...defaultTextInput]"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="manager_email-error" v-if="formErrors.manager_email">
                  {{ formErrors.manager_email }}
                </p>
              </div>
            </div>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
              <div class="sm:col-span-4">
                <label for="location" class="block text-sm font-medium leading-6 text-gray-900">소재지</label>
                <template v-if="masterCompanyData.location">
                  <div class="mt-2">
                    <p>{{ masterCompanyData.location.address }} {{ masterCompanyData.location.address_detail }}</p>
                  </div>
                  <div class="mt-2">
                    <NaverMapComponent :location-data-prop="masterCompanyData.location" :map-type="'dynamic'"/>
                  </div>
                </template>
                <template v-else>
                  <div class="mt-2">
                    <p>미등록</p>
                  </div>
                </template>
              </div>
              <div class="sm:col-span-4">
                <label for="brn" class="block text-sm font-medium leading-6 text-gray-900">사업자등록증</label>
                <div class="mt-2">
                  <template v-if="masterCompanyData.registration">
                    <ul role="list" class="grid grid-cols-1 gap-2">
                      <li v-for="(brnImageData, brnImageIndex) in [masterCompanyData.registration]"
                          :key="brnImageData.id"
                          @click.prevent="showRegistration(brnImageData.id)"
                          class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white border border-gray-300 clickable">
                        <div class="flex flex-col items-start space-y-1 p-4">
                          <div class="text-sm font-medium text-gray-400">{{
                              dateTimeParser(brnImageData.registered_at)
                            }}
                          </div>
                          <div class="text-sm font-medium text-gray-900 truncate">{{ brnImageData.filename }}</div>
                        </div>
                      </li>
                    </ul>

                  </template>
                  <template v-else>
                    미등록
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div class="mt-6 flex items-center justify-end gap-x-6">
          <router-link :to="{name: 'collection_company_list'}" type="button"
                       class="text-sm font-semibold leading-6 text-gray-900">
            취소
          </router-link>
          <button type="submit"
                  class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            저장
          </button>
        </div>
      </form>
    </div>
    <!--    <div class="-mx-4 mt-5  sm:mx-0 sm:rounded-lg" v-if="selectedTab === 'user'">-->
    <!--      user-->
    <!--    </div>-->
    <!--    <PriceTableComponent v-if="selectedTab === 'price'" :company-id="companyId"/>-->
  </div>
</template>
