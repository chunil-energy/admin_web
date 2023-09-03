<script setup>
import {useLayoutStore} from "@/stores/layout";
import 'viewerjs/dist/viewer.css'
import {XMarkIcon} from '@heroicons/vue/24/outline'
import VueEasyLightbox from 'vue-easy-lightbox'


const layoutStore = useLayoutStore()
// const images = [layoutStore.imageFileUrl]
const show = () => {
  this.$viewerApi({
    images: this.images,
  })
}
</script>

<template>

  <Transition as="template" enter="ease-in-out duration-200" enter-from="opacity-0" enter-to="opacity-100"
              leave="ease-in-out duration-200" leave-from="opacity-100" leave-to="opacity-0">
    <div @wheel.prevent
         @touchmove.prevent
         @scroll.prevent
         class="grid grid-cols-12 fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity h-full py-5 overflow-hidden"
         style="z-index: 999999999999999999">
      <div class="col-span-2">
        <!--        <div class="absolute right-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">-->
        <!--          <button type="button" class="relative rounded-md text-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-white" @click="layoutStore.closeViewer()">-->
        <!--            <span class="absolute -inset-2.5" />-->
        <!--            <span class="sr-only">Close panel</span>-->
        <!--            <XMarkIcon class="h-16 w-16" aria-hidden="true" />-->
        <!--          </button>-->
        <!--        </div>-->
      </div>
      <div class="col-span-8">

        <VueEasyLightbox
            :visible="layoutStore.imageFileUrl !== null"
            :imgs="layoutStore.imageFileUrl"
            :index="0"
            @hide="layoutStore.closeViewer"
        ></VueEasyLightbox>
      </div>
      <div class="col-span-2"></div>
    </div>
  </Transition>
</template>

<style scoped>

</style>