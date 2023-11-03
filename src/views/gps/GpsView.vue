<script>
import {useRoute} from "vue-router";
import {useErrorStore} from "@/stores/error";
import TrackerListComponents from "@/views/gps/components/TrackerListComponents.vue";
import {getGPSSession, setTrackerAPI} from "@/apis/gps";
import {useLayoutStore} from "@/stores/layout";
import ContextMenu from "@/views/gps/components/ContextMenu.vue";
import TripDialog from "@/views/gps/components/TripDialog.vue";
import {defaultTextInput} from "@/styles";

export default {
  name: 'GpsView',
  async setup() {
    const errorStore = useErrorStore()
    const layoutStore = useLayoutStore()
    const route = useRoute()
    // 지도 렌더링 관련
    const mapDiv = document.getElementById('mapDiv')
    const defaultPosition = {x: 127.055133, y: 37.540284}
    const defaultZoomLevel = 14
    const minZoomLevel = 9
    const ncpApiKeyId = 'temkao00ek'
    const ncpApiKey = 'yFpJQPeuVW7pLd1Iwfy9LVDIPSxcG3DNPfGJkEHd'
    // 세션
    const gpsSession = await getGPSSession()
    const gpsAPIBaseUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/gps/`
    return {
      errorStore, route, mapDiv, defaultPosition, defaultZoomLevel, minZoomLevel, ncpApiKeyId, ncpApiKey, gpsSession,
      gpsAPIBaseUrl, layoutStore, defaultTextInput
    }
  },
  data() {
    return {
      // 지도 렌더링 관련
      showTrackerList: false,
      map: null,
      zoomLevel: this.defaultZoomLevel,
      mapCenterPoint: this.defaultPosition,
      gpsPoint: null,
      mapBoundary: null,
      sample: [],
      // 단말기 목록 및 데이터
      trackerSearchQuery: '',
      trackerList: [],
      contextMenuShow: false,
      contextMenuTracker: null,
      contextMenuPosition: [0, 0],
      // 여정 목록
      tripDialogShow: false,
      tripTracker: null,
      tripTotalPolyline: null,
      tripPartialPolyline: null,
      tripMarkers: []
    }
  },
  mounted() {
    this.loadMap()
    // 최초 로딩시에는 설정된 트래커가 없으므로 redundant 하다
    // this.trackerList = this.gpsSession.tracker_set
  },
  components: {TripDialog, ContextMenu, TrackerListComponents},
  computed: {
    filteredTrackerList() {
      if (this.trackerSearchQuery) {
        return this.trackerList.filter(tracker => {
          return tracker.target.name.search(this.trackerSearchQuery) > -1
        })
      } else {
        return this.trackerList
      }
    }
  },
  methods: {
    setTrackerAPI,
    loadMap() {
      const script = document.createElement('script')
      script.setAttribute('src', `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${this.ncpApiKeyId}`)
      script.setAttribute('type', 'text/javascript')
      script.onload = async () => {
        // await this.setCurrentLocation()
        const center = this.gpsPoint ? this.gpsPoint : new naver.maps.LatLng(this.defaultPosition.y, this.defaultPosition.x)
        this.mapCenterPoint = center
        const mapOptions = {
          center: center,
          scrollWheel: true,
          zoom: this.zoomLevel,
          zoomControl: true,
          zoomControlOptions: {
            style: naver.maps.ZoomControlStyle.SMALL,
            position: naver.maps.Position.RIGHT_BOTTOM,
          },
          mapTypeId: naver.maps.MapTypeId.NORMAL
        }
        this.map = new naver.maps.Map(mapDiv, mapOptions);
        this.mapBoundary = this.map.getBounds();
        const _this = this
        naver.maps.Event.addListener(this.map, 'center_changed', function (e) {
          _this.mapCenterPoint = e
          _this.mapBoundary = _this.map.getBounds()
          _this.closeContextMenu()
        });
        naver.maps.Event.addListener(this.map, 'zoom_changed', function (e) {
          _this.zoomLevel = e
          _this.mapBoundary = _this.map.getBounds()
          _this.closeContextMenu()
        });
        // _this.map.addListener('click', (event) => {
        //   this.sample.push({latitude: event.coord.y, longitude: event.coord.x})
        //   console.log(`{"name": "장소명", "latitude": ${event.coord.y}, "longitude": ${event.coord.x}},`)
        // })
      }
      document.body.append(script)
    },
    generateMarkerIconHtml(tracker) {
      let htmlArray
      htmlArray = [
        `<div class="marker min-w-24 h-8 rounded-full bg-white ring-2 ring-inset ring-blue-600/90 pl-2 pr-4 flex justify-start items-center">`,
        // `<div class="flex justify-center items-center rounded-full text-white text-xs h-6 w-6 bg-blue-600 mr-1">단말기</div>`,
        `<div class="text-sm font-semibold truncate"><span class="font-bold">${tracker.target.type_display + ' '}</span>${tracker.target.name}</div>`,
        '</div>',
        `<div class="-translate-y-0.5 ml-4 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-blue-600 border-r-[6px] border-r-transparent"></div>`
      ]
      return htmlArray.join('')
    },
    generateTripMarkerIconHtml(position, title) {
      let htmlArray = []
      if (position.is_start && position.is_end) {
        htmlArray = [
          `<div class="marker min-w-24 h-8 rounded-full bg-yellow-500 ring-2 ring-inset ring-yellow-600/90 px-2 flex justify-start items-center text-center">`,
          `<div class="text-sm font-semibold truncate text-slate-50"><span class="font-bold">${title}</div>`,
          '</div>',
          `<div class="-translate-y-0.5 ml-4 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-yellow-600 border-r-[6px] border-r-transparent"></div>`
        ]
      } else if (position.is_start) {
        htmlArray = [
          `<div class="marker min-w-24 h-8 rounded-full bg-blue-500 ring-2 ring-inset ring-blue-600/90 px-2 flex justify-start items-center text-center">`,
          `<div class="text-sm font-semibold truncate text-slate-50"><span class="font-bold">${title}</div>`,
          '</div>',
          `<div class="-translate-y-0.5 ml-4 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-blue-600 border-r-[6px] border-r-transparent"></div>`
        ]
      } else if (position.is_end) {
        htmlArray = [
          `<div class="marker min-w-24 h-8 rounded-full bg-red-500 ring-2 ring-inset ring-red-600/90 px-2 flex justify-start items-center text-center">`,
          `<div class="text-sm font-semibold truncate text-slate-50"><span class="font-bold">${title}</div>`,
          '</div>',
          `<div class="-translate-y-0.5 ml-4 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-red-600 border-r-[6px] border-r-transparent"></div>`
        ]
      }
      return htmlArray.join('')
    },
    generateMarkerIcon(tracker) {
      return {
        content: this.generateMarkerIconHtml(tracker),
        anchor: new naver.maps.Point(22, 40),
      }
    },
    createMarker(tracker) {
      if (!tracker.last_position) {
        return null
      }
      const position = tracker.last_position
      return new naver.maps.Marker({
        position: new naver.maps.LatLng(position.latitude, position.longitude),
        map: this.map,
        title: tracker.target.name,
        icon: this.generateMarkerIcon(tracker),
        meta: tracker
      })
    },
    createTripMarker(position) {
      // const position = tracker.last_position
      let title
      let htmlArray
      if (position.is_start && position.is_end) {
        title = '단순시동'
      } else if (position.is_start) {
        title = '출발'
      } else if (position.is_end) {
        title = '도착'
      } else {
        return null
      }
      let marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(position.latitude, position.longitude),
        map: this.map,
        title: title,
        icon: {
          content: this.generateTripMarkerIconHtml(position, title),
          anchor: new naver.maps.Point(22, 40),
        },
        meta: position
      })
      console.log(marker)
      return marker
    },
    createPolyline(positions, color, style, opacity, weight) {
      return new naver.maps.Polyline({
        map: this.map,
        path: positions.map(position => new naver.maps.LatLng(position.latitude, position.longitude)),
        clickable: false, // 사용자 인터랙션을 받기 위해 clickable을 true로 설정합니다.
        strokeColor: color || '#5347AA',
        strokeStyle: style || 'solid',
        strokeOpacity: opacity || 0.2,
        strokeWeight: weight || 5
      });
    },
    drawTotalPolyline(positions) {
      if (this.tripTotalPolyline) {
        this.tripTotalPolyline.setMap(null)
      }
      if (positions.length !== 0) {
        this.tripTotalPolyline = this.createPolyline(positions, '#2711d4', 'solid', 0.5, 5)
      }
    },
    removeTotalPolyline() {
      if (this.tripTotalPolyline) {
        this.tripTotalPolyline.setMap(null)
        this.tripTotalPolyline = null
      }
    },
    drawPartialPolyline(positions, position) {
      positions = positions.filter(pos => pos.trip_seq === position.trip_seq)
      this.tripPartialPolyline = this.createPolyline(
          positions, '#d41179', 'solid', 1, 5
      )
      positions.filter(pos => pos.is_start || pos.is_end).map(pos => {
        this.tripMarkers.push(this.createTripMarker(pos))
      })
    },
    removePartialPolyline() {
      if (this.tripPartialPolyline) {
        this.tripPartialPolyline.setMap(null)
        this.tripPartialPolyline = null
      }
      this.tripMarkers.forEach(marker => marker.setMap(null))
    },
    addTracker(tracker) {
      let trackerIndex = this.trackerList.findIndex(existingTracker => existingTracker.id === tracker.id)
      if (trackerIndex > -1) {
        // refresh된 트래커의 경우 기존 단말기 목록에서 단말기 삭제 후 재등록
        this.removeTracker(tracker)
      }
      this.trackerList.push(tracker)
      trackerIndex = this.trackerList.findIndex(existingTracker => existingTracker.id === tracker.id)
      // last_position이 있는 경우 마커와 폴리라인 생성
      if (tracker.last_position) {
        let marker = this.createMarker(tracker)
        let listener = naver.maps.Event.addListener(marker, 'click', (event) => {
          this.showContextMenu(event, tracker)
        })
        this.trackerList[trackerIndex]['marker'] = marker
      }
    },
    removeTracker(tracker) {
      console.log(tracker)
      let trackerIndex = this.trackerList.findIndex(existingTracker => existingTracker.id === tracker.id)
      if (trackerIndex <= -1) {
        return null
      }
      // let polyline = this.trackerList[trackerIndex]['polyline']
      let marker = this.trackerList[trackerIndex]['marker']
      // 마커 삭제
      if (marker) {
        let listener = naver.maps.Event.addListener(marker, 'click', () => {
          naver.maps.Event.removeListener(listener)
        })
        marker.setMap(null)
      }
      this.trackerList.splice(trackerIndex, 1)
    },
    setTracker(trackerList) {
      trackerList.forEach(trackerData => {
        if (trackerData.action === 'add') {
          this.addTracker(trackerData)
        } else if (trackerData.action === 'remove') {
          this.removeTracker(trackerData)
        }
      })
    },
    updateTracker(tracker, last_position) {
      let trackerIndex = this.trackerList.findIndex(existingTracker => existingTracker.id === tracker.id)
      if (trackerIndex <= -1) {
        return null
      }
      this.trackerList[trackerIndex].last_position = last_position
      let newMarker = this.createMarker(this.trackerList[trackerIndex])
      let oldMarker = this.trackerList[trackerIndex].marker
      if (oldMarker) {
        oldMarker.setMap(null)
      }
      this.trackerList[trackerIndex].marker = newMarker
    },
    setCenter(tracker) {
      if (!tracker.last_position) {
        alert('위치정보가 없습니다.')
        return null
      }
      const position = tracker.last_position
      this.map.setCenter(new naver.maps.LatLng(position.latitude, position.longitude))
    },
    setPositionCenter(position) {
      this.map.setCenter(new naver.maps.LatLng(position.latitude, position.longitude))
    },
    showContextMenu(event, tracker) {
      let pointerEvent = event
      if (event?.originalEvent) {
        pointerEvent = event.originalEvent
      }
      const position = [pointerEvent.clientX, pointerEvent.clientY]
      this.contextMenuShow = true
      this.contextMenuTracker = tracker
      this.contextMenuPosition = position
    },
    closeContextMenu() {
      this.contextMenuShow = false
      this.contextMenuTracker = null
      this.contextMenuPosition = [0, 0]
    }
  }
}

</script>

<template>
  <div style="width: 100%; height: 100vh">
    <!--    <div class="absolute top-5" :style="{width: `${layoutStore.contentWidth}px`}">-->
    <!--      <div class="flex items-center justify-center w-full px-3">-->
    <!--        <div class="flex bg-white w-11/12 rounded-2xl min-h-max px-4 py-3 shadow-xl">-->
    <!--          <div id="trackerList" class="flex-grow grid grid-cols-12 pr-4 gap-2">-->
    <!--            <template v-for="tracker in trackerList" v-bind:key="tracker.id">-->
    <!--              <div-->
    <!--                  class="w-full h-8 rounded-full bg-white ring-2 ring-inset ring-blue-600/90 pl-2 pr-4 flex justify-start items-center clickable"-->
    <!--                  @click="event => showContextMenu(event, tracker)">-->
    <!--                <div class="text-sm font-semibold truncate"><span class="font-bold">{{tracker.target.type_display + ' '}} </span>{{ tracker.target.name }}</div>-->
    <!--              </div>-->
    <!--            </template>-->
    <!--          </div>-->
    <!--          <div>-->
    <!--            <button-->
    <!--                class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"-->
    <!--                @click="showTrackerList = !showTrackerList">-->
    <!--              단말기 목록-->
    <!--            </button>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="grid grid-cols-12 h-screen divide-x">
      <!--      <div class="col-span-1">-->
      <!--        sdf-->
      <!--      </div>-->
      <div class="col-span-1 p-2 h-screen overflow-auto">
        <div class="mb-2">
          <button
              class="w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
              @click="showTrackerList = !showTrackerList">
            단말기 목록
          </button>
        </div>
        <div class="mb-3">
          <input :class="defaultTextInput" placeholder="검색" @input="e => {trackerSearchQuery=e.target.value}">
        </div>
        <div class="w-full h-max">
          <template v-for="tracker in filteredTrackerList" v-bind:key="tracker.id">
            <div
                class="w-full h-8 rounded-full bg-white ring-2 ring-inset ring-blue-600/90 pl-2 pr-4 flex justify-start items-center clickable mb-1"
                @click="event => showContextMenu(event, tracker)">
              <div class="text-sm font-semibold truncate"><span
                  class="font-bold">{{ tracker.target.type_display + ' ' }} </span>{{ tracker.target.name }}
              </div>
            </div>
          </template>
        </div>
      </div>
      <TripDialog :show="tripDialogShow"
                  @drawTotalPolyline="positions => drawTotalPolyline(positions)"
                  @drawPartialPolyline="drawPartialPolyline"
                  @removePartialPolyline="removePartialPolyline"
                  @setCenter="setPositionCenter"
                  :tracker-data="tripTracker" @closeDialog="() => {tripDialogShow = false}"/>
      <!--      <div class="col-span-2 px-4 py-2 h-screen overflow-auto" v-if="tripDialogShow">-->
      <!--        <div>-->
      <!--          <h3 class="text-base font-semibold leading-7 text-gray-900">Applicant Information</h3>-->
      <!--          <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>-->
      <!--        </div>-->
      <!--      </div>-->
      <div :class="[tripDialogShow ? 'col-span-9' : 'col-span-11']">
        <div id="mapDiv" class="w-full h-screen"></div>
      </div>
    </div>

    <!--    <div class="absolute top-0 right-0" :style="{width: `200px`}">-->
    <!--      <div class="flex items-center justify-center w-full">-->
    <!--        <div class="bg-white p-3 w-full h-screen shadow-xl">-->
    <!--          <div id="trackerList" class="flex-grow grid grid-cols-12 pr-4 gap-2">-->
    <!--            <template v-for="tracker in trackerList" v-bind:key="tracker.id">-->
    <!--              <div-->
    <!--                  class="w-full h-8 rounded-full bg-white ring-2 ring-inset ring-blue-600/90 pl-2 pr-4 flex justify-start items-center clickable"-->
    <!--                  @click="event => showContextMenu(event, tracker)">-->
    <!--                <div class="text-sm font-semibold truncate"><span class="font-bold">{{tracker.target.type_display + ' '}} </span>{{ tracker.target.name }}</div>-->
    <!--              </div>-->
    <!--            </template>-->
    <!--          </div>-->
    <!--          <div class="w-full">-->
    <!--            <button-->
    <!--                class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"-->
    <!--                @click="showTrackerList = !showTrackerList">-->
    <!--              단말기 목록-->
    <!--            </button>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <TrackerListComponents :show="showTrackerList"
                           :gps-session="gpsSession" @setTrackers="(value) => setTracker(value)"
                           @update:show="value => showTrackerList = value"/>
    <ContextMenu :show="contextMenuShow" :position="contextMenuPosition" :tracker-data="contextMenuTracker"
                 @closeMenu="closeContextMenu"
                 @showTripDialog="(tracker) => {tripTracker = tracker; tripDialogShow = true; setCenter(tracker)}"
                 @removeTracker="tracker => removeTracker(tracker)"
                 @setCenter="tracker => setCenter(tracker)"/>
    <!--    <TripDialog :show="tripDialogShow" :tracker-data="tripTracker" @closeDialog="() => {tripDialogShow = false}"/>-->
  </div>
  <!--  <div>-->
  <!--    -->
  <!--  </div>-->
</template>

<style scoped>
.mapMarker {
    /* Set the marker size here */
    width: 2rem;
    height: 2rem;
    border-radius: 2rem;
    /* Set the marker color here */
    background: #aa3300;

    display: inline-block;
    border-bottom-right-radius: 0;
    position: relative;
    transform: rotate(45deg);

    /* optional fanciness */
    border: 1px solid #881100;
}
/* inner circle (optional if you don't need the central dot) */
.mapMarker::before {
    content: "";
    background: white;
    width: 50%;
    height: 50%;
    border-radius: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    /* optional fanciness */
    box-shadow: 0.1rem 0.1rem 0.2rem 0.1rem rgba(0, 0, 0, 0.1);
}
/* shadow (optional if you don't need a shadow) */
.mapMarker::after {
    content: "";
    background: rgba(128, 128, 128, 0.2);
    width: 75%;
    height: 75%;
    border-radius: 100%;
    position: absolute;
    top: 100%;
    left: 100%;
    transform: translate(-50%, -50%) rotate(45deg) scaleX(0.5);
}
</style>