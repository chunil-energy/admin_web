<script setup>
import {vehiclePositionChoice, vehicleTypeChoice} from "@/choices/vehicle";
import {defaultSelect, defaultTextInput} from "@/styles"
import VehiclePartySelector from "@/components/vehicle/VehiclePartySelector.vue";
import {useForm} from "vee-validate";
import {BanknotesIcon, BuildingOfficeIcon, WrenchIcon} from "@heroicons/vue/20/solid";
import {useRoute, useRouter} from "vue-router";
import {useErrorStore} from "@/stores/error";
import onlyKorNumberParser from "@/utils/common/onlyKorNumberParser";
import getVehicle from "@/apis/vehicle/get";
import updateVehicle from "@/apis/vehicle/update";
import vehicleUpdateSchema from "@/validators/vehicle/update";
import EmployeeSelector from "@/components/common/EmployeeSelector.vue";
import {ref, computed} from "vue";

const router = useRouter()
const errorStore = useErrorStore()
const route = useRoute()
const vehicleId = route.params.vehicleId

const vehicleData = await getVehicle(vehicleId)

const {
  values: vehicleUpdateValues,
  errors: vehicleUpdateErrors,
  handleSubmit: vehicleUpdateHandleSubmit,
  defineInputBinds: vehicleUpdateDefineInputBind,
  setFieldValue: vehicleUpdateSetFieldValue,
  setErrors: vehicleUpdateSetSetError,
} = useForm({validationSchema: vehicleUpdateSchema, initialValues: vehicleData.data});

const car_no = vehicleUpdateDefineInputBind('car_no')
const vin = vehicleUpdateDefineInputBind('vin')
const name = vehicleUpdateDefineInputBind('name')
const position = vehicleUpdateDefineInputBind('position')
const vehicle_type = vehicleUpdateDefineInputBind('vehicle_type')
const owner_party = vehicleUpdateDefineInputBind('owner_party')
const user_party = vehicleUpdateDefineInputBind('user_party')
const manager_party = vehicleUpdateDefineInputBind('manager_party')
const driver = vehicleUpdateDefineInputBind('driver')

const onSubmit = vehicleUpdateHandleSubmit(async values => {
  const response = await updateVehicle(vehicleId, values)
  await errorStore.set('success', '성공', `${response.data.car_no} 변경사항이 저장되었습니다.`)
  await router.push({name: 'vehicle_detail', params: {vehicleId: response.data.id}})
});


</script>

<template>
  <div>
    <h2 class="text-base font-semibold leading-7 text-gray-900">기본정보</h2>
  </div>
  <form @submit.prevent="onSubmit" method="post">
    <div class="border-b border-gray-900/10 pb-12">
      <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
        <div class="sm:col-span-2">
          <label for="car_no" class="block text-sm font-medium leading-6 text-gray-900">차량번호</label>
          <div class="mt-2">
            <input type="text" id="car_no" name="car_no" :class="[...defaultTextInput]"
                   @input="vehicleUpdateSetFieldValue('car_no', onlyKorNumberParser($event.target.value))"
                   :value="car_no.value"
            >
          </div>
          <p class="mt-2 text-sm text-gray-900">* 공백 없이 입력해주세요</p>
          <p class="mt-2 text-sm text-red-600" id="car_no-error" v-if="vehicleUpdateErrors.car_no">
            {{ vehicleUpdateErrors.car_no }}
          </p>
        </div>
        <div class="sm:col-span-4">
          <label for="vin" class="block text-sm font-medium leading-6 text-gray-900">차대번호</label>
          <div class="mt-2">
            <div type="text" id="vin"
                 :class="['block', 'w-full', 'border-0', 'py-1.5', 'text-gray-900', 'placeholder:text-gray-400', 'sm:text-sm', 'sm:leading-6']">
              {{ vin.value }}
            </div>
          </div>
          <p class="mt-2 text-sm text-red-600" id="vin-error" v-if="vehicleUpdateErrors.vin">
            {{ vehicleUpdateErrors.vin }}
          </p>
        </div>
        <div class="sm:col-span-3">
          <label for="name" class="block text-sm font-medium leading-6 text-gray-900">차명</label>
          <div class="mt-2">
            <input type="text" id="name" name="name" :class="[...defaultTextInput]" placeholder="현대 포터"
                   v-bind="name">
          </div>
          <p class="mt-2 text-sm text-red-600" id="name-error" v-if="vehicleUpdateErrors.name">
            {{ vehicleUpdateErrors.name }}
          </p>
        </div>
      </div>
      <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9 border-b pb-10">
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
          <p class="mt-2 text-sm text-red-600" id="position-error" v-if="vehicleUpdateErrors.vehicle_type">
            {{ vehicleUpdateErrors.vehicle_type }}
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
          <p class="mt-2 text-sm text-red-600" id="vehicle_type-error" v-if="vehicleUpdateErrors.position">
            {{ vehicleUpdateErrors.position }}
          </p>
        </div>
        <div class="sm:col-span-3">
          <label for="position" class="block text-sm font-medium leading-6 text-gray-900">기사</label>
          <div class="mt-2">
            <EmployeeSelector :initial-employee="driver.value" :placeholder-string="'기사'" :label-string="'기사'"
                              @selectEmployee="value => vehicleUpdateSetFieldValue('driver', value)"/>
          </div>
          <p class="mt-2 text-sm text-red-600" id="vehicle_type-error" v-if="vehicleUpdateErrors.driver">
            {{ vehicleUpdateErrors.driver }}
          </p>
        </div>
      </div>
      <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
        <div class="sm:col-span-3">
          <label for="owner_party" class="block text-sm font-medium leading-6 text-gray-900">소유자</label>
          <div class="mt-2">
            <VehiclePartySelector :label-string="'차량 소유자'" :selected-vehicle-party="owner_party"
                                  @selectParty="(value) => vehicleUpdateSetFieldValue('owner_party', value)"/>
            <!--                  <input type="text" id="owner_party" name="owner_party" :class="[...defaultTextInput]" v-bind="owner_party"-->
            <!--                         class="hidden">-->
          </div>
          <p class="mt-2 text-sm text-gray-900">* 자동차 등록증상 명의자를 선택하세요</p>
          <p class="mt-2 text-sm text-red-600" id="owner_party-error" v-if="vehicleUpdateErrors.owner_party">
            {{ vehicleUpdateErrors.owner_party }}
          </p>
        </div>
        <div class="sm:col-span-3">
          <label for="user_party" class="block text-sm font-medium leading-6 text-gray-900">소유자</label>
          <div class="mt-2">

            <VehiclePartySelector :label-string="'차량 사용자'" :selected-vehicle-party="user_party"
                                  @selectParty="(value) => vehicleUpdateSetFieldValue('user_party', value)"/>
            <!--                  <input type="text" id="user_party" name="user_party" :class="[...defaultTextInput]" v-bind="user_party"-->
            <!--                         class="hidden">-->
          </div>
          <p class="mt-2 text-sm text-gray-900">* 실제로 차량을 업무에 사용중인 당사자를 선택하세요</p>
          <p class="mt-2 text-sm text-red-600" id="user_party-error" v-if="vehicleUpdateErrors.user_party">
            {{ vehicleUpdateErrors.user_party }}
          </p>
        </div>
        <div class="sm:col-span-3">
          <label for="manager_party" class="block text-sm font-medium leading-6 text-gray-900">관리자</label>
          <div class="mt-2">

            <VehiclePartySelector :label-string="'차량 관리자'" :selected-vehicle-party="manager_party"
                                  @selectParty="(value) => vehicleUpdateSetFieldValue('manager_party', value)"/>
            <!--                  <input type="text" id="manager_party" name="manager_party" :class="[...defaultTextInput]"-->
            <!--                         v-bind="manager_party" class="hidden">-->
          </div>
          <p class="mt-2 text-sm text-gray-900">* 차량 관리에 소요되는 비용(수리비, 보험료 등)을 부담하는 당사자를 선택하세요</p>
          <p class="mt-2 text-sm text-red-600" id="manager_party-error"
             v-if="vehicleUpdateErrors.manager_party">
            {{ vehicleUpdateErrors.manager_party }}
          </p>
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
</template>

