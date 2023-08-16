<script>
import vehicleVehicleDriverParser from "@/utils/vehicleVehicleDriverParser";
import vehiclePositionParser from "@/utils/vehiclePositionParser";
import vehicleTypeParser from "@/utils/vehicleTypeParser";
import axios from "axios";
import {useAuthStore} from "@/stores/auth";

export default {
  setup() {
    const authStore = useAuthStore()
    return {authStore}
  },
  data() {
    return {
      profileData: null
    }
  },
  async mounted() {
    this.profileData = await this.getProfileData()
  },
  methods: {
    async getProfileData() {
      await this.authStore.tokenRefresh()
      const profileUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/profile/`;
      const option = {
        method: 'get', url: profileUrl, headers: {Authorization: `Bearer ${this.authStore.accessToken}`}
      }
      const response = await axios.request(option)
      const responseData = response.data
      this.authStore.setProfileData(responseData)
      return responseData
    }
  }
}
</script>

<template>
  <main>
    <div>ProfleView</div>
    <div>{{profileData}}</div>
  </main>
</template>
