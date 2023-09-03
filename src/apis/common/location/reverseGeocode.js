import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";


const reverseGeocode = async (lat, long) => {
    const errorStore = useErrorStore()
    const authStore = useAuthStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        await authStore.tokenRefresh()
        let option = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_API_URL}/api/admin/v1/common/location/naver/`,
            params: {lat: lat, long: long},
            headers: {
                'Authorization': `Bearer ${authStore.accessToken}`
            },
            validateStatus: (status) => {
                return [200].indexOf(status) > -1
            }
        };
        const response = await axios.request(option)
        return {success: true, data: response.data}
    } catch (e) {
        await errorStore.set('error', '등록 실패', `업로드중 오류가 발생했습니다. ${e}`)
        return {success: false, message: `업로드중 오류가 발생했습니다. ${e}`}
    } finally {
        layoutStore.overlayOff()
    }
}

export default reverseGeocode