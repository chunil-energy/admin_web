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
import {defaultLabel, defaultTextInput, disabledTextInput, defaultButton, defaultSelect} from "@/styles";
import createUser from "@/apis/employee/createUser";
import getEmployee from "@/apis/employee/getEmployee";
import employeeDetailSchema from "@/validators/employee/employeeDetailSchema";
import AffiliateSelector from "@/components/common/AffiliateSelector.vue";
import AddressSelector from "@/components/common/AddressSelector.vue";
import {employmentTypeChoice, payTypeChoice} from "@/choices/employee";
import VueDatePicker from "@vuepic/vue-datepicker";
import dateParser from "@/utils/common/dateParser";
import BankAccountComponent from "@/components/common/BankAccountComponent.vue"
import createEmployee from "@/apis/employee/createEmployee";
import {ref} from "vue";
import getUser from "@/apis/employee/getUser";

export default {
  name: 'EmployeeCreateView',
  async setup() {
    const errorStore = useErrorStore()
    const route = useRoute()
    const router = useRouter()
    const userId = route.params.userId
    const userDataResponse = await getUser(userId)
    const userData = ref(null)
    if (userDataResponse.success) {
      userData.value = userDataResponse.data
    }
    if (userData.value.employee) {
      await errorStore.set('error', '오류', '이미 임직원 정보가 등록된 사용자입니다.')
      router.push({name: 'employee_detail', params: {employeeId: userData.value.employee}})
    }
    // .then((response) => {
    //   if (response.success) {
    //     userDataResponse.value = response
    //   } else {
    //     errorStore.set('error', '사용자 조회 실패', response.message)
    //   }
    // }).catch(e => {
    //   errorStore.set('error', '사용자 조회 실패', e.message)
    // })
    const {
      values, errors, defineInputBinds, setFieldValue, handleSubmit,
      setErrors, setFieldError, setValues
    } = useForm({validationSchema: employeeDetailSchema, initialValues: userData.value});
    const contractCompanyBinding = defineInputBinds('contract_company')
    const workCompanyBinding = defineInputBinds('work_company')
    const nameBinding = defineInputBinds('name')
    const gradeBinding = defineInputBinds('grade')
    const telBinding = defineInputBinds('tel')
    const cellphoneBinding = defineInputBinds('cellphone')
    const emailBinding = defineInputBinds('email')
    const homeBinding = defineInputBinds('home')
    // const homeAddressBinding = defineInputBinds('home_address')
    // const homeAddressDetailBinding = defineInputBinds('home_address_detail')
    // const homeAddressDataBinding = defineInputBinds('home_address_data')
    const employmentTypeBinding = defineInputBinds('employment_type')
    const payTypeBinding = defineInputBinds('pay_type')
    const salaryAccountBinding = defineInputBinds('salary_account')
    const workStartBinding = defineInputBinds('work_start')
    const workEndBinding = defineInputBinds('work_end')

    const onSubmit = handleSubmit(async (fv) => {
      const response = await createEmployee(userId, fv)
      if (response.success) {
        await router.push({name: 'employee_detail', params: {employeeId: response.data.id}})
      } else if (response?.error) {
        Object.entries(response.error).forEach(([errKey, errValue]) => {
          if (errKey === 'non_field_errors') {
            Promise.all(errValue.map(nf => errorStore.set('error', '임직원 등록 실패', nf)))
          } else {
            errValue.forEach((nf) => setFieldError(errKey, nf))
          }
        })
      } else if (response?.message) {
        await errorStore.set('error', '임직원 등록 실패', response.message)
      }
    })
    return {
      errorStore,
      route,
      userData,
      formValues: values,
      formSetValues: setValues,
      formErrors: errors,
      formDefineInputBinds: defineInputBinds,
      formSetFieldValue: setFieldValue,
      nameBinding,
      gradeBinding,
      contractCompanyBinding,
      workCompanyBinding,
      telBinding,
      cellphoneBinding,
      emailBinding,
      homeBinding,
      // homeAddressBinding,
      // homeAddressDetailBinding,
      // homeAddressDataBinding,
      employmentTypeBinding,
      payTypeBinding,
      salaryAccountBinding,
      workStartBinding,
      workEndBinding,
      onSubmit,
      defaultLabel,
      defaultTextInput,
      defaultButton,
      disabledTextInput,
      defaultSelect,
      onlyDigitParser,
      payTypeChoice,
      employmentTypeChoice,
      dateParser
    }
  },
  components: {VueDatePicker, AddressSelector, AffiliateSelector, BankAccountComponent},
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">임직원 상세정보 등록</h1>
      </div>
    </div>

    <div class="-mx-4 mt-10  sm:mx-0 sm:rounded-lg">
      {{ formValues }}
      <div>{{ formErrors }}</div>
      <form @submit.prevent="onSubmit" method="put">
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="col-span-1">
                <label for="username" :class="defaultLabel">사용자명</label>
                <div class="mt-2">
                  <input type="text" id="username" disabled readonly :value="userData?.username"
                         :class="disabledTextInput">
                </div>
              </div>
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
                <label for="grade" :class="defaultLabel">직급</label>
                <div class="mt-2">
                  <input type="text" id="grade" name="grade" v-bind="gradeBinding" :class="defaultTextInput">
                </div>
                <!--                <p class="mt-2 text-sm text-gray-900">* 공백 없이 입력해주세요</p>-->
                <p class="mt-2 text-sm text-red-600" id="grade-error" v-if="formErrors.grade">
                  {{ formErrors.grade }}
                </p>
              </div>
              <div class="col-span-2">
                <label for="contract_company" :class="defaultLabel">고용 관계사</label>
                <div class="mt-2">
                  <AffiliateSelector @selectAffiliate="value => formSetFieldValue('contract_company', value)"/>
                  <!--                  <AffiliateSelectComponent @setAffiliateId="(affData) => {console.log(affData)}" :label-string="'주사업장'"/>-->
                  <!--                  <AffiliateSelectComponent/>-->
                  <!--                  <input type="text" id="name" name="name" v-bind="nameBinding" :class="defaultTextInput">-->
                </div>
                <p class="mt-2 text-sm text-red-600" id="contract_company-error" v-if="formErrors.contract_company">
                  {{ formErrors.contract_company }}
                </p>
              </div>
              <div class="col-span-2">
                <label for="work_company" :class="defaultLabel">근로 관계사</label>
                <div class="mt-2">
                  <AffiliateSelector @selectAffiliate="value => formSetFieldValue('work_company', value)"/>
                  <!--                  <AffiliateSelectComponent @setAffiliateId="(affData) => {console.log(affData)}" :label-string="'주사업장'"/>-->
                  <!--                  <AffiliateSelectComponent/>-->
                  <!--                  <input type="text" id="name" name="name" v-bind="nameBinding" :class="defaultTextInput">-->
                </div>
                <p class="mt-2 text-sm text-red-600" id="work_company-error" v-if="formErrors.work_company">
                  {{ formErrors.work_company }}
                </p>
              </div>
            </div>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="col-span-2">
                <label for="work_start" :class="defaultLabel">입사일</label>
                <div class="mt-2">
                  <VueDatePicker :input-class-name="defaultTextInput.join(' ')" :enable-time-picker="false"
                                 :locale="'ko-Kr'"
                                 :auto-apply="true" format="yyyy-MM-dd" :model-value="formValues.work_start"
                                 @update:model-value="(value) => formSetFieldValue('work_start', value)"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="work_start-error" v-if="formErrors.work_start">
                  {{ formErrors.work_start }}
                </p>
              </div>
              <div class="col-span-2">
                <label for="employment_type" :class="defaultLabel">고용 형태</label>
                <div class="mt-2">
                  <select id="employment_type" name="employment_type" :class="defaultSelect"
                          v-bind="employmentTypeBinding">
                    <option v-for="[employmentTypeValue, employmentTypeName] in Object.entries(employmentTypeChoice)"
                            :value="employmentTypeValue" v-bind:key="employmentTypeValue">
                      {{ employmentTypeName }}
                    </option>
                  </select>
                </div>
                <p class="mt-2 text-sm text-red-600" id="employment_type-error" v-if="formErrors.employment_type">
                  {{ formErrors.employment_type }}
                </p>
              </div>
              <div class="col-span-2">
                <label for="pay_type" :class="defaultLabel">급여 형태</label>
                <div class="mt-2">
                  <select id="pay_type" name="pay_type" :class="defaultSelect" v-bind="payTypeBinding">
                    <option v-for="[payTypeValue, payTypeName] in Object.entries(payTypeChoice)" :value="payTypeValue"
                            v-bind:key="payTypeValue">
                      {{ payTypeName }}
                    </option>
                  </select>
                </div>
                <p class="mt-2 text-sm text-red-600" id="pay_type-error" v-if="formErrors.pay_type">
                  {{ formErrors.pay_type }}
                </p>
              </div>
              <div class="col-span-3">
                <label for="pay_type" :class="defaultLabel">급여 계좌</label>
                <div class="mt-2">
                  <BankAccountComponent :placeholder-string="'급여 계좌'"
                                        @setAccount="value => formSetFieldValue('salary_account', value)"
                                        :label-string="'급여 계좌'"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="pay_type-error" v-if="formErrors.pay_type">
                  {{ formErrors.pay_type }}
                </p>
              </div>
            </div>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="col-span-2">
                <label for="tel" :class="defaultLabel">전화번호</label>
                <div class="mt-2">
                  <input type="text" id="tel" name="tel" v-bind="telBinding"
                         @input="formSetFieldValue('tel', onlyDigitParser($event.target.value))"
                         :class="defaultTextInput">
                </div>
                <p class="mt-2 text-sm text-red-600" id="tel-error" v-if="formErrors.tel">
                  {{ formErrors.tel }}
                </p>
              </div>
              <div class="col-span-2">
                <label for="cellphone" :class="defaultLabel">휴대전화번호</label>
                <div class="mt-2">
                  <input type="text" id="cellphone" name="cellphone" v-bind="cellphoneBinding"
                         @input="formSetFieldValue('cellphone', onlyDigitParser($event.target.value))"
                         :class="defaultTextInput">
                </div>
                <p class="mt-2 text-sm text-red-600" id="cellphone-error" v-if="formErrors.cellphone">
                  {{ formErrors.cellphone }}
                </p>
              </div>
              <div class="col-span-2">
                <label for="email" :class="defaultLabel">이메일</label>
                <div class="mt-2">
                  <input type="email" id="email" name="email" v-bind="emailBinding" :class="defaultTextInput">
                </div>
                <p class="mt-2 text-sm text-red-600" id="email-error" v-if="formErrors.email">
                  {{ formErrors.email }}
                </p>
              </div>
            </div>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="col-span-4">
                <label for="home_address" :class="defaultLabel">자택 주소</label>
                <div class="mt-2">
                  <AddressSelector :use-name="false" :placeholder-string="'자택 주소'" @selectLocation="(data) => {
                    console.log(data)
                      formSetFieldValue('home', data)
                    }"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="home-error" v-if="formErrors.home">
                  {{ formErrors.home }}
                </p>
              </div>
            </div>
          </div>
        </div>


        <div class="mt-6 flex items-center justify-end gap-x-6">
          <router-link :to="{name: 'employee_list'}" type="button"
                       class="text-sm font-semibold leading-6 text-gray-900">
            취소
          </router-link>
          <button type="submit"
                  :class="defaultButton">
            저장
          </button>
        </div>
      </form>

    </div>
  </div>

</template>
