<script setup>
import {useAuthStore} from "@/stores/auth";
import {useRoute, useRouter} from "vue-router";
import {Form, useForm} from 'vee-validate';
import {useErrorStore} from "@/stores/error";
import onlyDigitParser from "@/utils/common/onlyDigitParser";
import companyCreateSchema from "@/validators/collection/company/create";
import * as zod from "zod";
import {companyOriginTypeChoice, companyTypeChoice, companyWorkTypeChoice} from "@/choices/company";
import {defaultSelect, defaultTextInput} from "@/styles";
import onlyKorNumberParser from "@/utils/common/onlyKorNumberParser";
import {vehicleTypeChoice} from "@/choices/vehicle";
import AddressSelector from "@/components/common/AddressSelector.vue";
import FileUploadComponent from "@/components/common/FileUploadComponent.vue";
import createCollectionCompany from "@/apis/collection/company/create";
import UserSelector from "@/components/common/UserSelector.vue";
import {ref} from "vue";


const authStore = useAuthStore()
const errorStore = useErrorStore()
const router = useRouter()
const brnExists = ref(null)

const {
  values: formValues, errors: formErrors, handleSubmit: formHandleSubmit,
  defineInputBinds: formDefineInputBinds,
  setFieldValue: formSetFieldValue
} = useForm({validationSchema: companyCreateSchema});

const name = formDefineInputBinds('name')
const type = formDefineInputBinds('type')
const work_type = formDefineInputBinds('work_type')
const brn = formDefineInputBinds('brn')
const origin = formDefineInputBinds('origin')
const ceo_name = formDefineInputBinds('ceo_name')
const manager_name = formDefineInputBinds('manager_name')
const manager_tel = formDefineInputBinds('manager_tel')
const manager_hp = formDefineInputBinds('manager_hp')
const manager_email = formDefineInputBinds('manager_email')
const location = formDefineInputBinds('location')
// const address = formDefineInputBinds('address')
// const address_detail = formDefineInputBinds('address_detail')
// const address_data = formDefineInputBinds('address_data')
const registration = formDefineInputBinds('registration')
const recruiter = formDefineInputBinds('recruiter')



const onSubmit = formHandleSubmit(async values => {
  try {
    const response = await createCollectionCompany(values)
    if (response.status === 200) {
      await errorStore.set('success', '확인', '이미 등록된 거래처입니다.')
    } else {
      await errorStore.set('success', '성공', '거래처가 등록되었습니다.')
    }
    await router.push({name: 'collection_company_detail', params: {companyId: response.data.data.id}})
  } catch (e) {
    await errorStore.set('error', '등록 실패', e.toString())
  }
});
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">거래처 등록</h1>
      </div>
    </div>
    <div class="-mx-4 mt-10  sm:mx-0 sm:rounded-lg">
<!--      {{formValues}}-->
      <form @submit.prevent="onSubmit" method="post">
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="sm:col-span-3">
                <label for="brn" class="block text-sm font-medium leading-6 text-gray-900">사업자등록번호</label>
                <div class="mt-2 grid grid-cols-5 gap-x-2">
                  <div class="col-span-4">
                    <input type="text" name="brn" id="brn"  maxlength="10"
                           @input="formSetFieldValue('brn', onlyDigitParser($event.target.value))"
                           :value="brn.value"
                           :class="[...defaultTextInput]"/>
                  </div>
                  <div class="col-span-1 w-full">
                    <button type="submit"
                            class="rounded-md w-full bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      검색
                    </button>
                  </div>
                </div>
                <p class="mt-2 text-sm text-gray-500">10자리 숫자만 입력하세요</p>
                <p class="mt-2 text-sm text-red-600" id="rep-error" v-if="formErrors.brn">
                  {{formErrors.brn}}
                </p>
              </div>
            </div>
<!--            <template v-if="brnExists!==null">-->
              <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
                <div class="sm:col-span-3">
                  <label for="name" class="block text-sm font-medium leading-6 text-gray-900">거래처명 <span class="text-red-600">*</span></label>
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
                  <label for="type" class="block text-sm font-medium leading-6 text-gray-900">사업자유형 <span class="text-red-600">*</span></label>
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
                  <label for="work_type" class="block text-sm font-medium leading-6 text-gray-900">업무유형 <span class="text-red-600">*</span></label>
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
                  <label for="recruiter" class="block text-sm font-medium leading-6 text-gray-900">영업담당자</label>
                  <div class="mt-2">
                    <UserSelector @selectUser="(userId) => formSetFieldValue('recruiter', userId)"/>
                    <input type="text" name="recruiter" id="recruiter" v-bind="recruiter"
                           :class="[...defaultTextInput]" class="hidden"/>
                  </div>
                  <p class="mt-2 text-sm text-red-600" id="type-error" v-if="formErrors.recruiter">
                    {{ formErrors.recruiter }}
                  </p>
                </div>
              </div>
              <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                <div class="sm:col-span-3">
                  <label for="address" class="block text-sm font-medium leading-6 text-gray-900">소재지 주소</label>
                  <div class="mt-2">
                    <AddressSelector :placeholder-string="'소재지 주소'" :use-name="false" :open-prop="false" @selectLocation="(data) => {
                      console.log('data ', data)
                      formSetFieldValue('location', data)
                      // formSetFieldValue('address_data', data)
                    }"/>
                  </div>
                  <p class="mt-2 text-sm text-red-600" id="address-error" v-if="formErrors.address">
                    {{ formErrors.address }}
                  </p>
                </div>
<!--                <div class="sm:col-span-3">-->
<!--                  <label for="address_detail" class=" block text-sm font-medium leading-6 text-gray-900">소재지 상세 주소</label>-->
<!--                  <div class="mt-2">-->
<!--                    <input type="text" name="address_detail" id="address_detail" v-bind="address_detail"-->
<!--                           :class="[...defaultTextInput]"/>-->
<!--                  </div>-->
<!--                  <p class="mt-2 text-sm text-red-600" id="address_detail-error" v-if="formErrors.address_detail">-->
<!--                    {{ formErrors.address_detail }}-->
<!--                  </p>-->
<!--                </div>-->
                <div class="sm:col-span-2">
                  <label for="registration" class=" block text-sm font-medium leading-6 text-gray-900">사업자등록증</label>
                  <div class="mt-2">
                    <FileUploadComponent @deleteFileData="() => {formSetFieldValue('registration', null)}" @setFileData="(fileData) => {
                      formSetFieldValue('registration', fileData.id)
                    }"/>
                  </div>
                  <p class="mt-2 text-sm text-red-600" id="registration-error" v-if="formErrors.registration">
                    {{ formErrors.registration }}
                  </p>
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
                  <label for="manager_name" class="block text-sm font-medium leading-6 text-gray-900">담당자 전화번호</label>
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
<!--            </template>-->
          </div>
        </div>

<!--        <div class="mt-6 flex items-center justify-end gap-x-6" v-if="brnExists!==null">-->
        <div class="mt-6 flex items-center justify-end gap-x-6">
          <router-link :to="{name: 'collection_company_list'}" type="button" class="text-sm font-semibold leading-6 text-gray-900">
            취소
          </router-link>
          <button type="submit"
                  class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            저장
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
