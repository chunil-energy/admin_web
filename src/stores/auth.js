import {defineStore} from 'pinia';
import router from "@/router";
import axios from 'axios';
import {useErrorStore} from "@/stores/error";
import {useJwt} from '@vueuse/integrations/useJwt'

const tokenUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/token/`;
const refreshUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/token/refresh/`;
const profileUrl = `${import.meta.env.VITE_API_URL}/api/admin/v1/profile/`;

import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.locale('ko')
export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        profile: localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : null,
        returnUrl: null
    }),
    getters: {},
    actions: {
        async isAuthenticated() {
            const errorState = useErrorStore()
            if (this.accessToken === null || this.refreshToken === null) {
                return false
            }
            // console.log('this.accessToken ', this.accessToken)
            const {header: JWTheader, payload: JWTpaylod} = await useJwt(this.accessToken)
            const JWTexpire = dayjs(JWTpaylod.value.exp * 1000)
            const now = dayjs()
            // return this.accessToken !== null && this.refreshToken !== null
            // console.log("JWTexpire ", JWTexpire)
            // console.log("now ", now)
            if (JWTexpire <= now) {
                // console.log('EXPIRED')
                try {
                    const errorState = useErrorStore()
                    const refreshOption = {
                        method: 'POST',
                        url: refreshUrl,
                        data: {"refresh": this.refreshToken},
                        validateStatus: (status) => {
                            return [200, 401, 403].indexOf(status) > -1
                        }
                    }
                    const refreshResponse = await axios(refreshOption)
                    const refreshResponseData = refreshResponse.data
                    if (refreshResponse.status === 200) {
                        this.accessToken = refreshResponseData.access;
                        localStorage.setItem('accessToken', refreshResponseData.access)
                        return true
                    } else if (refreshResponse.status === 401) {
                        this.clearState()
                        return false
                    } else if (refreshResponse.status === 403) {
                        this.clearState()
                        return false
                    }
                } catch (e) {
                    this.clearState()
                    errorState.set('error', '인증 갱신 실패', e.toString())
                }
            } else {
                // console.log('UNEXPIRED')
                return this.accessToken !== null && this.refreshToken !== null
            }

        },
        async tokenRefresh() {
            const errorState = useErrorStore()
            try {
                const refreshOption = {
                    method: 'POST',
                    url: refreshUrl,
                    data: {"refresh": this.refreshToken},
                    validateStatus: (status) => {
                        return [200, 401, 403].indexOf(status) > -1
                    }
                }
                const refreshResponse = await axios(refreshOption)
                const refreshResponseData = refreshResponse.data
                if (refreshResponse.status === 200) {
                    this.accessToken = refreshResponseData.access;
                    localStorage.setItem('accessToken', refreshResponseData.access)
                } else if (refreshResponse.status === 401) {
                    errorState.set('error', '인증 실패', '로그인이 필요한 서비스입니다.')
                    this.logout()
                } else if (refreshResponse.status === 403) {
                    errorState.set('error', '인증 실패', '권한이 없습니다.')
                }
            } catch (e) {
                errorState.set('error', '인증 갱신 실패', e.toString())
                this.logout()
            }
        },
        async login(username, password) {
            const errorState = useErrorStore()
            try {
                const option = {
                    method: 'POST',
                    url: tokenUrl,
                    data: {
                        "username": username,
                        "password": password
                    },
                    validateStatus: (status) => {
                        return [200, 401, 403].indexOf(status) > -1
                    }
                }
                const response = await axios(option)
                const responseData = response.data
                if (response.status === 200) {
                    // update pinia state
                    this.accessToken = responseData.access;
                    this.refreshToken = responseData.refresh
                    localStorage.setItem('accessToken', responseData.access)
                    localStorage.setItem('refreshToken', responseData.refresh)
                    await this.setProfile()
                    router.push(this.returnUrl || '/');
                } else if (response.status === 401) {
                    errorState.set('error', '로그인 실패', '아이디와 비밀번호를 확인하세요.')
                } else if (response.status === 403) {
                    errorState.set('error', '로그인 실패', '해당 계정은 이 서비스에 접근할 권한이 없습니다.')
                }
            } catch (e) {
                errorState.set('error', '로그인 실패', e.toString())
            }
        },
        async setProfile() {
            const isAuthenticated = await this.isAuthenticated()
            if (isAuthenticated === false) {
                this.logout()
            }
            const errorState = useErrorStore()
            try {
                const option = {
                    method: 'GET',
                    url: profileUrl,
                    headers: {Authorization: `Bearer ${this.accessToken}`}
                }
                const response = await axios(option)
                const responseData = response.data
                this.setProfileData(responseData)
            } catch (e) {
                errorState.set('error', '프로필 정보 조회에 실패했습니다.', e.toString())
            }
        },
        setProfileData(data) {
            this.profile = data;
            localStorage.setItem('profile', JSON.stringify(data));
        },

        clearState() {
            this.accessToken = null;
            this.refreshToken = null;
            this.profile = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('profile');
        },
        logout() {
            this.clearState()
            router.push({name: 'auth_login'});
        }
    }
});

"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkxOTMyNTM1LCJpYXQiOjE2OTE5MzE4NzgsImp0aSI6IjVhNmQ3NDk4NzEwNDQ4MzQ5ODFjNDJlNzg0OWI1NzMxIiwidXNlcl9pZCI6MX0.PayV9MKSHqUaFfwTvWf_j0f-qHUbtP3SML245_1CkaI"
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkxOTMyNDc4LCJpYXQiOjE2OTE5MzE4NzgsImp0aSI6ImNiNWNjM2FjZTFjNjQ1MzA5NGFiNjg1NDcyMDA1MGVmIiwidXNlcl9pZCI6MX0.TP-lVHV-2NYQpeuM5V05zEtRRAmH0IOVFqQ2cn-IIrw"