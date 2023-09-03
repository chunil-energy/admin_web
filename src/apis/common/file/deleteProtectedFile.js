import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";
import {normalizeText} from "normalize-text";

const deleteProtectedFile = async (fileId) => {
    const errorStore = useErrorStore()
    const authStore = useAuthStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        await authStore.tokenRefresh()
        let deleteOption = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_API_URL}/api/admin/v1/common/file/protected/?id=${fileId}`,
            headers: {
                'Authorization': `Bearer ${authStore.accessToken}`
            },
            validateStatus: (status) => {
                return [202].indexOf(status) > -1
            }
        };
        const deleteResponse = await axios.request(deleteOption)
    } catch (e) {
        if (e.response) {
            // 2XX 외 에러
        } else if (e.request) {
            // 응답 수신 전 에러
        } else {
            // 기타 에러
        }
        await errorStore.set('error', '등록 실패', `업로드중 오류가 발생했습니다. ${e}`)
        throw new Error(`업로드중 오류가 발생했습니다. ${e}`)
    } finally {
        layoutStore.overlayOff()
    }
}

export default deleteProtectedFile
// // layoutStore.overlayOn()
// try {
//     return {success: true, data: response.data}
// } catch (e) {
//     errorStore.set('error', '등록 실패', `업로드중 오류가 발생했습니다. ${e}`)
//     return {success: false, message: `업로드중 오류가 발생했습니다. ${e}`}
// } finally {
//     // layoutStore.overlayOff()
// }