import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";


const getAffiliateList = async (params) => {
    const errorStore = useErrorStore()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const affiliateUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/affiliate/`;
        const option = {
            method: 'get', url: affiliateUrl, params: params, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200, 403].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            errorStore.set('error', '권한 오류', '사업장 목록을 조회할 권한이 없습니다.')
            return []
        }
        return response.data
    } catch (e) {
        errorStore.set('error', '조회 실패', `사업장 목록 조회중 오류가 발생했습니다. ${e}`)
        return []
    }
}

export default getAffiliateList