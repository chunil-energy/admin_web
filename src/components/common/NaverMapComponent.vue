<script>
import {defineComponent} from 'vue'
import { loadScript } from "vue-plugin-load-script";

export default defineComponent({
  name: "NaverMapComponent",
  setup() {
    const ncpApiKey = 'temkao00ek'
    return {ncpApiKey}
  },
  props: {
    locationDataProp: {
      type: Object,
      required: true
    },
    mapWidth: {
      type: Number,
      required: false,
      default: 1024
    },
    mapHeight: {
      type: Number,
      required: false,
      default: 600
    },
    mapLevel: {
      type: Number,
      required: false,
      default: 16
    },
    highRes: {
      type: Boolean,
      required: false,
      default: true
    },
    imageFormat: {
      type: String,
      required: false,
      default: 'png'
    },
    mapType: {
      type: String,
      required: false,
      default: 'static'
    },
  },
  computed: {
    position() {
      return {
        x: this.locationDataProp.longitude,
        y: this.locationDataProp.latitude,
      }
    }
  },
  data() {
    return {
      map: null
    }
  },
  async mounted() {
    if (this.mapType === 'dynamic') {
      loadScript(`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=temkao00ek`).then(() => {
        this.loadDynamicMap()
      })
      // let mapScript = document.createElement('script')
      // document.head.appendChild(mapScript)
      // mapScript.onload(() => {
      //   this.loadDynamicMap()
      // })
      // mapScript.setAttribute('src', )
      // console.log(document.head)
      // console.log('document.head.appendChild(mapScript)')
    }
  },
  methods: {
    generateNaverStaticMapUrl() {
      const url = `https://naveropenapi.apigw.ntruss.com/map-static/v2/raster-cors?w=${this.mapWidth}&h=${this.mapHeight}&markers=type:d|size:mid|color:0x029DFF|pos:${this.position.x} ${this.position.y}&scale=${this.highRes ? 2:1}&format=${this.imageFormat}&center=${this.position.x},${this.position.y}&level=${this.mapLevel}&X-NCP-APIGW-API-KEY-ID=${this.ncpApiKey}`
      return url
    },
    loadDynamicMap() {
      const mapContainer = document.getElementById('mapContainer')
      const naverPosition = new naver.maps.LatLng(this.position.y, this.position.x)
      var mapOptions = {
        center: naverPosition,
        zoom: this.mapLevel,
        zoomControl: true, //줌 컨트롤의 표시 여부
        zoomControlOptions: { //줌 컨트롤의 옵션
          position: naver.maps.Position.TOP_RIGHT
        }
      };
      var map = new window.naver.maps.Map(mapContainer, mapOptions);
      const marker = new naver.maps.Marker({
        position: naverPosition,
        map: map
      });
    }
  }
})
</script>

<template>
<!--{{position}}-->
  <template v-if="mapType === 'static'">
    <img alt="지도" class="border border-gray-300 rounded" :src="generateNaverStaticMapUrl()">
  </template>
  <template v-else-if="mapType === 'dynamic'">
    <div id="mapContainer" class="border border-gray-300 rounded" style="min-height: 400px"/>
  </template>
</template>

<style scoped>

</style>