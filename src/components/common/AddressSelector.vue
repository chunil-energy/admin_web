<template>
  <input type="text" id="addressDisplay" name="addressDisplay" @click="open = true" readonly ref="addressDisplayInput"
         :placeholder="placeholderString"
         :class="[...defaultTextInput, 'clickable']">
  <!--         :value="selectedUser ? userParser(selectedUser) : ''">-->
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
              <DialogPanel class="pointer-events-auto w-screen"
                           :class="searchType === 'map' ? 'max-w-2xl' : 'max-w-2xl'">
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
                  <form @submit.prevent="onSubmit">
                    <div class="px-4 pt-6" v-if="useName">
                      <div class="grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-8">
                        <div class="sm:col-span-4">
                          <label for="name" :class="defaultLabel">주소 별칭</label>
                          <div class="mt-2">
                            <input type="text" name="name" id="name"
                                   placeholder="주소 별칭"
                                   v-bind="nameInputBinding"
                                   :class="[...defaultTextInput]"/>
                          </div>
                          <p class="mt-2 text-sm text-red-600" id="name-error" v-if="formErrors.name">
                            {{ formErrors.name }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="px-4 pt-6">
                      <label for="roadAddress" :class="defaultLabel">도로명 주소</label>
                      <div class="mt-2" v-if="formValues.address">
                        <div class="flex gap-x-3 gap-y-8">
                          <div class="grow">
                            {{ formValues.address }}
                          </div>
                          <div>
                            <XMarkIcon class="w-5 h-5 clickable" @click="clearAddress"></XMarkIcon>
                          </div>
                        </div>
                      </div>
                      <div class=mt-2 v-else>
                        <div class="block">
                          <div class="border-b border-gray-200">
                            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                              <a v-for="tab in tabs"
                                 :key="tab.value" href="#"
                                 :class="[tab.value === searchType ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium']"
                                 @click="searchType = tab.value"
                                 :aria-current="tab.value === searchType ? 'page' : undefined">
                                <component :is="tab.icon"
                                           :class="[tab.value === searchType ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500', '-ml-0.5 mr-2 h-5 w-5']"
                                           aria-hidden="true"/>
                                <span>{{ tab.name }}</span>
                              </a>
                            </nav>
                          </div>
                        </div>
                        <div :class="searchType === 'address' ? 'block':'hidden'" class="px-0 pt-4">
                          <form class="col-span-2" @submit.prevent="searchQuery">
                            <div class="grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-8">
                              <div class="sm:col-span-4">
                                <input type="text" name="locationQuery" id="locationQuery"
                                       ref="locationQueryInput"
                                       @input="locationQuery = $event.target.value"
                                       placeholder="주소 검색"
                                       :value="locationQuery"
                                       :class="[...defaultTextInput]"/>
                              </div>
                              <div class="sm:col-span-2">
                                <button type="button" @click.prevent="searchQuery"
                                        class="rounded-md bg-indigo-600 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                  검색
                                </button>
                              </div>
                            </div>
                            <div class="py-3 h-full overflow-y-auto">
                              <template v-if="addressList">
                                <template v-if="addressList.length === 0">
                                  <div class="py-5 text-gray-500 text-center">검색 결과가 없습니다.</div>
                                </template>
                                <template v-else>
                                  <ul role="list" class="grid grid-cols-1 gap-2">
                                    <li v-for="(addressData, addressIndex) in addressList" :key="addressIndex"
                                        class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white border border-gray-300 clickable"
                                        @click.prevent="selectAddress(addressData, 'address')">
                                      <div class="flex w-full items-center justify-between space-x-6 p-4">
                                        <div class="flex-1">
                                          <div class="flex items-center space-x-3 mb-2">
                                            <h3 class="text-sm font-medium text-gray-900">{{
                                                addressData.roadAddress
                                              }}</h3>
                                          </div>
                                          <div class="text-xs font-normal text-gray-600 mb-1"><span
                                              class="font-bold text-gray-900">우편번호</span> {{ popPostCode(addressData) }}
                                          </div>
                                          <div class="text-xs font-normal text-gray-600"><span
                                              class="font-bold text-gray-900">지번</span> {{ addressData.jibunAddress }}
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </template>
                              </template>
                              <template v-else>
                                <div class="py-5 text-gray-500 text-center">검색할 주소를 입력 후 "검색" 버튼을 누르세요</div>
                              </template>
                            </div>
                          </form>
                        </div>
                        <div :class="searchType === 'map' ? 'block':'hidden'" class="px-0 pt-4">
                          <div class="py-3 h-full overflow-y-auto">
                            <template v-if="mapAddressList">
                              <template v-if="mapAddressList.length === 0">
                                <div class="py-5 text-gray-500 text-center">해당 위치의 주소를 특정할 수 없습니다.</div>
                              </template>
                              <template v-else>
                                <ul role="list" class="grid grid-cols-1 gap-2">
                                  <li v-for="(addressData, addressIndex) in mapAddressList" :key="addressIndex"
                                      class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white border border-gray-300 clickable"
                                      @click.prevent="selectAddress(addressData, 'map')">
                                    <div class="flex w-full items-center justify-between space-x-6 p-4">
                                      <div class="flex-1">
                                        <div class="flex items-center space-x-3">
                                          <h3 class="text-sm font-medium text-gray-900">{{
                                              addressData.roadAddress
                                            }}</h3>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </template>
                            </template>
                            <template v-else>
                              <div class="py-5 text-gray-500 text-center">지도상에서 원하는 위치를 클릭하세요.</div>
                            </template>
                          </div>
                          <div ref="mapContainer" id="mapContainer" class="rounded-md"
                               style="width:100%;height:600px;"></div>
                        </div>
                      </div>
                    </div>
                    <div class="px-4 pt-6" v-if="formValues.address">
                      <label for="addressDetail" :class="defaultLabel">상세 주소</label>
                      <div class="mt-2">
                        <input type="text" name="addressDetail" id="addressDetail"
                               placeholder="상세주소"
                               ref="addressDetailInput"
                               v-bind="addressDetailInputBinding"
                               :class="[...defaultTextInput]"/>
                      </div>
                      <p class="mt-2 text-sm text-red-600" id="address_detail-error" v-if="formErrors.address_detail">
                        {{ formErrors.address_detail }}
                      </p>
                    </div>
                    <div class="px-4 pt-3" v-if="formValues.address">
                      <button type="submit"
                              :class="defaultButton">
                        저장
                      </button>
                    </div>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>


import {useErrorStore} from "@/stores/error";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {XMarkIcon, ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/24/outline'
import {MagnifyingGlassIcon, MapIcon, EllipsisVerticalIcon} from '@heroicons/vue/20/solid'
import {defaultButton, defaultLabel, defaultTextInput} from "@/styles";
import {defineComponent, ref, defineEmits} from "vue";
import lookupAddress from "@/apis/common/location/lookupAddress";
import reverseGeocode from "@/apis/common/location/reverseGeocode";
import {useForm} from "vee-validate";
import {locationSchema} from "@/validators/common/location";

export default defineComponent({
  name: 'AddressSelect',
  setup(props, context) {
    const locationQuery = ref('')
    const addressList = ref(null)
    const mapAddressList = ref(null)
    const map = ref(null)
    const addressDetail = ref('')
    const searchType = ref('address')
    const open = ref(false)
    const {
      values, errors, handleSubmit,
      defineInputBinds,
      setFieldValue, resetForm
    } = useForm({validationSchema: locationSchema});

    const nameInputBinding = defineInputBinds('name')
    const addressInputBinding = defineInputBinds('address')
    const addressDetailInputBinding = defineInputBinds('address_detail')
    const metaInputBinding = defineInputBinds('meta')
    const descriptionInputBinding = defineInputBinds('description')
    const tabs = [
      {name: '주소로 검색', value: 'address', href: '#', icon: MagnifyingGlassIcon},
      {name: '지도로 지정', value: 'map', href: '#', icon: MapIcon}
    ]
    const errorState = useErrorStore()

    const close = () => {
      locationQuery.value = ''
      addressList.value = null
      mapAddressList.value = null
      map.value = null
      addressDetail.value = ''
      searchType.value = 'address'
      open.value = false
    }
    const onSubmit = handleSubmit(async (fv) => {
      context.emit('selectLocation', fv)
      close()
    })
    return {
      locationQuery,
      addressList,
      mapAddressList,
      map,
      addressDetail,
      searchType,
      open,
      close,
      errorState, defaultTextInput, defaultLabel, defaultButton, tabs,
      formValues: values,
      formErrors: errors,
      formHandleSubmit: handleSubmit,
      formDefineInputBinds: defineInputBinds,
      formSetFieldValue: setFieldValue,
      formResetForm: resetForm,
      nameInputBinding, addressInputBinding, addressDetailInputBinding, metaInputBinding, descriptionInputBinding,
      onSubmit
    }
  },
  components: {
    Dialog, DialogPanel, DialogTitle,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
    XMarkIcon, EllipsisVerticalIcon,
    ChevronLeftIcon, ChevronRightIcon
  },
  props: {
    initialData: {
      type: Object,
      required: false,
      default: null
    },
    openProp: {
      type: Boolean,
      required: false,
      default: false
    },
    useName: {
      type: Boolean,
      required: false,
      default: true
    },
    useDescription: {
      type: Boolean,
      required: false,
      default: true
    },
    placeholderString: {
      type: String,
      required: false,
      default: '소재지'
    },
    labelString: {
      type: String,
      required: false,
      default: '주소 검색'
    }
  },
  emits: ['selectLocation'],
  async mounted() {
    this.open = this.openProp
    let mapScript = document.createElement('script')
    mapScript.setAttribute('src', `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=temkao00ek`)
    document.head.appendChild(mapScript)
    if (this.initialData) {
      this.$emit('selectLocation', this.initialData)
    }
  },
  watch: {
    async open(newValue, oldValue) {
      if (newValue === oldValue) return
      if (newValue === true && this.searchType === 'address') {
        await this.$nextTick(() => {
          this.$refs.locationQueryInput.focus()
        })
      }
    },
    async searchType(newValue, oldValue) {
      if (newValue === oldValue) return null
      if (this.open !== true) return null
      if (newValue === 'address') {
        await this.$nextTick(() => {
          this.$refs.locationQueryInput.focus()
        })
      } else {
        await this.$nextTick(() => {
          this.loadMap()
        })
      }
    }
  },
  methods: {
    async searchQuery() {
      // 주소 검색
      const response = await lookupAddress(this.locationQuery)
      if (!response.success) {
        await this.errorState.set('error', '주소 조회 실패', response.message)
        this.addressList = null
      } else {
        this.addressList = response.data.data
      }
    },
    selectAddress(addressData, type) {
      let tempAddressData = type === 'address' ? addressData : addressData.body
      tempAddressData['type'] = type
      this.formSetFieldValue('meta', tempAddressData)
      this.formSetFieldValue('address', addressData.roadAddress)
      this.$refs.addressDisplayInput.value = addressData.roadAddress
      this.$nextTick(() => {
        this.$refs.addressDetailInput.focus()
      })
    },
    async loadMap() {
      // 지도 최초 로딩
      const mapContainer = document.getElementById('mapContainer')
      const position = new naver.maps.LatLng(37.5403576, 127.0551038)
      var mapOptions = {
        center: position,
        zoom: 16
      };
      this.map = new window.naver.maps.Map(mapContainer, mapOptions);
      const marker = new naver.maps.Marker({
        position: position,
        map: this.map
      });
      let _this = this
      this.$nextTick(() => {
        naver.maps.Event.addListener(this.map, 'click', async function (e) {
          marker.setPosition(e.latlng)
          const rgResult = await reverseGeocode(e.latlng.y, e.latlng.x)
          _this.mapAddressList = rgResult.data.data.map((tempData) => {
            tempData['body']['position'] = {x: e.latlng.x, y: e.latlng.y}
            return tempData
          })
        });
      })
    },
    popPostCode(addressData) {
      if (!addressData) return null
      const filtered = Object.values(addressData.addressElements).filter((addressElement) => {
        return addressElement.types[0] === 'POSTAL_CODE'
      })
      if (filtered.length !== 0) {
        return filtered[0].shortName
      }
      return null
    },
    clearAddress() {
      this.searchType = 'address'
      this.formResetForm()
    }
  }
})
</script>