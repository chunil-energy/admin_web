<script>
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {BanknotesIcon, BuildingOfficeIcon, UsersIcon} from "@heroicons/vue/20/solid";
import {ref} from "vue";
import getCompany from "@/apis/collection/company/get";
import {useForm} from "vee-validate";
import {defaultTextInput} from '@/styles'
import companyUserCreateSchema from '@/validators/collection/company/user/create'
import UserSelector from "@/components/common/UserSelector.vue";
import {Switch, SwitchGroup, SwitchLabel} from '@headlessui/vue'
import onlyDigitParser from "@/utils/common/onlyDigitParser";
import createCollectionCompanyUser from "@/apis/collection/company/createUser";

export default {
  components: {UserSelector, Switch, SwitchGroup, SwitchLabel},
  setup() {
    const authStore = useAuthStore()
    const errorStore = useErrorStore()
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
        current: false
      },
      {
        name: '직원',
        value: 'user',
        to: {name: 'collection_company_user', params: {companyId: companyId}},
        icon: UsersIcon,
        current: true
      },
      {
        name: '기본단가',
        value: 'price',
        to: {name: 'collection_company_price', params: {companyId: companyId}},
        icon: BanknotesIcon,
        current: false
      },
    ]
    try {
      getCompany(companyId).then((responseData) => {
        companyData.value = responseData
      })
    } catch (e) {
      console.log(e)
    }
    const {
      values, errors, defineInputBinds, setFieldValue, handleSubmit
    } = useForm({validationSchema: companyUserCreateSchema});
    const nameBinding = defineInputBinds('name')
    const userBinding = defineInputBinds('user')
    const gradeBinding = defineInputBinds('grade')
    const telBinding = defineInputBinds('tel')
    const hpBinding = defineInputBinds('hp')
    const emailBinding = defineInputBinds('email')
    const isOwnerBinding = defineInputBinds('is_owner')
    const memoBinding = defineInputBinds('memo')
    const onSubmit = handleSubmit(async (fv) => {
      try {
        const responseData = await createCollectionCompanyUser(companyId, fv)
        await errorStore.set('success', '등록성공', '사용자 저장에 성공했습니다.')
        router.push({name: 'collection_company_user_detail', params: {companyId, userId: responseData.data.id}})
      } catch (e) {
        await errorStore.set('error', '등록실패', '사용자 저장에 실패했습니다.')
      }

    })
    return {
      authStore,
      errorStore,
      router,
      route,
      companyId,
      companyData,
      tabs,
      defaultTextInput,
      formValues: values,
      formErrors: errors,
      formDefineInputBinds: defineInputBinds,
      formSetFieldValue: setFieldValue,
      onSubmit,
      nameBinding, userBinding, gradeBinding, telBinding, hpBinding, emailBinding, isOwnerBinding, memoBinding,
      onlyDigitParser
    }
  },
  computed: {
    masterCompanyData() {
      return this.companyData?.master
    }
  }
}

</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">{{ masterCompanyData?.name }} 직원</h1>
      </div>
    </div>
    <div class="-mx-4 mt-10">
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


    <!--      <div class="px-4 sm:px-6 lg:px-8">-->
    <div class="mt-10 sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">거래처 직원 등록</h1>
        <!--        <p class="mt-2 text-sm text-gray-700">Your team is on the <strong-->
        <!--            class="font-semibold text-gray-900">Startup</strong> vehicle. The next payment of $80 will be due on August 4,-->
        <!--          2022.</p>-->
      </div>
    </div>
    <!--        {{userData}}-->
    <div class="-mx-4 mt-10  sm:mx-0 sm:rounded-lg">
      <form @submit.prevent="onSubmit" method="post">
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="sm:col-span-2">
                <label for="user" class="block text-sm font-medium leading-6 text-gray-900">사용자</label>
                <div class="mt-2">
                  <UserSelector @selectUser="(userId) => {formSetFieldValue('user', userId)}"/>
                  <input type="text" name="user" id="user" v-bind="userBinding"
                         :class="[...defaultTextInput]" class="hidden"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="user-error" v-if="formErrors.user">
                  {{ formErrors.user }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label for="name" class="block text-sm font-medium leading-6 text-gray-900">성명</label>
                <div class="mt-2">
                  <input type="text" id="name" name="name" :class="[...defaultTextInput]" v-bind="nameBinding">
                </div>
                <p class="mt-2 text-sm text-red-600" id="name-error" v-if="formErrors.name">
                  {{ formErrors.name }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label for="grade" class="block text-sm font-medium leading-6 text-gray-900">직급</label>
                <div class="mt-2">
                  <input type="text" id="grade" name="grade" :class="[...defaultTextInput]" v-bind="gradeBinding">
                </div>
                <p class="mt-2 text-sm text-red-600" id="grade-error" v-if="formErrors.grade">
                  {{ formErrors.grade }}
                </p>
              </div>


              <div class="sm:col-span-2">
                <label for="is_owner" class="block text-sm font-medium leading-6 text-gray-900">관리자 여부</label>
                <div class="mt-2">
                  <SwitchGroup as="div" class="flex items-center">
                    <Switch @update:modelValue="(value) => {formSetFieldValue('is_owner', value)}"
                            :class="[formValues.is_owner ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2']">
                      <span aria-hidden="true"
                            :class="[formValues.is_owner ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']"/>
                    </Switch>
                    <SwitchLabel as="span" class="ml-3 text-sm">
                      <span class="font-medium text-gray-900">{{ formValues.is_owner ? '관리자' : '비관리자' }}</span>
                    </SwitchLabel>
                  </SwitchGroup>
                </div>
              </div>
            </div>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="sm:col-span-2">
                <label for="tel" class="block text-sm font-medium leading-6 text-gray-900">전화번호</label>
                <div class="mt-2">
                  <input type="text" id="tel" name="tel" :class="[...defaultTextInput]" :value="formValues.tel" @input="formSetFieldValue('tel', onlyDigitParser($event.target.value))">
                </div>
                <p class="mt-2 text-sm text-red-600" id="tel-error" v-if="formErrors.tel">
                  {{ formErrors.tel }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label for="hp" class="block text-sm font-medium leading-6 text-gray-900">휴대전화</label>
                <div class="mt-2">
                  <input type="text" id="hp" name="hp" :class="[...defaultTextInput]" :value="formValues.hp" @input="formSetFieldValue('hp', onlyDigitParser($event.target.value))">
                </div>
                <p class="mt-2 text-sm text-red-600" id="hp-error" v-if="formErrors.hp">
                  {{ formErrors.hp }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <label for="email" class="block text-sm font-medium leading-6 text-gray-900">이메일</label>
                <div class="mt-2">
                  <input type="email" id="email" name="email" :class="[...defaultTextInput]" v-bind="emailBinding">
                </div>
                <p class="mt-2 text-sm text-red-600" id="email-error" v-if="formErrors.email">
                  {{ formErrors.email }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!--        <div class="mt-6 flex items-center justify-end gap-x-6" v-if="brnExists!==null">-->
        <div class="mt-6 flex items-center justify-end gap-x-6">
          <router-link :to="{name: 'collection_company_user', params: {companyId}}" type="button" class="text-sm font-semibold leading-6 text-gray-900">
            취소
          </router-link>
          <button type="submit"
                  class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            저장
          </button>
        </div>
      </form>
    </div>
    <!--      </div>-->
  </div>

</template>

<style scoped>

</style>