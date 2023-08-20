import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";


const getUploadUrl = async (filename) => {
    const errorStore = useErrorStore()
    const authStore = useAuthStore()
    try {
        await authStore.tokenRefresh()
        let option = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_API_URL}/api/admin/v1/common/file/protected/?filename=${filename}`,
            headers: {
                'Authorization': `Bearer ${authStore.accessToken}`
            },
            validateStatus: (status) => {
                return [200, 403].indexOf(status) > -1
            }
        };
        const response = await axios.request(option)
        if (response.status === 403) {
            errorStore.set('error', '권한 오류', '업로드 권한이 없습니다.')
            return {success: false, message: '업로드 권한이 없습니다.'}
        }
        return {success: true, data: response.data}
    } catch (e) {
        errorStore.set('error', '등록 실패', `업로드중 오류가 발생했습니다. ${e}`)
        return {success: false, message: `업로드중 오류가 발생했습니다. ${e}`}
    }
}

export default getUploadUrl