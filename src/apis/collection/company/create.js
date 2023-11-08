import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";


const createCollectionCompany = async (data) => {
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const affiliateUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/collection/company/`;
        const option = {
            method: 'put', url: affiliateUrl, data: data, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200, 201].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        return {data: response.data, status: response.status}
    } catch (e) {
        throw new Error(`거래처 목록 조회중 오류가 발생했습니다. ${e}`)
    } finally {
        layoutStore.overlayOff()
    }
}

export default createCollectionCompany