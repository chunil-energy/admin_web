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
        set(status, title, message) {
            var errorId = uuidv4()
            var errorItem = {id: errorId, status: status, title: title, message: message}
            this.errorArray.push(errorItem)
            localStorage.setItem('errorArray', JSON.stringify(this.errorArray))
            setTimeout(() => {this.remove(errorId)}, 5000)
        },
        remove(id) {
            const resultArray = this.errorArray.filter((errorItem) => errorItem.id !== id)
            this.errorArray = resultArray
            localStorage.setItem('errorArray', JSON.stringify(resultArray))

        }
    }
});
