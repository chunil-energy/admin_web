import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";


const createVehicle = async (data) => {
    const errorStore = useErrorStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const userUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/vehicle/`;
        const option = {
            method: 'put', url: userUrl, data: data, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [201, 403].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            await errorStore.set('error', '권한 오류', '차량을 등록할 권한이 없습니다.')
            return null
        }
        return response.data
    } catch (e) {
        await errorStore.set('error', '등록 실패', `차량 등록중 오류가 발생했습니다. ${e}`)
        return null
    } finally {
        layoutStore.overlayOff()
    }
}

export default createVehicle