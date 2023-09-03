<template>

    <div class="grid grid-cols-1 gap-x-1 gap-y-2 items-center sm:grid-cols-5" v-show="uploadStatus === 'ready'">
      <div class="sm:col-span-2">
        <button type="button" @click="showFileInput"
                class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          파일선택
        </button>
      </div>
      <div class="sm:col-span-3 overflow-hidden text-sm font-semibold text-gray-600 truncate">{{ filename }}
      </div>
    </div>

    <input type="file" name="_file_uploaded_input" id="_file_uploaded_input" ref="file_uploaded_input"
           @input="inputListener" hidden="hidden"/>
  <template v-if="uploadStatus === 'uploading'">
    <!--    <div class="grid grid-cols-1 gap-x-1 gap-y-2 items-center items-center">-->
    <div class="grid grid-cols-1 gap-x-2 gap-y-2 items-center sm:grid-cols-6">
      <div class="col-span-5">
          <div class="col-end-1 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div class="bg-blue-600 h-2.5 rounded-full" :style="{width: `${uploadProgress}%`}"></div>
          </div>
      </div>
      <div class="col-span-1 text-right">
        {{uploadProgress}}%
      </div>
    </div>
    <!--    </div>-->
  </template>
  <template v-else-if="uploadStatus === 'uploaded'">
    <div class="flex flex-row mx-auto">
      <XMarkIcon class="h-6 w-6 clickable" @click="deleteFile"/>
      <div class="truncate">{{filename}}</div>
    </div>
  </template>

</template>

<script>


import {useErrorStore} from "@/stores/error";
import {normalizeText} from 'normalize-text';
import uploadProtectedFile from "@/apis/common/file/uploadProtectedFile";
import {XMarkIcon} from '@heroicons/vue/24/outline'
import deleteProtectedFile from "@/apis/common/file/deleteProtectedFile";

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
  emits: ['setFileData', 'deleteFileData'],
  data() {
    return {
      uploadStatus: 'ready',
      filename: '',
      uploadProgress: 0,
      fileData: null
    }
  },
  async mounted() {
  },
  watch: {},
  methods: {
    showFileInput() {
      this.$refs.file_uploaded_input.click()
    },
    async deleteFile() {
      await deleteProtectedFile(this.fileData.id)
      this.$emit('deleteFileData')
      this.$nextTick(() => {
        this.clearInput()
      })
    },
    clearInput() {
      this.uploadProgress = 0
      this.uploadStatus = 'ready'
      this.filename = null
      this.fileData = null
      this.$refs.file_uploaded_input.value = null
    },
    async inputListener(event) {
      if (event.target.files.length === 0) {
        this.clearInput()
        return null
      }
      this.uploadProgress = 0
      this.uploadStatus = 'uploading'
      const file = event.target.files[0]
      try {
        if (file.size > this.maxSize * 1024 * 1024) {
          this.clearInput()
          throw new Error(`파일 용량이 ${this.maxSize}mb를 초과합니다. 업로드가 불가능합니다.`)
        }
        this.filename = normalizeText(file.name)
        const response = await uploadProtectedFile(file, (percentage) => {
          this.uploadProgress = percentage
        })
        this.fileData = response
        this.$emit('setFileData', response)
      } catch (e) {
        console.log(e)
        this.clearInput()
        await this.errorState.set('error', '파일 업로드 오류', e.toString())
      } finally {
        this.uploadStatus = 'uploaded'
      }
    }
  }
}
</script>
<script setup>
import {XMarkIcon} from "@heroicons/vue/24/outline";
</script>