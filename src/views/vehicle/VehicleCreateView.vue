<script setup>
import {vehiclePositionChoice, vehicleTypeChoice} from "@/choices/vehicle";
import {defaultLabel, defaultSelect, defaultTextInput} from "@/styles"
import VehiclePartySelector from "@/components/vehicle/VehiclePartySelector.vue";
import {useForm} from "vee-validate";
import vehicleCreateSchema from "@/validators/vehicle/create";
import createAffiliate from "@/apis/affiliate/create";
import loginView from "@/views/auth/LoginView.vue";
import createVehicle from "@/apis/vehicle/create";
import {useRouter} from "vue-router";
import {useErrorStore} from "@/stores/error";
import isNumberKey from "@/utils/common/isNumberKey";
import isKorNumberKey from "@/utils/common/isKorNumberKey";
import onlyDigitParser from "@/utils/common/onlyDigitParser";
import onlyKorNumberParser from "@/utils/common/onlyKorNumberParser";
import isAlphaNumericKey from "@/utils/common/isAlphaNumericKey";
import onlyAlphaNumericParser from "@/utils/common/onlyAlphaNumericParser";
import EmployeeSelector from "@/components/common/EmployeeSelector.vue";

const router = useRouter()
const errorStore = useErrorStore()

const {
  values: vehicleCreateValues,
  errors: vehicleCreateErrors,
  handleSubmit: vehicleCreateHandleSubmit,
  defineInputBinds: vehicleCreateDefineInputBind,
  setFieldValue: vehicleCreateSetFieldValue,
  setErrors: vehicleCreateSetSetError,
} = useForm({validationSchema: vehicleCreateSchema});

const car_no = vehicleCreateDefineInputBind('car_no')
const vin = vehicleCreateDefineInputBind('vin')
const name = vehicleCreateDefineInputBind('name')
const position = vehicleCreateDefineInputBind('position')
const vehicle_type = vehicleCreateDefineInputBind('vehicle_type')
const driver = vehicleCreateDefineInputBind('driver')
const owner_party = vehicleCreateDefineInputBind('owner_party')
const user_party = vehicleCreateDefineInputBind('user_party')
const manager_party = vehicleCreateDefineInputBind('manager_party')

const onSubmit = vehicleCreateHandleSubmit(async values => {
  const response = await createVehicle(values)
  await errorStore.set('success', '성공', `${response.data.car_no} 차량이 등록되었습니다.`)
  await router.push({name: 'vehicle_detail', params: {vehicleId: response.data.id}})
});


</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">차량 등록</h1>
      </div>
    </div>
    <div class="-mx-4 mt-10  sm:mx-0 sm:rounded-lg">
      <form @submit.prevent="onSubmit" method="post">
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="sm:col-span-2">
                <label for="car_no" :class="defaultLabel">차량번호</label>
                <div class="mt-2">
                  <input type="text" id="car_no" name="car_no" :class="[...defaultTextInput]"
                         @input="vehicleCreateSetFieldValue('car_no', onlyKorNumberParser($event.target.value))"
                         :value="car_no.value"
                  >
                </div>
                <p class="mt-2 text-sm text-gray-900">* 공백 없이 입력해주세요</p>
                <p class="mt-2 text-sm text-red-600" id="car_no-error" v-if="vehicleCreateErrors.car_no">
                  {{ vehicleCreateErrors.car_no }}
                </p>
              </div>
              <div class="sm:col-span-4">
                <label for="vin" class="block text-sm font-medium leading-6 text-gray-900">차대번호</label>
                <div class="mt-2">
                  <input type="text" id="vin" name="vin"
                         :class="[...defaultTextInput]" maxlength="17"
                         @input="vehicleCreateSetFieldValue('vin', onlyAlphaNumericParser($event.target.value).toUpperCase())"
                         :value="vin.value">
                </div>
                <p class="mt-2 text-sm text-red-600" id="vin-error" v-if="vehicleCreateErrors.vin">
                  {{ vehicleCreateErrors.vin }}
                </p>
              </div>
              <div class="sm:col-span-3">
                <label for="name" class="block text-sm font-medium leading-6 text-gray-900">차명</label>
                <div class="mt-2">
                  <input type="text" id="name" name="name" :class="[...defaultTextInput]" placeholder="현대 포터"
                         v-bind="name">
                </div>
                <p class="mt-2 text-sm text-red-600" id="name-error" v-if="vehicleCreateErrors.name">
                  {{ vehicleCreateErrors.name }}
                </p>
              </div>
            </div>

            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9 border-b pb-10">
              <div class="sm:col-span-3">
                <label for="vehicle_type" class="block text-sm font-medium leading-6 text-gray-900">차량타입</label>
                <div class="mt-2">
                  <select id="vehicle_type" name="vehicle_type" :class="[...defaultSelect]" v-bind="vehicle_type">
                    <option value="">선택</option>
                    <template v-for="[vehicleTypeValue, vehicleTypeName] in Object.entries(vehicleTypeChoice)"
                              v-bind:key="vehicleTypeValue">
                      <option :value="vehicleTypeValue">{{ vehicleTypeName }}</option>
                    </template>
                  </select>
                </div>
                <p class="mt-2 text-sm text-red-600" id="position-error" v-if="vehicleCreateErrors.vehicle_type">
                  {{ vehicleCreateErrors.vehicle_type }}
                </p>
              </div>
              <div class="sm:col-span-3">
                <label for="position" class="block text-sm font-medium leading-6 text-gray-900">용도</label>
                <div class="mt-2">
                  <select id="position" name="position" :class="[...defaultSelect]" v-bind="position">
                    <option value="">선택</option>
                    <template
                        v-for="[vehiclePositionValue, vehiclePositionName] in Object.entries(vehiclePositionChoice)"
                        v-bind:key="vehiclePositionValue">
                      <option :value="vehiclePositionValue">{{ vehiclePositionName }}</option>
                    </template>
                  </select>
                </div>
                <p class="mt-2 text-sm text-red-600" id="vehicle_type-error" v-if="vehicleCreateErrors.position">
                  {{ vehicleCreateErrors.position }}
                </p>
              </div>
              <div class="sm:col-span-3">
                <label for="position" class="block text-sm font-medium leading-6 text-gray-900">기사</label>
                <div class="mt-2">
                  <EmployeeSelector :placeholder-string="'기사'" :label-string="'기사'" @selectEmployee="value => vehicleCreateSetFieldValue('driver', value)"/>
                </div>
                <p class="mt-2 text-sm text-red-600" id="vehicle_type-error" v-if="vehicleCreateErrors.driver">
                  {{ vehicleCreateErrors.driver }}
                </p>
              </div>
            </div>

            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              <div class="sm:col-span-3">
                <label for="owner_party" class="block text-sm font-medium leading-6 text-gray-900">소유자</label>
                <div class="mt-2">
                  <VehiclePartySelector :label-string="'차량 소유자'"
                                        @selectParty="(value) => vehicleCreateSetFieldValue('owner_party', value)"/>
                  <!--                  <input type="text" id="owner_party" name="owner_party" :class="[...defaultTextInput]" v-bind="owner_party"-->
                  <!--                         class="hidden">-->
                </div>
                <p class="mt-2 text-sm text-gray-900">* 자동차 등록증상 명의자를 선택하세요</p>
                <p class="mt-2 text-sm text-red-600" id="owner_party-error" v-if="vehicleCreateErrors.owner_party">
                  {{ vehicleCreateErrors.owner_party }}
                </p>
              </div>
              <div class="sm:col-span-3">
                <label for="user_party" class="block text-sm font-medium leading-6 text-gray-900">사용자</label>
                <div class="mt-2">

                  <VehiclePartySelector :label-string="'차량 사용자'"
                                        @selectParty="(value) => vehicleCreateSetFieldValue('user_party', value)"/>
                  <!--                  <input type="text" id="user_party" name="user_party" :class="[...defaultTextInput]" v-bind="user_party"-->
                  <!--                         class="hidden">-->
                </div>
                <p class="mt-2 text-sm text-gray-900">* 실제로 차량을 업무에 사용중인 당사자를 선택하세요</p>
                <p class="mt-2 text-sm text-red-600" id="user_party-error" v-if="vehicleCreateErrors.user_party">
                  {{ vehicleCreateErrors.user_party }}
                </p>
              </div>
              <div class="sm:col-span-3">
                <label for="manager_party" class="block text-sm font-medium leading-6 text-gray-900">관리자</label>
                <div class="mt-2">

                  <VehiclePartySelector :label-string="'차량 관리자'"
                                        @selectParty="(value) => vehicleCreateSetFieldValue('manager_party', value)"/>
<!--                  <input type="text" id="manager_party" name="manager_party" :class="[...defaultTextInput]"-->
<!--                         v-bind="manager_party" class="hidden">-->
                </div>
                <p class="mt-2 text-sm text-gray-900">* 차량 관리에 소요되는 비용(수리비, 보험료 등)을 부담하는 당사자를 선택하세요</p>
                <p class="mt-2 text-sm text-red-600" id="manager_party-error"
                   v-if="vehicleCreateErrors.manager_party">
                  {{ vehicleCreateErrors.manager_party }}
                </p>
              </div>
            </div>
          </div>
        </div>


        <div class="mt-6 flex items-center justify-end gap-x-6">
          <router-link :to="{name: 'vehicle_list'}" type="button" class="text-sm font-semibold leading-6 text-gray-900">
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
