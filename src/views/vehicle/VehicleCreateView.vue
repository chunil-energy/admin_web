<script setup>
import {vehiclePositionChoice, vehicleTypeChoice} from "@/choices/vehicle";
import {defaultSelect, defaultTextInput} from "@/styles"
import VehiclePartySelector from "@/components/vehicle/VehiclePartySelector.vue";
import {useForm} from "vee-validate";
import vehicleCreateSchema from "@/validators/vehicle/create";
import createAffiliate from "@/apis/affiliate/create";
import loginView from "@/views/auth/LoginView.vue";
import createVehicle from "@/apis/vehicle/create";
import {useRouter} from "vue-router";
import {useErrorStore} from "@/stores/error";

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
const owner_party = vehicleCreateDefineInputBind('owner_party')
const user_party = vehicleCreateDefineInputBind('user_party')
const manager_party = vehicleCreateDefineInputBind('manager_party')

const onSubmit = vehicleCreateHandleSubmit(async values => {
  const response = await createVehicle(values)
  errorStore.set('success', '성공', `${response.data.car_no} 차량이 등록되었습니다.`)
  await router.push({name: 'vehicle_detail', params: {vehicleId: response.data.id}})
});


</script>

<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="px-4 py-6 sm:px-6">
      <h3 class="text-base font-semibold leading-7 text-gray-900">차량 등록</h3>
    </div>
    <form @submit.prevent="onSubmit" method="post">
      <div class="border-t border-gray-100">
        <dl class="grid grid-cols-1 sm:grid-cols-10">
          <div class="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-6">
            <dt class="text-sm font-medium leading-6 text-gray-900">차량번호</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              <input type="text" id="car_no" name="car_no" :class="[...defaultTextInput]" v-bind="car_no" @keydown.space.prevent="(event) => {return null}">
              <p class="mt-2 text-sm text-gray-900">* 공백 없이 입력해주세요</p>
              <p class="mt-2 text-sm text-red-600" id="car_no-error" v-if="vehicleCreateErrors.car_no">
                {{ vehicleCreateErrors.car_no }}
              </p>
            </dd>
          </div>
          <div class="border-t border-gray-100 px-4 py-6 sm:col-span-3 sm:px-6">
            <dt class="text-sm font-medium leading-6 text-gray-900">차대번호</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              <input type="text" id="vin" name="vin" :class="[...defaultTextInput]" maxlength="17" v-bind="vin" @keydown.space.prevent="(event) => {return null}">
              <p class="mt-2 text-sm text-red-600" id="vin-error" v-if="vehicleCreateErrors.vin">
                {{ vehicleCreateErrors.vin }}
              </p>
            </dd>
          </div>
          <div class="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-6">
            <dt class="text-sm font-medium leading-6 text-gray-900">차명</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              <input type="text" id="name" name="name" :class="[...defaultTextInput]" placeholder="현대 포터" v-bind="name">
              <p class="mt-2 text-sm text-red-600" id="name-error" v-if="vehicleCreateErrors.name">
                {{ vehicleCreateErrors.name }}
              </p>
            </dd>
          </div>
        </dl>
        <dl class="grid grid-cols-1 sm:grid-cols-10">
          <div class="border-gray-100 px-4 py-6 sm:col-span-2 sm:px-6">
            <dt class="text-sm font-medium leading-6 text-gray-900">차량타입</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              <select id="vehicle_type" name="vehicle_type" :class="[...defaultSelect]" v-bind="vehicle_type">
                <option value="">선택</option>
                <template v-for="[vehicleTypeValue, vehicleTypeName] in Object.entries(vehicleTypeChoice)"
                          v-bind:key="vehicleTypeValue">
                  <option :value="vehicleTypeValue">{{ vehicleTypeName }}</option>
                </template>
              </select>
              <p class="mt-2 text-sm text-red-600" id="position-error" v-if="vehicleCreateErrors.vehicle_type">
                {{ vehicleCreateErrors.vehicle_type }}
              </p>
            </dd>
          </div>
          <div class="border-gray-100 px-4 py-6 sm:col-span-2 sm:px-6">
            <dt class="text-sm font-medium leading-6 text-gray-900">용도</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              <select id="position" name="position" :class="[...defaultSelect]" v-bind="position">
                <option value="">선택</option>
                <template v-for="[vehiclePositionValue, vehiclePositionName] in Object.entries(vehiclePositionChoice)"
                          v-bind:key="vehiclePositionValue">
                  <option :value="vehiclePositionValue">{{ vehiclePositionName }}</option>
                </template>
              </select>
              <p class="mt-2 text-sm text-red-600" id="vehicle_type-error" v-if="vehicleCreateErrors.position">
                {{ vehicleCreateErrors.position }}
              </p>
            </dd>
          </div>
        </dl>
      </div>
      <div class="border-t border-gray-100">
        <dl class="grid grid-cols-1 sm:grid-cols-3">
          <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-6">
            <dt class="text-sm font-medium leading-6 text-gray-900">소유자</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
  <!--            //'owner_party', 'user_party', 'manager_party',-->
              <VehiclePartySelector :label-string="'차량 소유자'" @selectParty="(value) => vehicleCreateSetFieldValue('owner_party', value)"/>
              <input type="text" id="owner_party" name="owner_party" :class="[...defaultTextInput]" v-bind="owner_party" class="hidden">
              <p class="mt-2 text-sm text-gray-900">* 자동차 등록증상 명의자를 선택하세요</p>
              <p class="mt-2 text-sm text-red-600" id="owner_party-error" v-if="vehicleCreateErrors.owner_party">
                {{ vehicleCreateErrors.owner_party }}
              </p>
            </dd>
          </div>
          <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-6">
            <dt class="text-sm font-medium leading-6 text-gray-900">사용자</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">

              <VehiclePartySelector :label-string="'차량 사용자'" @selectParty="(value) => vehicleCreateSetFieldValue('user_party', value)"/>
              <input type="text" id="user_party" name="user_party" :class="[...defaultTextInput]" v-bind="user_party" class="hidden">
              <p class="mt-2 text-sm text-gray-900">* 실제로 차량을 업무에 사용중인 당사자를 선택하세요</p>
              <p class="mt-2 text-sm text-red-600" id="user_party-error" v-if="vehicleCreateErrors.user_party">
                {{ vehicleCreateErrors.user_party }}
              </p>
            </dd>
          </div>
          <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-6">
            <dt class="text-sm font-medium leading-6 text-gray-900">관리자</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">

              <VehiclePartySelector :label-string="'차량 관리자'" @selectParty="(value) => vehicleCreateSetFieldValue('manager_party', value)"/>
              <input type="text" id="manager_party" name="manager_party" :class="[...defaultTextInput]" v-bind="manager_party" class="hidden">
              <p class="mt-2 text-sm text-gray-900">* 차량 관리에 소요되는 비용(수리비, 보험료 등)을 부담하는 당사자를 선택하세요</p>
              <p class="mt-2 text-sm text-red-600" id="manager_party-error" v-if="vehicleCreateErrors.manager_party">
                {{ vehicleCreateErrors.manager_party }}
              </p>
            </dd>
          </div>
        </dl>
      </div>


      <div class="mt-6 flex items-center justify-end gap-x-6">
        <router-link :to="{name: 'vehicle_list'}" type="button" class="text-sm font-semibold leading-6 text-gray-900">취소</router-link>
        <button type="submit"
                class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          저장
        </button>
      </div>
    </form>
  </div>
</template>
