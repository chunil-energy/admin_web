import { defineStore } from 'pinia';
import {useViewerStore} from "@/stores/viewer";

export const useLayoutStore = defineStore({
    id: 'layout',
    state: () => ({
        showOverlay: localStorage.getItem('showOverlay') ? JSON.parse(localStorage.getItem('showOverlay')):false,
        pdfFileUrl: null,
        imageFileUrl: null,
        contentWidth: 0
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
        },
        showPdfFileViewer(pdfUrl) {
            this.pdfFileUrl = pdfUrl
        },
        showImageFileViewer(imageUrl) {
            this.imageFileUrl = imageUrl
        },
        closeViewer() {
            this.pdfFileUrl = null
            this.imageFileUrl = null
            const viewerStore = useViewerStore()
            viewerStore.clearStore()
        },
        setContentWidth() {
            this.contentWidth = document.getElementById('layoutContent').offsetWidth
        }
    }
});
