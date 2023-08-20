<script setup>
import {useAuthStore} from "@/stores/auth";
import {useRoute, useRouter} from "vue-router";
import getAffiliate from "@/apis/affiliate/get";
import {Form, useForm} from 'vee-validate';
import affiliateCreateSchema from "@/validators/affiliate/create";
import {useErrorStore} from "@/stores/error";
import {onMounted, ref} from "vue";
import updateAffiliate from "@/apis/affiliate/update";
import AffiliateSelectComponent from "@/components/affiliate/AffiliateSelectComponent.vue";
import createAffiliate from "@/apis/affiliate/create";


const authStore = useAuthStore()
const errorStore = useErrorStore()
const router = useRouter()

const { values: formValues, errors: formErrors, handleSubmit, defineInputBinds, setFieldValue  } = useForm({validationSchema: affiliateCreateSchema});

const name = defineInputBinds('name')
const name_legal = defineInputBinds('name_legal')
const rep = defineInputBinds('rep')
const brn = defineInputBinds('brn')
const registration_no = defineInputBinds('registration_no')
const parent = defineInputBinds('parent')


const onSubmit = handleSubmit(async values => {
  const response = await createAffiliate(values)
  if (response.success) {
    errorStore.set('success', '등록 성공', `${response.data.name}이 등록되었습니다.`)
    await router.push({name: 'affiliate_detail', params: {affiliateId: response.data.id}})
  } else {

  }
});

</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">신규 사업장 등록</h1>
      </div>
    </div>

    <div class="-mx-4 mt-10  sm:mx-0 sm:rounded-lg">
      <form @submit.prevent="onSubmit" method="post">
        <div class="space-y-12">

          <div class="border-b border-gray-900/10 pb-12">

            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="name_legal" class="block text-sm font-medium leading-6 text-gray-900">법인명</label>
                <div class="mt-2">
                  <input type="text" name="name_legal" id="name_legal" v-bind="name_legal"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-gray-900">사업자등록증에 기재된 사업자명</p>
                <p class="mt-2 text-sm text-red-600" id="name_legal-error" v-if="formErrors.name_legal">
                  {{formErrors.name_legal}}
                </p>

              </div>
              <div class="sm:col-span-3">
                <label for="name" class="block text-sm font-medium leading-6 text-gray-900">사업장명</label>
                <div class="mt-2">
                  <input type="text" name="name" id="name" v-bind="name"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-gray-900">일반적으로 사용하는 사업장명</p>
                <p class="mt-2 text-sm text-red-600" id="name-error" v-if="formErrors.name">
                  {{formErrors.name}}
                </p>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="rep" class="block text-sm font-medium leading-6 text-gray-900">대표자명</label>
                <div class="mt-2">
                  <input type="text" name="rep" id="rep" v-bind="rep"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="rep-error" v-if="formErrors.rep">
                  {{formErrors.rep}}
                </p>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="brn" class="block text-sm font-medium leading-6 text-gray-900">사업자등록번호</label>
                <div class="mt-2">
                  <input type="text" name="brn" id="brn" v-bind="brn" maxlength="10"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-gray-500">10자리 숫자만 입력하세요</p>
                <p class="mt-2 text-sm text-red-600" id="rep-error" v-if="formErrors.brn">
                  {{formErrors.brn}}
                </p>
              </div>
              <div class="sm:col-span-3">
                <label for="registration_no" class="block text-sm font-medium leading-6 text-gray-900">법인등록번호</label>
                <div class="mt-2">
                  <input type="text" name="registration_no" id="registration_no" v-bind="registration_no" maxlength="13"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-gray-500">13자리 숫자만 입력하세요</p>
                <p class="mt-2 text-sm text-red-600" id="registration_no-error" v-if="formErrors.registration_no">
                  {{formErrors.registration_no }}
                </p>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <AffiliateSelectComponent @setAffiliateId="(affData) => {setFieldValue('parent', affData)}" :label-string="'주사업장'" :request-query="{parent: 'N'}"/>
                <input hidden="hidden" type="number" name="parent" v-bind="parent" ref="parentInput">
              </div>
            </div>

          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
          <router-link :to="{name: 'affiliate_list'}" type="button" class="text-sm font-semibold leading-6 text-gray-900">취소</router-link>
          <button type="submit"
                  class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            저장
          </button>
        </div>
      </form>
    </div>
  </div>

</template>
