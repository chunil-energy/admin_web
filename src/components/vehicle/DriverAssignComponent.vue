<script setup>

import UserSelector from "@/components/common/UserSelector.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import {toTypedSchema} from "@vee-validate/zod";
import * as zod from "zod";
import {useForm} from "vee-validate";
import vehicleUpdateSchema from "@/validators/vehicle/update";
import {ko} from 'date-fns/locale'
import {defaultTextInput} from "@/styles";
import {ref, watch} from "vue";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import setVehicleDriver from "@/apis/vehicle/driver/set";
import {useErrorStore} from "@/stores/error";
import {useRouter} from "vue-router";

dayjs.extend(utc)
dayjs.locale('ko')


const router = useRouter()

const driverRegisterSchema = toTypedSchema(
    zod.object({
      user: zod.number({required_error: "기사는 필수 항목입니다.",}),
      start_date: zod.string({required_error: "배정일을 선택하세요.",}).nonempty('배정일을 선택하세요.').pipe(zod.coerce.date()),
      end_date: zod.string({required_error: "해제일을 선택하세요.",}).nonempty('해제일을 선택하세요.').pipe(zod.coerce.date()),
    //   start_date: zod.coerce.date({
    //     invalyd_date_error: 'asdf',
    //     required_error: "배정일은 필수 항목입니다.",
    //     invalid_type_error: "올바르지 않은 날짜 형식입니다.",
    //   })
    })
);
const {
  values,
  errors,
  handleSubmit,
  defineInputBinds,
  setFieldValue,
  setErrors,
} = useForm({validationSchema: driverRegisterSchema});


const errorState = useErrorStore()

const props = defineProps({
  vehicleData: {
    type: Object,
    required: true
  }
})
const user = defineInputBinds('user')
const start_date = defineInputBinds('start_date')
const end_date = defineInputBinds('end_date')
const start_date_ref = ref()
const end_date_ref = ref()

watch(start_date_ref, (newValue, oldValue) => {
  setFieldValue('start_date', dayjs(newValue).format('YYYY-MM-DD'))
})

watch(end_date_ref, (newValue, oldValue) => {
  setFieldValue('end_date', dayjs(newValue).format('YYYY-MM-DD'))
})

const onsubmit = handleSubmit(async value => {
  const response = await setVehicleDriver(
      props.vehicleData.data.id, {
        user: value.user,
        start_date: dayjs(value.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(value.end_date).format('YYYY-MM-DD'),
      }
  )
  if (response.success !== true) {
    await errorState.set('error', '기사 등록 실패', response.msg)
  } else {
    await errorState.set('success', '기사 등록 성공', '기사가 배정되었습니다.').then(() => {
      router.go(0)
    })

  }
})
</script>

<template>
  <form @submit.prevent="onsubmit">
    <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9 sm:items-end">
      <div class="sm:col-span-3">
        <div class="mt-2">
          <label for="user" class="block text-sm font-medium leading-6 text-gray-900">기사</label>
          <UserSelector :label-string="'기사'" :placeholder-string="'기사 선택'" @selectUser="value => setFieldValue('user', value)"/>
        </div>
        <p class="mt-2 text-sm text-red-600" id="user-error" v-if="errors.user">
          {{ errors.user }}
        </p>
      </div>
      <div class="sm:col-span-2">
        <label for="start_date" class="block text-sm font-medium leading-6 text-gray-900">배정일</label>
        <div class="mt-2">
          <VueDatePicker :input-class-name="defaultTextInput.join(' ')" :enable-time-picker="false" :locale="'ko-Kr'" :format-locale="ko"
                         :auto-apply="true" format="yyyy-MM-dd" v-model="start_date_ref"/>
        </div>
        <p class="mt-2 text-sm text-red-600" id="start_date-error" v-if="errors.start_date">
          {{ errors.start_date }}
        </p>
      </div>
      <div class="sm:col-span-2">
        <label for="end_date" class="block text-sm font-medium leading-6 text-gray-900">해제일</label>
        <div class="mt-2">
          <VueDatePicker :input-class-name="defaultTextInput.join(' ')" :enable-time-picker="false" :locale="'ko-Kr'" :format-locale="ko"
                         :auto-apply="true" format="yyyy-MM-dd" v-model="end_date_ref"/>
        </div>
        <p class="mt-2 text-sm text-red-600" id="end_date-error" v-if="errors.end_date">
          {{ errors.end_date }}
        </p>
      </div>
      <div class="sm:col-span-2">
        <button type="submit"
                class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          기사 등록
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>

</style>