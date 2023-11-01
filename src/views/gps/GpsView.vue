<script>
import {useRoute} from "vue-router";
import {useErrorStore} from "@/stores/error";
import TrackerListComponents from "@/views/gps/components/TrackerListComponents.vue";
import {getGPSSession, getTrackerDetailAPI, setTrackerAPI} from "@/apis/gps";
import {useLayoutStore} from "@/stores/layout";
import ContextMenu from "@/views/gps/components/ContextMenu.vue";

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
      gpsAPIBaseUrl, layoutStore
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
      trackerList: [],
      contextMenuShow: false,
      contextMenuTracker: null,
      contextMenuPosition: [0, 0]
    }
  },
  mounted() {
    this.loadMap()
    // 최초 로딩시에는 설정된 트래커가 없으므로 redundant 하다
    // this.trackerList = this.gpsSession.tracker_set
  },
  components: {ContextMenu, TrackerListComponents},
  computed: {},
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
    createPolyline(tracker) {
      if (tracker.positions.length === 0) {
        return null
      }
      return new naver.maps.Polyline({
        map: this.map,
        path: tracker.positions.map(position => new naver.maps.LatLng(position.latitude, position.longitude)),
        clickable: false, // 사용자 인터랙션을 받기 위해 clickable을 true로 설정합니다.
        strokeColor: '#5347AA',
        strokeStyle: 'solid',
        strokeOpacity: 0.5,
        strokeWeight: 5
      });
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
    showContextMenu(event, tracker) {
      let pointerEvent = event
      if (event?.originalEvent) {
        pointerEvent = event.originalEvent
      }
      const position = [pointerEvent.clientX, pointerEvent.clientY]
      this.contextMenuShow =  true
      this.contextMenuTracker = tracker
      this.contextMenuPosition = position
    },
    closeContextMenu() {
      this.contextMenuShow =  false
      this.contextMenuTracker = null
      this.contextMenuPosition = [0, 0]
    },

    async getTrackerDetail(tracker) {
      const response = await getTrackerDetailAPI(tracker.id)
      console.log(response)
    },
  }
}

</script>

<template>
  <div style="width: 100%; height: 100vh">
    <!--    {{trackerList}}-->
    <div id="mapDiv" style="width: 100%; height: 100vh"></div>
    <div class="absolute top-5" :style="{width: `${layoutStore.contentWidth}px`}">
      <div class="flex items-center justify-center w-full px-3">
        <div class="flex bg-white w-11/12 rounded-2xl min-h-max px-4 py-3 shadow-xl">
          <div id="trackerList" class="flex-grow grid grid-cols-12 pr-4 gap-2">
            <template v-for="tracker in trackerList" v-bind:key="tracker.id">
              <div
                  class="w-full h-8 rounded-full bg-white ring-2 ring-inset ring-blue-600/90 pl-2 pr-4 flex justify-start items-center clickable"
                  @click="event => showContextMenu(event, tracker)">
                <div class="text-sm font-semibold truncate"><span class="font-bold">{{tracker.target.type_display + ' '}} </span>{{ tracker.target.name }}</div>
              </div>
            </template>
          </div>
          <div>
            <button
                class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                @click="showTrackerList = !showTrackerList">
              단말기 목록
            </button>
          </div>
        </div>
      </div>
    </div>
    <TrackerListComponents :show="showTrackerList"
                           :gps-session="gpsSession" @setTrackers="(value) => setTracker(value)"
                           @update:show="value => showTrackerList = value"/>
    <ContextMenu :show="contextMenuShow" :position="contextMenuPosition" :tracker-data="contextMenuTracker"
                 @closeMenu="closeContextMenu"
                 @removeTracker="tracker => removeTracker(tracker)"
                 @showRecentTrip="tracker => getTrackerDetail(tracker)"
                 @setCenter="tracker => setCenter(tracker)"/>
    <TripComponent/>
  </div>
  <!--  <div>-->
  <!--    -->
  <!--  </div>-->
</template>
