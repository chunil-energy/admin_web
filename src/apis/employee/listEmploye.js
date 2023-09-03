import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useLayoutStore} from "@/stores/layout";


const getEmployeeListData = async (params) => {
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const url = `${import.meta.env.VITE_API_URL}/api/admin/v1/employee/`;
        const option = {
            method: 'get', url: url, params: params, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            throw new Error('권한이 없습니다.')
        }
        return response.data
    } catch (e) {
        throw new Error(`임직원 목록 조회중 오류가 발생했습니다. ${e}`)
    } finally {
        layoutStore.overlayOff()
    }
}

export default getEmployeeListData