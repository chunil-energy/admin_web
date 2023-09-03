import { defineStore } from 'pinia';
import {useLayoutStore} from "@/stores/layout";
import JsFileDownloader from 'js-file-downloader';
import {useErrorStore} from "@/stores/error";

export const useViewerStore = defineStore({
    id: 'viewer',
    state: () => ({
        // showOverlay: localStorage.getItem('showOverlay') ? JSON.parse(localStorage.getItem('showOverlay')):false,
        url: null,
        filename: null,
        extension: null
    }),
    actions: {
        async showViewer(fileUrl){
            const errorStore = useErrorStore()
            const layoutStore = useLayoutStore()
            const imageExtensionList = ['jpg', 'jpeg', "png"]
            this.url = fileUrl
            console.log('this.url 1 ', this.url)
            try {
                var urlObject = new URL(this.url);
                const pathNames = urlObject.pathname.split('/').map(path => path.trim()).filter(path => path !== '')
                this.filename = pathNames[pathNames.length - 1]
                this.extension = this.filename.split('.')[this.filename.split('.').length - 1].toLowerCase()
                console.log('this.url 2 ', this.url)
            } catch (e) {

            } finally {
                console.log('this.extension ', this.extension)
                if (this.extension === 'pdf') {
                    layoutStore.showPdfFileViewer(this.url)
                } else if (imageExtensionList.includes(this.extension) === true) {
                    layoutStore.showImageFileViewer(this.url)
                } else {
                    console.log('try download!')
                    new JsFileDownloader({
                        url: this.url
                    }).then(async () => {
                        await errorStore.set('success', '다운로드 완료', this.filename ? `${this.filename} 다운로드 완료` : '다운로드 완료')
                    }).catch(async (error) => {
                        await errorStore.set('error', '다운로드 실패', this.filename ? `${this.filename} 다운로드 실패 ${error}` : `${error}`)
                    }).finally(() => {
                        this.clearStore()
                    })
                }
            }
        },
        clearStore() {
            this.url = null
            this.filename = null
            this.filename = null
        }
    }
});
