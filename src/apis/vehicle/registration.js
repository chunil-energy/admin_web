import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";


const getVehicleRegistration = async (vehicleId) => {
    const errorStore = useErrorStore()
    const authStore = useAuthStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        await authStore.tokenRefresh()
        const vehicleUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/vehicle/${vehicleId}/registration/`;
        const option = {
            method: 'get', url: vehicleUrl, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200, 403].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            await errorStore.set('error', '권한 오류', '차량 등록증 조회 권한이 없습니다.')
            return {success: false, message: '차량 등록증 조회 권한이 없습니다.'}
        }
        return {success: true, data: {rows: response.data.rows, insurer: response.data.insurer}}
    } catch (e) {
        await errorStore.set('error', '등록 실패', `차량 등록증 조회중 오류가 발생했습니다. ${e}`)
        return {success: false, message: `차량 등록증 조회중 오류가 발생했습니다. ${e}`}
    } finally {
        layoutStore.overlayOff()
    }
}


const registerVehicleRegistration = async (vehicleId, vehicleRegistrationData) => {
    const errorStore = useErrorStore()
    const authStore = useAuthStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        await authStore.tokenRefresh()
        const vehicleUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/vehicle/${vehicleId}/registration/`;
        const option = {
            method: 'put', url: vehicleUrl, data: vehicleRegistrationData, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [201, 403, 400].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            await errorStore.set('error', '권한 오류', '차량 등록증 등록 권한이 없습니다.')
            return {success: false, message: '차량 등록증 등록 권한이 없습니다.'}
        } else if (response.status === 400) {
            let msg = response.data.msg
            await errorStore.set('error', msg)
            return {success: false, message: msg}
        }
        return {success: true, data: {rows: response.data.rows, insurer: response.data.insurer}}
    } catch (e) {
        await errorStore.set('error', '조회 실패', `차량 등록증 등록중 오류가 발생했습니다. ${e}`)
        return {success: false, message: `차량 등록증 등록중 오류가 발생했습니다. ${e}`}
    } finally {
        layoutStore.overlayOff()
    }
}


const vehicleRegistrationFile = async (vehicleId, registrationId) => {
    const errorStore = useErrorStore()
    const authStore = useAuthStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        await authStore.tokenRefresh()
        const vehicleUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/vehicle/${vehicleId}/registration/${registrationId}/`;
        const option = {
            method: 'get', url: vehicleUrl, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200, 403, 400].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            await errorStore.set('error', '권한 오류', '차량 등록증 조회 권한이 없습니다.')
            return {success: false, message: '차량 등록증 조회 권한이 없습니다.'}
        } else if (response.status === 400) {
            let msg = response.data.msg
            await errorStore.set('error', msg)
            return {success: false, message: msg}
        }
        return {success: true, data: {url: response.data.url}}
    } catch (e) {
        await errorStore.set('error', '조회 실패', `차량 등록증 조회중 오류가 발생했습니다. ${e}`)
        return {success: false, message: `차량 등록증 조회중 오류가 발생했습니다. ${e}`}
    } finally {
        layoutStore.overlayOff()
    }
}

export {getVehicleRegistration, registerVehicleRegistration, vehicleRegistrationFile}