<script>
import {ref} from 'vue'
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {PauseIcon, StopIcon, PlayIcon} from '@heroicons/vue/20/solid'
import {XMarkIcon} from '@heroicons/vue/24/outline'
import {defaultTextInput} from "@/styles";
import VueDatePicker from "@vuepic/vue-datepicker";
import {getTrackerTripAPI} from "@/apis/gps";
import dateParser from "@/utils/common/dateParser";
import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/ko';


dayjs.extend(utc)
dayjs.locale('ko')

export default {
  name: "TripDialog",
  setup() {
    // const timeline = [
    //   {
    //     id: 1,
    //     content: 'Applied to',
    //     target: 'Front End Developer',
    //     href: '#',
    //     date: 'Sep 20',
    //     datetime: '2020-09-20',
    //     icon: UserIcon,
    //     iconBackground: 'bg-gray-400',
    //   },
    //   {
    //     id: 2,
    //     content: 'Advanced to phone screening by',
    //     target: 'Bethany Blake',
    //     href: '#',
    //     date: 'Sep 22',
    //     datetime: '2020-09-22',
    //     icon: HandThumbUpIcon,
    //     iconBackground: 'bg-blue-500',
    //   },
    //   {
    //     id: 3,
    //     content: 'Completed phone screening with',
    //     target: 'Martha Gardner',
    //     href: '#',
    //     date: 'Sep 28',
    //     datetime: '2020-09-28',
    //     icon: CheckIcon,
    //     iconBackground: 'bg-green-500',
    //   },
    //   {
    //     id: 4,
    //     content: 'Advanced to interview by',
    //     target: 'Bethany Blake',
    //     href: '#',
    //     date: 'Sep 30',
    //     datetime: '2020-09-30',
    //     icon: HandThumbUpIcon,
    //     iconBackground: 'bg-blue-500',
    //   },
    //   {
    //     id: 5,
    //     content: 'Completed interview with',
    //     target: 'Katherine Snyder',
    //     href: '#',
    //     date: 'Oct 4',
    //     datetime: '2020-10-04',
    //     icon: CheckIcon,
    //     iconBackground: 'bg-green-500',
    //   },
    // ]
    return {defaultTextInput}
  },
  components: {
    Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot, XMarkIcon, VueDatePicker,
    PauseIcon, PlayIcon, StopIcon
  },
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    trackerData: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      tripData: null,
      dateRange: [new Date(), new Date()]
    }
  },
  emits: ['closeDialog', 'drawTotalPolyline', 'removePartialPolyline', 'drawPartialPolyline'],
  methods: {
    dateParser,
    reset() {
      this.trackerData = null
      this.tripData = null
      this.dateRange = [new Date(), new Date()]
    },
    async getTrackerTrip() {
      let startDateString = dateParser(this.dateRange[0])
      let endDateString = dateParser(this.dateRange[1])
      this.tripData = await getTrackerTripAPI(this.trackerData.id, startDateString, endDateString)
      this.$emit('drawTotalPolyline', this.tripData.raw)
    },
    drawPartialPolyline(position) {
      console.log('drawPartialPolyline')
      this.$emit('drawPartialPolyline', this.tripData.raw, position)
    },
    removePartialPolyline() {
      console.log('removePartialPolyline')
      this.$emit('removePartialPolyline')
    },
    closeDialog() {
      this.reset()
      this.$emit('closeDialog')
    }
  },
  computed: {}
}
</script>

<template>

  <div class="col-span-2 px-4 py-2 h-screen overflow-auto" v-if="show">
    <div class="flex gap-1 mb-3">
      <div
          class="rounded-full bg-indigo-600 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {{ trackerData.target.type_display }}
      </div>
      <div>
        <h3 class="text-base font-semibold leading-7 text-gray-900">
          {{ trackerData.target.name }}
        </h3>
      </div>
      <!--          <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>-->
    </div>
    <div class="mb-5">
      <!--      {{ dateRange }}-->
      <!--      {{ dateRange === null }}-->
      <div class="mb-1">
        <!--        {{dateRange}}-->
        <VueDatePicker :input-class-name="defaultTextInput.join(' ')" :enable-time-picker="false"
                       :locale="'ko-Kr'" :range="true"
                       :model-value="dateRange"
                       @update:model-value="(value) => dateRange=value"
                       :auto-apply="true" format="yyyy-MM-dd"/>
      </div>
      <div>
        <button @click="getTrackerTrip"
                class="w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
          주행이력 조회
        </button>
      </div>
    </div>
    <template v-if="tripData">
      <template v-for="dateData in Object.entries(tripData.structured)" :key="dateData[0]">
        <div class="mb-4">
          <h3 class="text-base font-semibold leading-7 text-gray-900">
            {{ dateData[0] }}
          </h3>
        </div>
        <div class="flow-root">
          <ul role="list" class="-mb-8">
            <li v-for="(position, positionIndex) in dateData[1]"
                @mouseleave="removePartialPolyline"
                @mouseover="drawPartialPolyline(position)">
              <div class="relative pb-8" v-if="position.is_start === true || position.is_end === true">
                <!--                {{ position }}-->
                <!--                {{ positionIndex }}-->
                <template v-if="positionIndex !== 0">
                  <span v-if="position.trip_seq !== dateData[1][positionIndex-1].trip_seq"
                        class="absolute left-2.5 top-4 -ml-px h-full w-0.5 bg-gray-300" aria-hidden="true"/>
                </template>
                <template v-else>
                  <span class="absolute left-2.5 top-4 -ml-px h-full w-0.5 bg-gray-300" aria-hidden="true"/>
                </template>
                <div class="relative flex space-x-3">
                  <template v-if="position.is_start && position.is_end">
                    <div>
                      <span
                          class="bg-yellow-500 h-5 w-5 rounded-full flex items-center justify-center ring-8 ring-white">
                        <PauseIcon class="h-3 w-3 text-white" aria-hidden="true"/>
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-1 justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-500">1분 미만 운행(단순시동)</p>
                      </div>
                      <div class="whitespace-nowrap text-right text-sm text-gray-500">
                        <time :datetime="position.time">{{ position.time }}</time>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="position.is_start">
                    <div>
                      <span
                          class="bg-green-500 h-5 w-5 rounded-full flex items-center justify-center ring-8 ring-white">
                        <PlayIcon class="h-3 w-3 text-white" aria-hidden="true"/>
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-1 justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-500">운행 시작</p>
                      </div>
                      <div class="whitespace-nowrap text-right text-sm text-gray-500">
                        <time :datetime="position.time">{{ position.time }}</time>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="position.is_end">
                    <div>
                      <span class="bg-red-500 h-5 w-5 rounded-full flex items-center justify-center ring-8 ring-white">
                        <StopIcon class="h-3 w-3 text-white" aria-hidden="true"/>
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-1 justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-500">운행 종료</p>
                      </div>
                      <div class="whitespace-nowrap text-right text-sm text-gray-500">
                        <time :datetime="position.time">{{ position.time }}</time>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </template>
    <!--    <div v-if="tripData">-->
    <!--      <template v-for="dateData in Object.entries(tripData)">-->
    <!--        <div class="mb-1">-->
    <!--          <h3 class="text-base font-semibold leading-7 text-gray-900">-->
    <!--            주행일 : {{ dateData[0] }}-->
    <!--          </h3>-->
    <!--        </div>-->
    <!--        <div class="mb-2">-->
    <!--          <h5 class="text-base font-semibold leading-7 text-gray-900">-->
    <!--            주행번호 : {{ trip[0] }}-->
    <!--          </h5>-->
    <!--        </div>-->
    <!--        <div>-->
    <!--          {{ trip[1][0] }}-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </div>-->
  </div>
</template>

<style scoped>

</style>