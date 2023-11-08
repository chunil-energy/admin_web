import { defineStore } from 'pinia';
import {v4 as uuidv4} from 'uuid';

export const useErrorStore = defineStore({
    id: 'error',
    state: () => ({
        errorArray: localStorage.getItem('errorArray') ? JSON.parse(localStorage.getItem('errorArray')):[],
    }),
    getters: {
        hasError(state) {
            return state.errorArray.length !== 0
        }
    },
    actions: {
        async set(status, title, message) {
            var errorId = uuidv4()
            var msgArray = Array.isArray(message) ? message : [message]
            var errorItem = {id: errorId, status: status, title: title, message: msgArray}
            this.errorArray.push(errorItem)
            await localStorage.setItem('errorArray', JSON.stringify(this.errorArray))
            setTimeout(() => {this.remove(errorId)}, 5000)
        },
        async remove(id) {
            const resultArray = this.errorArray.filter((errorItem) => errorItem.id !== id)
            this.errorArray = resultArray
            await localStorage.setItem('errorArray', JSON.stringify(resultArray))

        },
        async clear() {
            this.errorArray = []
            await localStorage.removeItem('errorArray')
        }
    }
});
