import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";

const uploadToS3 = async (uploadUrl, file, path) => {
    const errorStore = useErrorStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        let uploadConfig = {
            method: 'put',
            maxBodyLength: Infinity,
            url: uploadUrl,
            // headers: {
            //   'Content-Type': 'application/x-msdownload'
            // },
            data: file
        };
        const response = await axios.request(uploadConfig)
        return {success: true, data: {path: path}}
    } catch (e) {
        errorStore.set('error', '등록 실패', `업로드중 오류가 발생했습니다. ${e}`)
        return {success: false, message: `업로드중 오류가 발생했습니다. ${e}`}
    } finally {
        layoutStore.overlayOff()
    }
}

export default uploadToS3