import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useLayoutStore} from "@/stores/layout";


const createEmployee = async (userId, data) => {
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const url = `${import.meta.env.VITE_API_URL}/api/admin/v1/employee/user/${userId}/`;
        const option = {
            method: 'put', url: url, data: data, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [201, 400].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        return {
            success: response.status === 201,
            error: response?.data?.error,
            message: response?.data?.error,
            data: response?.data
        }
    } catch (e) {
        throw new Error(`임직원 정보 등록중 오류가 발생했습니다. ${e}`)
    } finally {
        layoutStore.overlayOff()
    }
}

export default createEmployee

// #     'id', 'user', 'contract_company', 'work_company', 'name', 'grade', 'tel', 'cellphone', 'email', 'home',
// #     'employment_type',
// #     'pay_type', 'salary_account', 'work_start', 'work_end'