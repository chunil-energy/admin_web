import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";



const getVehicleList = async (params) => {
    const errorStore = useErrorStore()
    const authStore = useAuthStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        await authStore.tokenRefresh()
        const vehicleUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/vehicle/`;
        const option = {
            method: 'get', url: vehicleUrl, params: params, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200, 403].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            await errorStore.set('error', '권한 오류', '차량 조회 권한이 없습니다.')
            return {success: false, message: '차량 조회 권한이 없습니다.'}
        }
        return {success: true, data: response.data}
    } catch (e) {
        await errorStore.set('error', '조회 실패', `차량 조회중 오류가 발생했습니다. ${e}`)
        return {success: false, message: `차량 조회중 오류가 발생했습니다. ${e}`}
    } finally {
        layoutStore.overlayOff()
    }
}

export default getVehicleList