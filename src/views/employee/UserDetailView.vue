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
import {defaultLabel, defaultTextInput, disabledTextInput, whiteButton} from "@/styles";
import {ref} from "vue";
import getUser from "@/apis/employee/getUser";
import userDetailSchema from "@/validators/employee/userDetailSchema";
import updateUser from "@/apis/employee/updateUser";

export default {
  name: 'EmployeeUserCreateView',
  async setup() {
    const errorStore = useErrorStore()
    const route = useRoute()
    const router = useRouter()
    const userData = ref(null)
    try {
      const userDataResponse = await getUser(route.params.userId)
      if (!userDataResponse.success) {
        throw new Error(userDataResponse.message)
      }
      userData.value = userDataResponse.data
      const {
        values, errors, defineInputBinds, setFieldValue, handleSubmit,
        setErrors, setFieldError
      } = useForm({validationSchema: userDetailSchema, initialValues: userData.value});
      const nameBinding = defineInputBinds('name')
      const cellphoneBinding = defineInputBinds('cellphone')
      const emailBinding = defineInputBinds('email')
      const onSubmit = handleSubmit(async (fv) => {
        const response = await updateUser(route.params.userId, fv)
        if (response.success) {
          await errorStore.set('success', '사용자 저장 성공', [
            `변경사항이 저장되었습니다.`
          ])
          await router.push({name: 'user_detail', params: {userId: response.data.id}})
        } else if (response?.error) {
          Object.entries(response.error).forEach(([errKey, errValue]) => {
            if (errKey === 'non_field_errors') {
              Promise.all(errValue.map(nf => errorStore.set('error', '사용자 저장 실패', nf)))
            } else {
              errValue.forEach((nf) => setFieldError(errKey, nf))
            }
          })
        }
      })
      return {
        userData,
        errorStore,
        route,
        formValues: values,
        formErrors: errors,
        formDefineInputBinds: defineInputBinds,
        formSetFieldValue: setFieldValue,
        nameBinding,
        cellphoneBinding,
        emailBinding,
        onSubmit,
        defaultLabel,
        defaultTextInput,
        disabledTextInput,
        onlyDigitParser,
        whiteButton
      }
    } catch (e) {
      await errorStore.set('error', '사용자 조회 실패', e)
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
        <h1 class="text-base font-semibold leading-6 text-gray-900">사용자 상세</h1>
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
                  <input type="text" id="username" name="username" readonly :value="userData.username" :class="disabledTextInput">
                </div>
              </div>

              <div class="col-span-2 grid items-end">
                <div v-if="userData.employee">
                  <router-link :to="{name: 'employee_detail', params: {employeeId: userData.employee}}" type="button" :class="whiteButton">
                    임직원 상세
                  </router-link>
                </div>
                <div v-else>
                  <router-link :to="{name: 'employee_create', params: {userId: userData.id}}" type="button" :class="whiteButton">
                    임직원 등록
                  </router-link>
                </div>
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
      </form>

    </div>
  </div>

</template>
