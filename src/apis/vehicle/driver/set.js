import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";


const setVehicleDriver = async (vehicleId, data) => {
    const authStore = useAuthStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    const start_date = data.start_date
    try {
        await authStore.tokenRefresh()
        const vehicleUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/vehicle/${vehicleId}/driver/`;
        const option = {
            method: 'post', url: vehicleUrl, data: data, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [401, 403].indexOf(status) <= -1
            }
        }
        const response = await axios.request(option)
        const responseData = response.data
        // if (responseData?.success === false) {
        //     throw new Error(responseData.msg)
        //     // errorStore.set('error', '오류', responseData.error)
        //     // return responseData
        // }
        // // if (response.status === 403) {
        // //     errorStore.set('error', '권한 오류', '차량 조회 권한이 없습니다.')
        // //     return {success: false, message: '차량 조회 권한이 없습니다.'}
        // // }
        if (responseData.success !== true) {
            if (responseData.msg.search('vehicle__vehicledriver_exclude_overlapping_assign_driver') > -1) {
                responseData.msg = `${start_date} 기준 해당 기사는 이미 다른 차량에 배치된 기사입니다.`
            }
            if (responseData.msg.search('vehicle__vehicledriver_exclude_overlapping_assign_vehicle') > -1) {
                responseData.msg = `${start_date} 기준 해당 차량엔 이미 다른 기사가 배정되었습니다.`
            }
        }
        return responseData
    } catch (e) {
        // errorStore.set('error', '조회 실패', `차량 조회중 오류가 발생했습니다. ${e}`)
        return {success: false, message: `차량 조회중 오류가 발생했습니다. ${e}`}
    } finally {
        layoutStore.overlayOff()
    }
}

export default setVehicleDriver