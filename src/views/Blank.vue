<script>
import {useRoute} from "vue-router";
import {useErrorStore} from "@/stores/error";

export default {
  name: 'Blank',
  async setup() {
    const errorStore = useErrorStore()
    const route = useRoute()
    return {errorStore, route}
  },
  components: {},
  computed: {},
  methods: {
  }
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">페이지 제목</h1>
      </div>
    </div>

    <div class="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">


    </div>
  </div>

</template>
