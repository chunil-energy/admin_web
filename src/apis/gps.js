import axios from "axios";
import {useAuthStore} from "@/stores/auth";
import {useErrorStore} from "@/stores/error";
import {useLayoutStore} from "@/stores/layout";


const getGPSSession = async () => {
    const errorStore = useErrorStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const url = `${import.meta.env.VITE_API_URL}/api/admin/v1/gps/session/`;
        const option = {
            method: 'put', url: url, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [201, 403].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            await errorStore.set('error', '권한 오류', 'GPS 조회 권한이 없습니다.')
            return []
        }
        return response.data
    } catch (e) {
        await errorStore.set('error', '조회 실패', `GPS 조회중 오류가 발생했습니다. ${e}`)
        return []
    } finally {
        layoutStore.overlayOff()
    }
}


const getTrackerList = async (page, query) => {
    const errorStore = useErrorStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        let params = {'page_size': 10}
        if (page) {
            params.page = page
        }
        if (query) {
            params.query = query
        }
        const url = `${import.meta.env.VITE_API_URL}/api/admin/v1/gps/tracker/`;
        const option = {
            method: 'get', url: url, params: params, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200, 403].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            await errorStore.set('error', '권한 오류', '단말기 조회 권한이 없습니다.')
            return []
        }
        return response.data
    } catch (e) {
        await errorStore.set('error', '조회 실패', `단말기 목록 조회중 오류가 발생했습니다. ${e}`)
        return []
    } finally {
        layoutStore.overlayOff()
    }
}
const setTrackerFavorite = async (trackerId, action) => {
    const errorStore = useErrorStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const url = `${import.meta.env.VITE_API_URL}/api/admin/v1/gps/tracker/favorite/`;
        const data = {tracker: trackerId, action}
        const option = {
            method: 'post', url: url, data: data, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            // validateStatus: (status) => {
            //     return [200, 403].indexOf(status) > -1
            // }
        }
        const response = await axios.request(option)
        return response.data
    } catch (e) {
        await errorStore.set('error', '조회 실패', `단말기 즐겨찾기 수정 중 오류가 발생했습니다. ${e}`)
        throw e
    } finally {
        layoutStore.overlayOff()
    }
}

const setTrackerAPI = async (sessionId, trackerList) => {
    const errorStore = useErrorStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const data = trackerList.map(tracker => {
            return {'tracker': tracker.id, 'action': tracker.action}
        })
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const url = `${import.meta.env.VITE_API_URL}/api/admin/v1/gps/session/${sessionId}/`;
        const option = {
            method: 'post', url: url, data: data, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200, 403].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            await errorStore.set('error', '권한 오류', '단말기 지정 권한이 없습니다.')
            return []
        }
        return response.data
    } catch (e) {
        await errorStore.set('error', '조회 실패', `단말기 지정중 오류가 발생했습니다. ${e}`)
        return []
    } finally {
        layoutStore.overlayOff()
    }
}

const getSessionDetailAPI = async (sessionId) => {
    const errorStore = useErrorStore()
    const layoutStore = useLayoutStore()
    // layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const url = `${import.meta.env.VITE_API_URL}/api/admin/v1/gps/session/${sessionId}/`;
        const option = {
            method: 'get', url: url, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200, 403].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            await errorStore.set('error', '권한 오류', '세션 조회 권한이 없습니다.')
            return []
        }
        return response.data
    } catch (e) {
        await errorStore.set('error', '조회 실패', `세션 조회중 오류가 발생했습니다. ${e}`)
        return []
    } finally {
        // layoutStore.overlayOff()
    }
}

const getTrackerTripAPI = async (trackerId, startDateString, endDateString) => {
    const errorStore = useErrorStore()
    const layoutStore = useLayoutStore()
    layoutStore.overlayOn()
    try {
        const authStore = useAuthStore()
        await authStore.tokenRefresh()
        const url = `${import.meta.env.VITE_API_URL}/api/admin/v1/gps/tracker/${trackerId}/trip/`;
        const params = {start_date: startDateString, end_date: endDateString}
        const option = {
            method: 'get', url: url, params: params, headers: {Authorization: `Bearer ${authStore.accessToken}`},
            validateStatus: (status) => {
                return [200, 403].indexOf(status) > -1
            }
        }
        const response = await axios.request(option)
        if (response.status === 403) {
            await errorStore.set('error', '권한 오류', '경로 조회 권한이 없습니다.')
            return []
        }
        return response.data
    } catch (e) {
        await errorStore.set('error', '조회 실패', `경로 조회중 오류가 발생했습니다. ${e}`)
        return []
    } finally {
        layoutStore.overlayOff()
    }
}

export {getGPSSession, getTrackerList, setTrackerAPI, getTrackerTripAPI, setTrackerFavorite, getSessionDetailAPI}