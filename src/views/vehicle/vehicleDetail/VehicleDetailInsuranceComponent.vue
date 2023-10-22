<script setup>
import {defaultLabel, defaultSelect, defaultTextInput} from "@/styles"
import {useForm} from "vee-validate";
import {useRoute, useRouter} from "vue-router";
import {useErrorStore} from "@/stores/error";
import getVehicle from "@/apis/vehicle/get";
import {getVehicleInsurance, registerVehicleInsurance, vehicleInsuranceCertificate} from "@/apis/vehicle/insurance";
import CommonSelectComponent from "@/components/common/CommonSelectComponent.vue";
import FileUploadComponent from "@/components/common/FileUploadComponent.vue";
import VueDatePicker from "@vuepic/vue-datepicker";

import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import vehicleInsuranceCreateSchema from "@/validators/vehicle/insurance";
import PdfViewer from "@/components/common/PdfViewer.vue";
import {useViewerStore} from "@/stores/viewer";
import getRegistration from "@/apis/collection/company/getRegistration";

const router = useRouter()
const errorStore = useErrorStore()
const route = useRoute()
const vehicleId = parseInt(route.params.vehicleId)

const viewerStore = useViewerStore()
const vehicleData = await getVehicle(vehicleId)
const insuranceData = await getVehicleInsurance(vehicleId)
const insurerOptions = insuranceData.data.insurer.map((insurer) => {
  return {id: insurer[0], name: insurer[1]}
})

dayjs.extend(utc)
dayjs.locale('ko')
const {
  values: insuranceCreateValues,
  errors: insuranceCreateErrors,
  handleSubmit: insuranceCreateHandleSubmit,
  defineInputBinds: insuranceCreateDefineInputBind,
  setFieldValue: insuranceCreateSetFieldValue,
  setErrors: insuranceCreateSetSetError,
} = useForm({validationSchema: vehicleInsuranceCreateSchema});

const insurer = insuranceCreateDefineInputBind('insurer')
const policy_no = insuranceCreateDefineInputBind('policy_no')
const certificate = insuranceCreateDefineInputBind('certificate')
const insurance_duration = insuranceCreateDefineInputBind('insurance_duration')

const today = dayjs()


const onSubmit = insuranceCreateHandleSubmit(async values => {
  const response = await registerVehicleInsurance(vehicleId, values)
  if (response.success) {
    await router.go(0)
  }
});

const showCertificate = async (insurance) => {
  const certificationData = await vehicleInsuranceCertificate(vehicleId, insurance.id)
  await viewerStore.showViewer(certificationData.data.url)
}
</script>

<template>
  <div>
    <h2 class="text-base font-semibold leading-7 text-gray-900">보험정보</h2>
  </div>
  <div class="border-b border-gray-200 mb-5">
<!--    {{ insuranceCreateValues }}-->
    <form @submit.prevent="onSubmit" method="post">
      <div class="border-b border-gray-900/10 pb-12">
        <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
          <div class="sm:col-span-1">
            <label for="insurer" class="block text-sm font-medium leading-6 text-gray-900">보험사 <span
                class="text-red-600">*</span></label>
            <CommonSelectComponent @update:selectedOption="value => insuranceCreateSetFieldValue('insurer', value)"
                                   :select-options="insurerOptions" :selected-option-id="insurer.value"/>
            <p class="mt-2 text-sm text-red-600" id="insurer-error" v-if="insuranceCreateErrors.insurer">
              {{ insuranceCreateErrors.insurer }}
            </p>
          </div>
          <div class="sm:col-span-2">
            <label for="policy_no" class="block text-sm font-medium leading-6 text-gray-900">증권번호 <span
                class="text-red-600">*</span></label>
            <div class="mt-2">
              <input placeholder="증권번호" type="text" id="policy_no" name="policy_no" :class="[...defaultTextInput]"
                     :value="policy_no.value"
                     @input="event => insuranceCreateSetFieldValue('policy_no', event.target.value)">
            </div>
            <p class="mt-2 text-sm text-gray-900">* 공백 없이 입력해주세요</p>
            <p class="mt-2 text-sm text-red-600" id="policy_no-error" v-if="insuranceCreateErrors.policy_no">
              {{ insuranceCreateErrors.policy_no }}
            </p>
          </div>
          <div class="sm:col-span-2">
            <label for="certificate" class=" block text-sm font-medium leading-6 text-gray-900">증권파일 <span
                class="text-red-600">*</span></label>
            <div class="mt-2">
              <FileUploadComponent @deleteFileData="() => {insuranceCreateSetFieldValue('certificate', null)}"
                                   @setFileData="(fileData) => {insuranceCreateSetFieldValue('certificate', fileData.id)}"
              />
            </div>
            <p class="mt-2 text-sm text-red-600" id="certificate-error" v-if="insuranceCreateErrors.certificate">
              {{ insuranceCreateErrors.certificate }}
            </p>
          </div>
          <div class="sm:col-span-2">
            <label for="insurance_duration" class="defaultLabel">보험기간 <span class="text-red-600">*</span></label>
            <div class="mt-2">
              <VueDatePicker :input-class-name="defaultTextInput.join(' ')" :enable-time-picker="false"
                             :locale="'ko-Kr'" :range="true" :model-value="insuranceCreateValues.insurance_duration"
                             @update:model-value="(value) => insuranceCreateSetFieldValue('insurance_duration', value)"
                             :auto-apply="true" format="yyyy-MM-dd"/>
            </div>
            <p class="mt-2 text-sm text-red-600" id="insurance_duration-error"
               v-if="insuranceCreateErrors.insurance_duration">
              {{ insuranceCreateErrors.insurance_duration }}
            </p>
            <!--                <p class="mt-2 text-sm text-red-600" id="car_no-error" v-if="vehicleUpdateErrors.car_no">-->
            <!--                  {{ vehicleUpdateErrors.car_no }}-->
            <!--                </p>-->
          </div>
          <div class="sm:col-span-1">
            <div class="flex items-center justify-end gap-x-6 h-full">
              <button type="submit"
                      class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
  <div class="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
    <table class="min-w-full divide-y divide-gray-300">
      <thead>
      <tr>
        <th scope="col" class="py-3.5 pl-5 pr-3 text-left text-sm font-semibold text-gray-900">
          보험사
        </th>
        <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
          증권번호
        </th>
        <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
          증권파일
        </th>
        <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
          보험기간
        </th>
        <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
          취소
        </th>
        <th scope="col" class="py-3.5 pl-3 pr-5 text-left text-sm font-semibold text-gray-900">
          수정
        </th>
      </tr>
      </thead>
      <tbody v-if="insuranceData?.success">
      <template v-for="(insurance, insuranceIndex) in insuranceData?.data?.rows || []">
        <tr>
          <td :class="[insuranceIndex === 0 ? '' : 'border-t border-gray-200', 'hidden pl-5 pr-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ insurance.insurer_display }}
          </td>
          <td :class="[insuranceIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ insurance.policy_no }}
          </td>
          <td :class="[insuranceIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell']">
            <button type="button" @click="showCertificate(insurance)"
                    class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              보기
            </button>
          </td>
          <td :class="[insuranceIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ insurance.insurance_duration[0] }} ~ {{ insurance.insurance_duration[1] }}
          </td>
          <td :class="[insuranceIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ insurance.cancelled }}
          </td>
          <td :class="[insuranceIndex === 0 ? '' : 'border-t border-gray-200', 'hidden pl-3 pr-5 py-3.5 text-sm text-gray-500 lg:table-cell']">
            수정
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>

