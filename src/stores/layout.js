import { defineStore } from 'pinia';

export const useLayoutStore = defineStore({
    id: 'layout',
    state: () => ({
        showOverlay: localStorage.getItem('showOverlay') ? JSON.parse(localStorage.getItem('showOverlay')):false,
    }),
    actions: {
        overlayOn() {
            this.showOverlay = true
            localStorage.setItem('showOverlay', JSON.stringify(this.showOverlay))
        },
        overlayOff() {
            this.showOverlay = false
            localStorage.setItem('showOverlay', JSON.stringify(this.showOverlay))
        },
        overlayToggle() {
            this.showOverlay = !this.showOverlay
            localStorage.setItem('showOverlay', JSON.stringify(this.showOverlay))
        }
    }
});
