import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";
import {normalizeText} from "normalize-text";

const uploadProtectedFile = async (file, progressHandler=undefined) => {
    const errorStore = useErrorStore()
    const authStore = useAuthStore()
    // layoutStore.overlayOn()
    try {
        await authStore.tokenRefresh()
        const filename = normalizeText(file.name)
        let getUploadUrlOption = {
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
        const uploadUrlResponse = await axios.request(getUploadUrlOption)
        if (uploadUrlResponse.status === 403) {
            await errorStore.set('error', '권한 오류', '업로드 권한이 없습니다.')
            return {success: false, message: '업로드 권한이 없습니다.'}
        }
        const uploadUrlResponseData = uploadUrlResponse.data
        if (uploadUrlResponseData.success !== true) {
            throw new Error(uploadUrlResponseData.message)
        }
        const uploadPath = uploadUrlResponseData.data.path
        const uid = uploadUrlResponseData.data.uid
        const uploadUrl = uploadUrlResponseData.data.upload_url

        let uploadOption = {
            method: 'put',
            maxBodyLength: Infinity,
            url: uploadUrl,
            // headers: {
            //   'Content-Type': 'application/x-msdownload'
            // },
            data: file,
            onUploadProgress: (progressEvent) => {
                if (progressHandler) {
                    let percentage = Math.round(progressEvent.loaded * 100/ progressEvent.total)
                    progressHandler(percentage)
                }
            }
        };
        await authStore.tokenRefresh()
        await axios.request(uploadOption)
        let registerOption = {
            method: 'put',
            url: `${import.meta.env.VITE_API_URL}/api/admin/v1/common/file/protected/`,
            data: {
                key: uploadPath
            },
            headers: {
                'Authorization': `Bearer ${authStore.accessToken}`
            },
            validateStatus: (status) => {
                return [201].indexOf(status) > -1
            }
        }
        const registerResponse = await axios.request(registerOption)
        return registerResponse.data.data
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
        // layoutStore.overlayOff()
    }
}

export default uploadProtectedFile
// // layoutStore.overlayOn()
// try {
//     return {success: true, data: response.data}
// } catch (e) {
//     errorStore.set('error', '등록 실패', `업로드중 오류가 발생했습니다. ${e}`)
//     return {success: false, message: `업로드중 오류가 발생했습니다. ${e}`}
// } finally {
//     // layoutStore.overlayOff()
// }