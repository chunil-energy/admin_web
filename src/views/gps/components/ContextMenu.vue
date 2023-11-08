<script>
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'


export default {
  name: "ContextMenu",
  setup() {
    return {width: 200, height: 300}
  },
  components: {Menu, MenuButton, MenuItem, MenuItems},
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    position: {
      type: Array,
      required: true,
      default: [0, 0]
    },
    trackerData: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['setCenter', 'closeMenu', 'removeTracker', 'showTripDialog'],
  methods: {
    setCenter() {
      this.$emit('setCenter', this.trackerData)
      this.closeMenu()
    },
    closeMenu() {
      this.$emit('closeMenu')
    },
    removeTracker() {
      this.closeMenu()
      this.$emit('removeTracker', this.trackerData)
    },
    showTripDialog() {
      this.closeMenu()
      this.$emit('showTripDialog', this.trackerData)
    }
  },
  computed: {
    positionLeft() {
      if (window.innerWidth - this.position[0] < this.width) {
        return `${this.position[0] - this.width}px`
      } else {
        return `${this.position[0]}px`
      }
    },
    positionTop() {
      if (window.innerHeight - this.position[1] < this.height) {
        return `${this.position[1] - this.height}px`
      } else {
        return `${this.position[1]}px`
      }
    }
  },

}
</script>

<template>
    <div ref="menu" :style="{width: `${width}px`, left: positionLeft, top: positionTop}" v-if="show"
         class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div class="py-1">
        <template v-if="trackerData.last_position">
          <button class="text-gray-700 block px-4 py-2 text-sm text-left w-full" @click="setCenter">현위치 보기</button>
        </template>
        <template v-else>
          <button class="text-gray-700 block px-4 py-2 text-sm text-left w-full">위치정보 없음</button>
        </template>
        <button class="text-gray-700 block px-4 py-2 text-sm text-left w-full" @click="showTripDialog">경로보기</button>
        <button class="text-gray-700 block px-4 py-2 text-sm text-left w-full" @click="removeTracker">제거</button>
        <button class="text-gray-700 block px-4 py-2 text-sm text-left w-full" @click="closeMenu">닫기</button>
      </div>
    </div>
</template>

<style scoped>

</style>