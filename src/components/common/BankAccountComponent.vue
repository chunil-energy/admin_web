<script setup>
import {computed, defineComponent, nextTick, onMounted, ref, watch} from 'vue'
import {loadScript} from "vue-plugin-load-script";
import axios, {all} from "axios";
import {defaultButton, defaultLabel, defaultSelect, defaultTextInput, disabledTextInput} from "@/styles";
import {XMarkIcon} from "@heroicons/vue/24/outline";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Listbox, ListboxButton,
  ListboxLabel, ListboxOption, ListboxOptions,
  TransitionChild,
  TransitionRoot
} from "@headlessui/vue";
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/vue/20/solid'
import onlyDigitParser from "@/utils/common/onlyDigitParser";
import {boolean} from "zod";
import {useForm} from "vee-validate";
import employeeDetailSchema from "@/validators/employee/employeeDetailSchema";
import {bankAccountSchema, bankAccountObject} from "@/validators/common/bankAccount";


const props = defineProps({
  initialData: {
    type: Object,
    required: false,
    default: null
  },
  labelString: {
    type: String,
    required: false,
    default: '은행 계좌'
  },
  placeholderString: {
    type: String,
    required: false,
    default: '은행 계좌'
  },
})

const emits = defineEmits(['setAccount'])
const open = ref(false)
const bankChoiceList = ref([])


const {
  values, errors, defineInputBinds, setFieldValue, handleSubmit,
    resetForm,
} = useForm({validationSchema: bankAccountSchema});

const bank = defineInputBinds('bank')
const account_number = defineInputBinds('account_number')
const account_holder = defineInputBinds('account_holder')

const getBankChoiceList = async () => {
  const bankChoiceListResponse = await axios({
    url: `${import.meta.env.VITE_API_URL}/api/admin/v1/common/bankaccount/`,
    method: 'post'
  })
  return bankChoiceListResponse.data
}


const close = () => {
  open.value = false
}

watch((open), async (newValue, oldValue) => {
  if (newValue === oldValue) {
    return null
  }
  if (newValue === true) {
    bankChoiceList.value = await getBankChoiceList()
    if (props.initialData) {
      setFieldValue('bank', props.initialData.bank)
    } else {
      setFieldValue('bank', bankChoiceList.value[0].value)
    }
  }
})

const selectedBankName = computed(() => {
  return bankChoiceList.value.filter((bankChoice) => bankChoice.value === values.bank)[0]?.name
})

const inputName = computed(() => {
  if (values.bank && values.account_number && values.account_holder) {
    return `${selectedBankName.value} ${values.account_holder} ${values.account_number}`
  } else {
    return null
  }
})

const setAccount = handleSubmit(async (formValue) => {
  emits('setAccount', formValue)
  open.value = false
})

const clearAccount = () => {
  resetForm()
  emits('setAccount', null)
}

</script>

<template>
  <template v-if="inputName">
    <div class="grid grid-cols-12 items-center gap-2">
      <div class="col-span-10">
        <div class="clickable" @click="open = true">
        <div class="truncate"><span class="font-bold">{{selectedBankName}}</span> {{ values.account_holder }} {{values.account_number}}</div>
        </div>
      </div>
      <div class='col-span-2'>
        <XMarkIcon class="w-5 h-5 clickable" @click="clearAccount"></XMarkIcon>
      </div>
    </div>
  </template>
  <template v-else>
  <input type="text" id="_bankAccountInput" name="_bankAccountInput" @click="open = true" readonly
         ref="_bankAccountInput"
         :value="inputName"
         :placeholder="placeholderString"
         :class="[...defaultTextInput, 'clickable']">
  </template>


  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="close">
      <TransitionChild as="template" enter="ease-in-out duration-200" enter-from="opacity-0" enter-to="opacity-100"
                       leave="ease-in-out duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
      </TransitionChild>
      <div class="fixed inset-0"/>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-16">
            <TransitionChild as="template" enter="transform transition ease-in-out duration-200 sm:duration-200"
                             enter-from="translate-x-full" enter-to="translate-x-0"
                             leave="transform transition ease-in-out duration-200 sm:duration-200"
                             leave-from="translate-x-0" leave-to="translate-x-full">
              <DialogPanel class="pointer-events-auto w-screen max-w-2xl">
                <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div class="p-6">
                    <div class="flex items-start justify-between">
                      <DialogTitle class="text-base font-semibold leading-6 text-gray-900">{{ labelString }}
                      </DialogTitle>
                      <div class="ml-3 flex h-7 items-center">
                        <button type="button"
                                class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                                @click="close">
                          <span class="absolute -inset-2.5"/>
                          <span class="sr-only">Close panel</span>
                          <XMarkIcon class="h-6 w-6" aria-hidden="true"/>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!--                  'id', 'name', 'bank', 'bank_display', 'account_number',-->
                  <!--                  'account_holder'-->

                  <div class="pt-4">
                    <div class="block px-6 pt-0">
                      <form class="col-span-2" @submit.prevent="setAccount">
                        <div class="grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-8">
                          <div class="sm:col-span-4">
                            <Listbox as="div" class=""
                                     @update:modelValue="value => setFieldValue('bank', value)">
                              <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900">은행
                              </ListboxLabel>
                              <div class="relative mt-2">
                                <ListboxButton
                                    class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                  <span class="block truncate">{{ selectedBankName }}</span>
                                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                  </span>
                                </ListboxButton>

                                <transition leave-active-class="transition ease-in duration-100"
                                            leave-from-class="opacity-100" leave-to-class="opacity-0">
                                  <ListboxOptions
                                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    <ListboxOption as="template" v-for="bankAccountChoice in bankChoiceList"
                                                   :key="bankAccountChoice.value"
                                                   :value="bankAccountChoice.value"
                                                   v-slot="{ active, selected }">
                                      <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                                        <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{
                                            bankAccountChoice.name
                                          }}</span>

                                        <span v-if="selected"
                                              :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 left-0 flex items-center pl-1.5']">
                                          <CheckIcon class="h-5 w-5" aria-hidden="true"/>
                                        </span>
                                      </li>
                                    </ListboxOption>
                                  </ListboxOptions>
                                </transition>
                              </div>
                              <p class="mt-2 text-sm text-red-600" id="bank-error" v-if="errors.bank">
                                {{ errors.bank }}</p>
                            </Listbox>
                          </div>
                          <div class="sm:col-span-4">
                            <label for="account_holder" :class="defaultLabel">예금주</label>
                            <div class="mt-2">
                              <input type="text" id="account_holder" name="account_holder" :class="defaultTextInput"
                                     :value="account_holder.value"
                                     @input="setFieldValue('account_holder', $event.target.value)">
                            </div>
                            <p class="mt-2 text-sm text-red-600" id="account_holder-error" v-if="errors.account_holder">
                              {{ errors.account_holder }}</p>
                          </div>
                          <div class="sm:col-span-8">
                            <label for="account_number" :class="defaultLabel">계좌번호</label>
                            <div class="mt-2">
                              <input type="text" id="account_number" name="account_number"
                                     :value="account_number.value" @input="(event) => {
                                       event.target.value=onlyDigitParser(event.target.value)
                                       setFieldValue('account_number', event.target.value)
                                     }"
                                     :class="defaultTextInput">
                            </div>
                            <p class="mt-2 text-sm text-red-600" id="account_number-error" v-if="errors.account_number">
                              {{ errors.account_number }}</p>
                          </div>
                        </div>
                        <div class="mt-3 text-right">

                          <button type="submit"
                                  :class="[...defaultButton, 'w-24']">
                            확인
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>

</style>