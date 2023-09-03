import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";


const getBasePrice = async () => {
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const url = `${import.meta.env.VITE_API_URL}/api/admin/v1/collection/price/`;
        const option = {
            method: 'get', url: url, headers: {Authorization: `Bearer ${authStore.accessToken}`},
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

export default getBasePrice

//
// const d = {
//     price_1t_m_xs_w_,
//     price_1t_m_sm_w_,
//     price_1t_m_1o3_w_,
//     price_1t_m_1o2_w_,
//     price_1t_m_2o3_w_,
//     price_1t_m_1_w_,
//     price_1t_f_xs_w_,
//     price_1t_f_sm_w_,
//     price_1t_f_1o3_w_,
//     price_1t_f_1o2_w_,
//     price_1t_f_2o3_w_,
//     price_1t_f_1_w_,
//     price_1t_c_xs_w_,
//     price_1t_c_sm_w_,
//     price_1t_c_1o3_w_,
//     price_1t_c_1o2_w_,
//     price_1t_c_2o3_w_,
//     price_1t_c_1_w_,
//     price_1t_w_xs_w_,
//     price_1t_w_sm_w_,
//     price_1t_w_1o3_w_,
//     price_1t_w_1o2_w_,
//     price_1t_w_2o3_w_,
//     price_1t_w_1_w_,
//     price_25t_m_1_w_,
//     price_25t_f_1_w_,
//     price_25t_c_1_w_,
//     price_25t_w_1_w_
// }