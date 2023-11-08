import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";


const updateCompanyPrice = async (companyId, data) => {
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const affiliateUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/collection/company/${companyId}/price/`;
        const option = {
            method: 'post', data: data, url: affiliateUrl, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        return response.data.data
    } catch (e) {
        throw new Error(`거래처 조회중 오류가 발생했습니다. ${e}`)
    } finally {
        layoutStore.overlayOff()
    }
}

export default updateCompanyPrice