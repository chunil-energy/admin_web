<template>


  <div class="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-6">
    <div class="sm:col-span-2">
      <button type="button" @click="showFileInput"
              class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        파일선택
      </button>
    </div>
    <div class="sm:col-span-4 overflow-hidden text-sm font-semibold text-gray-600">{{ filename }}
    </div>
  </div>

  <input type="file" name="_file_uploaded_input" id="_file_uploaded_input" ref="file_uploaded_input"
         @input="inputListener" hidden="hidden"/>
  <div>


  </div>

</template>

<script>


import {useErrorStore} from "@/stores/error";
import {normalizeText} from 'normalize-text';
import getUploadUrl from "@/apis/common/file/getUploadUrl";
import uploadToS3 from "@/apis/common/file/uploadToS3";

export default {
  name: 'FileUploadComponent',
  setup() {
    const errorState = useErrorStore()
    return {errorState}
  },
  components: {},
  props: {
    maxSize: {
      type: Number,
      required: false,
      default: 10
    }
  },
  emits: ['setFileId'],
  data() {
    return {
      filename: ''
    }
  },
  async mounted() {
  },
  watch: {},
  methods: {
    showFileInput() {
      this.$refs.file_uploaded_input.click()
    },
    clearInput() {
      this.$refs.file_uploaded_input.value = null
      this.filename = null
    },
    async inputListener(event) {
      if (event.target.files.length === 0) {
        this.clearInput()
        return null
      }
      const file = event.target.files[0]
      console.log(file)
      if (file.size > this.maxSize * 1024 * 1024) {
        this.errorState.set('error', '파일 오류', `파일 용량이 ${this.maxSize}mb를 초과합니다. 업로드가 불가능합니다.`)
        this.clearInput()
        return null
      }
      this.filename = normalizeText(file.name)
      const uploadUrlResponse = await getUploadUrl(this.filename)
      const uploadUrlResponseData = uploadUrlResponse.data
      if (uploadUrlResponseData.success !== true) {
        this.errorState('error', '업로드 실패', uploadUrlResponseData.message)
        this.clearInput()
        return null
      }
      const uploadPath = uploadUrlResponseData.data.path
      const uid = uploadUrlResponseData.data.uid
      const uploadUrl = uploadUrlResponseData.data.upload_url
      console.log(uploadUrl)
      const uploadResponse = await uploadToS3(uploadUrl, file, uploadPath)
      console.log(uploadUrlResponse)
    }
  }
}
</script>