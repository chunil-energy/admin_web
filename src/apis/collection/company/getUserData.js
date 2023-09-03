import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";


const getUserDetail = async (companyId, userId) => {
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const url = `${import.meta.env.VITE_API_URL}/api/admin/v1/collection/company/${companyId}/user/${userId}/`;
        const option = {
            method: 'get',
            url: url,
            headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        return response.data
    } catch (e) {
        throw new Error(`거래처 직원 조회중 오류가 발생했습니다. ${e}`)
    } finally {
        layoutStore.overlayOff()
    }
}

export default getUserDetail