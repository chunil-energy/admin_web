<script>
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/20/solid'
import {useRoute, useRouter} from "vue-router";
import onlyDigitParser from "@/utils/common/onlyDigitParser"
import brnParser from "@/utils/common/brnParser";
import corpRegisterNoParser from "@/utils/common/corpRegisterNoParser";
import getCollectionCompanyList from "@/apis/collection/company/list";
import phoneNumberParser from "@/utils/common/phoneNumberParser";
import getUserListData from "@/apis/employee/listUser";
import {useErrorStore} from "@/stores/error";
import VehiclePartySelector from "@/components/vehicle/VehiclePartySelector.vue";
import {useForm} from "vee-validate";
import companyUserCreateSchema from "@/validators/collection/company/user/create";
import userCreateSchema from "@/validators/employee/userCreateSchema";
import {defaultLabel, defaultTextInput} from "@/styles";
import createUser from "@/apis/employee/createUser";

export default {
  name: 'EmployeeUserCreateView',
  methods: {onlyDigitParser},
  async setup() {
    const errorStore = useErrorStore()
    const route = useRoute()
    const router = useRouter()
    const {
      values, errors, defineInputBinds, setFieldValue, handleSubmit,
      setErrors, setFieldError
    } = useForm({validationSchema: userCreateSchema});
    const usernameBinding = defineInputBinds('username')
    const passwordBinding = defineInputBinds('password')
    const password1Binding = defineInputBinds('password1')
    const nameBinding = defineInputBinds('name')
    const cellphoneBinding = defineInputBinds('cellphone')
    const emailBinding = defineInputBinds('email')
    const onSubmit = handleSubmit(async (fv) => {
      const response = await createUser(fv)
      if (response.success) {
        await errorStore.set('success', '사용자 등록 성공', [
          `사용자가 등록되었습니다.`
        ])
        await router.push({name: 'user_detail', params: {userId: response.data.id}})
      } else if (response?.error) {
        Object.entries(response.error).forEach(([errKey, errValue]) => {
          if (errKey === 'non_field_errors') {
            Promise.all(errValue.map(nf => errorStore.set('error', '사용자 등록 실패', nf)))
          } else {
            errValue.forEach((nf) => setFieldError(errKey, nf))
          }
        })
      }
    })
    return {
      errorStore,
      route,
      formValues: values,
      formErrors: errors,
      formDefineInputBinds: defineInputBinds,
      formSetFieldValue: setFieldValue,
      nameBinding,
      cellphoneBinding,
      emailBinding,
      usernameBinding,
      passwordBinding,
      password1Binding,
      onSubmit,
      defaultLabel,
      defaultTextInput
    }
  },
  components: {},
  computed: {}
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">사용자 등록</h1>
      </div>
    </div>

    <div class="-mx-4 mt-10  sm:mx-0 sm:rounded-lg">
      <form @submit.prevent="onSubmit" method="post">
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="col-span-2">
                <label for="username" :class="defaultLabel">사용자명</label>
                <div class="mt-2">
                  <input type="text" id="username" name="username" v-bind="usernameBinding" :class="defaultTextInput">
                </div>
                <!--                <p class="mt-2 text-sm text-gray-900">* 공백 없이 입력해주세요</p>-->
                <p class="mt-2 text-sm text-red-600" id="username-error" v-if="formErrors.username">
                  {{ formErrors.username }}
                </p>
              </div>
            </div>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="col-span-2">
                <label for="password" :class="defaultLabel">비밀번호</label>
                <div class="mt-2">
                  <input type="password" id="password" name="password" v-bind="passwordBinding"
                         :class="defaultTextInput">
                </div>
                <p class="mt-2 text-sm text-red-600" id="password-error" v-if="formErrors.password">
                  {{ formErrors.password }}
                </p>
              </div>
              <div class="col-span-2">
                <label for="password1" :class="defaultLabel">비밀번호 확인</label>
                <div class="mt-2">
                  <input type="password" id="password1" name="password1" v-bind="password1Binding"
                         :class="defaultTextInput">
                </div>
                <p class="mt-2 text-sm text-red-600" id="password1-error" v-if="formErrors.password1">
                  {{ formErrors.password1 }}
                </p>
              </div>
            </div>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="col-span-2">
                <label for="name" :class="defaultLabel">성명</label>
                <div class="mt-2">
                  <input type="text" id="name" name="name" v-bind="nameBinding" :class="defaultTextInput">
                </div>
                <!--                <p class="mt-2 text-sm text-gray-900">* 공백 없이 입력해주세요</p>-->
                <p class="mt-2 text-sm text-red-600" id="name-error" v-if="formErrors.name">
                  {{ formErrors.name }}
                </p>
              </div>
              <div class="col-span-2">
                <label for="cellphone" :class="defaultLabel">휴대전화</label>
                <div class="mt-2">
                  <input type="text" id="cellphone" name="cellphone"
                         :value="cellphoneBinding.value" @input="(event) => {
                                       event.target.value=onlyDigitParser(event.target.value)
                                       formSetFieldValue('cellphone', event.target.value)
                                     }" :class="defaultTextInput">
                </div>
                <!--                <p class="mt-2 text-sm text-gray-900">* 공백 없이 입력해주세요</p>-->
                <p class="mt-2 text-sm text-red-600" id="cellphone-error" v-if="formErrors.cellphone">
                  {{ formErrors.cellphone }}
                </p>
              </div>
              <div class="col-span-2">
                <label for="email" :class="defaultLabel">이메일</label>
                <div class="mt-2">
                  <input type="email" id="email" name="email" v-bind="emailBinding" :class="defaultTextInput">
                </div>
                <!--                <p class="mt-2 text-sm text-gray-900">* 공백 없이 입력해주세요</p>-->
                <p class="mt-2 text-sm text-red-600" id="email-error" v-if="formErrors.email">
                  {{ formErrors.email }}
                </p>
              </div>
            </div>
          </div>
        </div>


        <div class="mt-6 flex items-center justify-end gap-x-6">
          <router-link :to="{name: 'user_list'}" type="button"
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
  </div>

</template>
