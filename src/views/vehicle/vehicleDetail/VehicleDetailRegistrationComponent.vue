<script setup>
import {defaultTextInput} from "@/styles"
import {useForm} from "vee-validate";
import {useRoute, useRouter} from "vue-router";
import {useErrorStore} from "@/stores/error";
import {getVehicleInsurance, registerVehicleInsurance, vehicleInsuranceCertificate} from "@/apis/vehicle/insurance";
import CommonSelectComponent from "@/components/common/CommonSelectComponent.vue";
import FileUploadComponent from "@/components/common/FileUploadComponent.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import {ref, onMounted} from "vue";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import {useViewerStore} from "@/stores/viewer";
import vehicleRegistrationCreateSchema from "@/validators/vehicle/registration";
import {
  getVehicleRegistration,
  registerVehicleRegistration,
  vehicleRegistrationFile
} from "@/apis/vehicle/registration";

const router = useRouter()
const route = useRoute()
const errorStore = useErrorStore()
const viewerStore = useViewerStore()
const vehicleId = parseInt(route.params.vehicleId)

const registrationData = ref(null)

// await getVehicleRegistration(vehicleId)
onMounted(async () => {
  registrationData.value = await getVehicleRegistration(vehicleId)
})

dayjs.extend(utc)
dayjs.locale('ko')
const {
  values: registrationCreateValues,
  errors: registrationCreateErrors,
  handleSubmit: registrationCreateHandleSubmit,
  defineInputBinds: registrationCreateDefineInputBind,
  setFieldValue: registrationCreateSetFieldValue,
  setErrors: registrationCreateSetSetError,
} = useForm({validationSchema: vehicleRegistrationCreateSchema});

const issue_date = registrationCreateDefineInputBind('issue_date')
const registration = registrationCreateDefineInputBind('registration')
const memo = registrationCreateDefineInputBind('memo')

const today = dayjs()


const onSubmit = registrationCreateHandleSubmit(async values => {
  console.log(values)
  const response = await registerVehicleRegistration(vehicleId, values)
  if (response.success) {
    registrationData.value = await getVehicleRegistration(vehicleId)
  }
});

const showRegistration = async (registration) => {
  const certificationData = await vehicleRegistrationFile(vehicleId, registration.id)
  await viewerStore.showViewer(certificationData.data.url)
}
</script>

<template>
  <div>
    <h2 class="text-base font-semibold leading-7 text-gray-900">등록증</h2>
  </div>
  <div class="border-b border-gray-200 mb-5">
    {{ registrationCreateValues }}
    <form @submit.prevent="onSubmit" method="post">
      <div class="border-b border-gray-900/10 pb-12">
        <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
          <div class="sm:col-span-2">
            <label for="issue_date" class="defaultLabel">발급일 <span class="text-red-600">*</span></label>
            <div class="mt-2">
              <VueDatePicker :input-class-name="defaultTextInput.join(' ')" :enable-time-picker="false"
                             :locale="'ko-Kr'" :model-value="registrationCreateValues.issue_date"
                             @update:model-value="(value) => registrationCreateSetFieldValue('issue_date', dayjs(value).local().format('YYYY-MM-DD'))"
                             :auto-apply="true" format="yyyy-MM-dd"/>
            </div>
            <p class="mt-2 text-sm text-red-600" id="issue_date-error"
               v-if="registrationCreateErrors.issue_date">
              {{ registrationCreateErrors.issue_date }}
            </p>
          </div>
          <div class="sm:col-span-2">
            <label for="registration" class=" block text-sm font-medium leading-6 text-gray-900">파일 <span
                class="text-red-600">*</span></label>
            <div class="mt-2">
              <FileUploadComponent @deleteFileData="() => {registrationCreateSetFieldValue('registration', null)}"
                                   @setFileData="(fileData) => {registrationCreateSetFieldValue('registration', fileData.id)}"
              />
            </div>
            <p class="mt-2 text-sm text-red-600" id="registration-error" v-if="registrationCreateErrors.registration">
              {{ registrationCreateErrors.registration }}
            </p>
          </div>
          <div class="sm:col-span-2">
            <label for="policy_no" class="block text-sm font-medium leading-6 text-gray-900">메모</label>
            <div class="mt-2">
              <input placeholder="메모" type="text" id="memo" name="memo" :class="[...defaultTextInput]"
                     :value="memo.value"
                     @input="event => registrationCreateSetFieldValue('memo', event.target.value)">
            </div>
          </div>
          <div class="sm:col-span-1">
            <div class="flex items-end justify-end gap-x-6 h-full">
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
          발급일
        </th>
        <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
          증권파일
        </th>
        <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
          메모
        </th>
        <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
          등록일시
        </th>
        <th scope="col" class="py-3.5 pl-3 pr-5 text-left text-sm font-semibold text-gray-900">
          수정
        </th>
      </tr>
      </thead>
      <tbody v-if="registrationData?.success">
      <template v-for="(registration, registrationIndex) in registrationData?.data?.rows || []">
        <tr>
          <td :class="[registrationIndex === 0 ? '' : 'border-t border-gray-200', 'hidden pl-5 pr-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ registration.issue_date }}
          </td>
          <td :class="[registrationIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell']">
            <button type="button" @click="showRegistration(registration)"
                    class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              보기
            </button>
          </td>
          <td :class="[registrationIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ registration.memo }}
          </td>
          <td :class="[registrationIndex === 0 ? '' : 'border-t border-gray-200', 'hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell']">
            {{ dayjs(registration.registered_at).format('YYYY-MM-DD HH:mm') }}
          </td>
          <td :class="[registrationIndex === 0 ? '' : 'border-t border-gray-200', 'hidden pl-3 pr-5 py-3.5 text-sm text-gray-500 lg:table-cell']">
            수정
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>

