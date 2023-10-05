import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";


const getUserList = async (params) => {
    const errorStore = useErrorStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const userUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/user/`;
        const option = {
            method: 'get', url: userUrl, params: params, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200, 403].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            await errorStore.set('error', '권한 오류', '사용자 목록을 조회할 권한이 없습니다.')
            return []
        }
        return response.data
    } catch (e) {
        await errorStore.set('error', '조회 실패', `사용자 목록 조회중 오류가 발생했습니다. ${e}`)
        return []
    } finally {
        layoutStore.overlayOff()
    }
}

export default getUserList