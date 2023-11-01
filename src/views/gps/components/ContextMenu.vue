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
  emits: ['setCenter', 'closeMenu', 'removeTracker', 'showRecentTrip'],
  methods: {
    setCenter() {
      this.$emit('setCenter', this.trackerData)
      this.closeMenu()
    },
    closeMenu() {
      this.$emit('closeMenu')
    },
    removeTracker() {
      this.$emit('removeTracker', this.trackerData)
      this.closeMenu()
    },
    showRecentTrip() {
      this.$emit('showRecentTrip', this.trackerData)
      this.closeMenu()
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
  }
}
</script>

<template>
  <!--  <div :style="{'position': 'absolute', width: '300px', height: '300px', left: positionLeft, top: positionTop}"-->
  <!--       class="bg-white" >-->

  <div :style="{width: `${width}px`, left: positionLeft, top: positionTop}" v-if="show"
       class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
    <div class="py-1">
      <template v-if="trackerData.last_position">
        <button class="text-gray-700 block px-4 py-2 text-sm text-left w-full" @click="setCenter">현위치 보기</button>
      </template>
      <template v-else>
        <button class="text-gray-700 block px-4 py-2 text-sm text-left w-full">위치정보 없음</button>
      </template>
        <button class="text-gray-700 block px-4 py-2 text-sm text-left w-full" @click="showRecentTrip">최근경로</button>
        <button class="text-gray-700 block px-4 py-2 text-sm text-left w-full" @click="removeTracker">제거</button>
    </div>
  </div>


  <!-- <Menu as="div" class="relative inline-block text-left" v-slot="{active}">-->
  <!--   -->
  <!--   {{active}}-->
  <!--      <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">-->
  <!--      <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">-->
  <!--        <div class="py-1">-->
  <!--          <MenuItem v-slot="{ active }">-->
  <!--            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Account settings</a>-->
  <!--          </MenuItem>-->
  <!--          <MenuItem v-slot="{ active }">-->
  <!--            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Support</a>-->
  <!--          </MenuItem>-->
  <!--          <MenuItem v-slot="{ active }">-->
  <!--            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">License</a>-->
  <!--          </MenuItem>-->
  <!--          <form method="POST" action="#">-->
  <!--            <MenuItem v-slot="{ active }">-->
  <!--              <button type="submit" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">Sign out</button>-->
  <!--            </MenuItem>-->
  <!--          </form>-->
  <!--        </div>-->
  <!--      </MenuItems>-->
  <!--    </transition>-->
  <!-- </Menu>-->
  <!--  </div>-->
</template>

<style scoped>

</style>