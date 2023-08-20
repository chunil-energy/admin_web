import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";


const updateAffiliate = async (affiliateId, data) => {
    const errorStore = useErrorStore()
    const authStore = useAuthStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        await authStore.tokenRefresh()
        const affiliateUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/affiliate/${affiliateId}/`;
        const option = {
            method: 'post', url: affiliateUrl, data: data, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200, 403].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            errorStore.set('error', '권한 오류', '사업장 수정 권한이 없습니다.')
            return {success: false, message: '사업장 조회 권한이 없습니다.'}
        }
        return {success: true, data: response.data}
    } catch (e) {
        errorStore.set('error', '수정 실패', `사업장 수정중 오류가 발생했습니다. ${e}`)
        return {success: false, message: `사업장 수정중 오류가 발생했습니다. ${e}`}
    } finally {
        layoutStore.overlayOff()
    }
}

export default updateAffiliate