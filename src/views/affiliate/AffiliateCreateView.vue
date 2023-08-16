<script>
import {useAuthStore} from "@/stores/auth";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/20/solid'
import {useRoute, useRouter} from "vue-router";
import createAffiliate from "@/apis/affiliate/create";
import {Form, Field, ErrorMessage, useForm} from 'vee-validate';
import affiliateCreateSchema from "@/validators/affiliate/create";
import {useErrorStore} from "@/stores/error";


export default {
  name: 'AffiliateCreateView',
  setup() {
    const authStore = useAuthStore()
    const errorStore = useErrorStore()
    const route = useRoute()
    const router = useRouter()
    const currentPage = route.query.page ? parseInt(route.query.page) : 1
    const pageSize = route.query.pagesize ? parseInt(route.query.pagesize) : 20
    return {authStore, errorStore, router, currentPage, pageSize, affiliateCreateSchema}
  },
  components: {
    'chevron-left-icon': ChevronLeftIcon,
    'chevron-right-icon': ChevronRightIcon,
    // 'v-form': Form,
    // 'v-field': Field
    Form, Field, ErrorMessage,
  },
  data() {
    return {
    }
  },
  async mounted() {
  },
  methods: {
    async onSubmit(value) {
      const response = await createAffiliate(value)
      if (response.success) {
        this.errorStore.set('success', '등록 성공', `${response.data.name}이 등록되었습니다.`)
        this.router.push({name: 'affiliate_list'})
      }
    },

  }
}


</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">신규 사업장 등록</h1>
      </div>
    </div>

    <div class="-mx-4 mt-10  sm:mx-0 sm:rounded-lg">
      <!--      <Form :validation-schema="affiliateCreateSchema" @submit="onSubmit">-->
      <!--        <Field name="name_legal" type="text"></Field>-->
      <!--        <ErrorMessage name="name_legal"></ErrorMessage>-->
      <!--        <Field name="name" type="text"></Field>-->
      <!--        <ErrorMessage name="name"></ErrorMessage>-->
      <!--        <Field name="rep" type="text"></Field>-->
      <!--        <ErrorMessage name="rep"></ErrorMessage>-->
      <!--        <Field name="brn" type="text"></Field>-->
      <!--        <ErrorMessage name="brn"></ErrorMessage>-->
      <!--        <Field name="registration_no" type="text"></Field>-->
      <!--        <ErrorMessage name="registration_no"></ErrorMessage>-->
      <!--        <Field name="parent" type="number"></Field>-->
      <!--        <ErrorMessage name="parent"></ErrorMessage>-->

      <!--        <button type="submit">전송</button>-->
      <!--      </Form>-->
      <Form :validation-schema="affiliateCreateSchema" @submit="onSubmit">
        <div class="space-y-12">

          <div class="border-b border-gray-900/10 pb-12">

            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="name_legal" class="block text-sm font-medium leading-6 text-gray-900">법인명</label>
                <div class="mt-2">
                  <Field type="text" name="name_legal" id="name_legal"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-gray-900" id="name_legal-error">사업자등록증에 기재된 사업자명</p>
                <p class="mt-2 text-sm text-red-600" id="name_legal-error">
                  <ErrorMessage name="name_legal"></ErrorMessage>
                </p>

              </div>
              <div class="sm:col-span-3">
                <label for="name" class="block text-sm font-medium leading-6 text-gray-900">사업장명</label>
                <div class="mt-2">
                  <Field type="text" name="name" id="name"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-gray-900" id="name-error">일반적으로 사용하는 사업장명</p>
                <p class="mt-2 text-sm text-red-600" id="name-error">
                  <ErrorMessage name="name"></ErrorMessage>
                </p>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="rep" class="block text-sm font-medium leading-6 text-gray-900">대표자명</label>
                <div class="mt-2">
                  <Field type="text" name="rep" id="rep"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="rep-error">
                  <ErrorMessage name="rep"></ErrorMessage>
                </p>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="brn" class="block text-sm font-medium leading-6 text-gray-900">사업자등록번호</label>
                <div class="mt-2">
                  <Field type="text" name="brn" id="brn"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-gray-500" id="brn-error">10자리 숫자만 입력하세요</p>
                <p class="mt-2 text-sm text-red-600" id="brn-error">
                  <ErrorMessage name="brn"></ErrorMessage>
                </p>
              </div>
              <div class="sm:col-span-3">
                <label for="registration_no" class="block text-sm font-medium leading-6 text-gray-900">법인등록번호</label>
                <div class="mt-2">
                  <Field type="text" name="registration_no" id="brn"
                         class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <p class="mt-2 text-sm text-gray-500" id="registration_no-error">13자리 숫자만 입력하세요</p>
                <p class="mt-2 text-sm text-red-600" id="registration_no-error">
                  <ErrorMessage name="registration_no"></ErrorMessage>
                </p>
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
      </Form>
    </div>
  </div>

</template>
