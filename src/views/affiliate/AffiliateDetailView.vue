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
import FileUploadComponent from "@/components/common/FileUploadComponent.vue";
import onlyDigitParser from "@/utils/common/onlyDigitParser";

const authStore = useAuthStore()
const errorStore = useErrorStore()
const route = useRoute()
const router = useRouter()
const affiliateId = route.params.affiliateId

let affiliateData = ref(null)

onMounted(async () => {
  const affiliateDataResponse = await getAffiliate(affiliateId)
  if (affiliateDataResponse.success) {
    affiliateData.value = affiliateDataResponse.data
  }
})

const {
  values: formValues,
  errors: formErrors,
  handleSubmit,
  defineInputBinds,
  setFieldValue
} = useForm({validationSchema: affiliateCreateSchema, initialValues: affiliateData});

const name = defineInputBinds('name')
const name_legal = defineInputBinds('name_legal')
const rep = defineInputBinds('rep')
const brn = defineInputBinds('brn')
const registration_no = defineInputBinds('registration_no')
const parent = defineInputBinds('parent')


const onSubmit = handleSubmit(async values => {
  const response = await updateAffiliate(affiliateId, values)
  if (response.success) {
    await errorStore.set('success', '성공', '수정사항이 저장되었습니다.')
  } else {
    await errorStore.set('error', '실패', response.message)
  }
});


</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8" v-if="affiliateData">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">{{ affiliateData.name_legal }}</h1>
      </div>
    </div>

    <div class="-mx-4 mt-10  sm:mx-0 sm:rounded-lg" v-if="affiliateData">
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
                  {{ formErrors.name_legal }}
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
                  {{ formErrors.name }}
                </p>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="brn" class="block text-sm font-medium leading-6 text-gray-900">사업자등록번호</label>
                <div class="mt-2">
                  <input type="text" name="brn" id="brn" v-bind="brn" maxlength="10"
                         @input="setFieldValue('brn', onlyDigitParser($event.target.value))"
                         :value="brn.value"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-gray-500">10자리 숫자만 입력하세요</p>
                <p class="mt-2 text-sm text-red-600" id="rep-error" v-if="formErrors.brn">
                  {{ formErrors.brn }}
                </p>
              </div>
              <div class="sm:col-span-3">
                <label for="rep" class="block text-sm font-medium leading-6 text-gray-900">대표자명</label>
                <div class="mt-2">
                  <input type="text" name="rep" id="rep" v-bind="rep"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="rep-error" v-if="formErrors.rep">
                  {{ formErrors.rep }}
                </p>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <AffiliateSelectComponent @setAffiliateId="(affData) => {setFieldValue('parent', affData)}"
                                          :initial-value="parent.value" :label-string="'주사업장'"
                                          :request-query="{parent: 'N', selfId: affiliateData.id}"/>
                <input hidden="hidden" type="number" name="parent" v-bind="parent" ref="parentInput">
              </div>
              <div class="sm:col-span-3" v-if="!parent?.value">
                <label for="registration_no"
                       class="block text-sm font-medium leading-6 text-gray-900">법인등록번호</label>
                <div class="mt-2">
                  <input type="text" name="registration_no" id="registration_no" v-bind="registration_no" maxlength="13"
                         @input="setFieldValue('registration_no', onlyDigitParser($event.target.value))"
                         :value="registration_no.value"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-gray-500">13자리 숫자만 입력하세요</p>
                <p class="mt-2 text-sm text-red-600" id="registration_no-error" v-if="formErrors.registration_no">
                  {{ formErrors.registration_no }}
                </p>
              </div>
            </div>

          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
          <router-link :to="{name: 'affiliate_list'}" type="button"
                       class="text-sm font-semibold leading-6 text-gray-900">취소
          </router-link>
          <button type="submit"
                  class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            저장
          </button>
        </div>
      </form>
    </div>
<!--      <div class="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-6">-->
<!--        <div class="sm:col-span-2">-->
<!--        </div>-->
<!--        <div class="sm:col-span-2">-->
<!--          <div>{{ affiliateData.bizregistration_set }}</div>-->
<!--          <div>{{ affiliateData.corpregistration_set }}</div>-->
<!--        </div>-->
<!--        <div class="overflow-y-auto overscroll-none h-screen sm:col-span-4">-->
<!--          <p>가나다</p>-->
<!--          <p>가나다</p>-->
<!--        </div>-->
<!--      </div>-->
  </div>
</template>
