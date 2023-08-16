<script>
import {defineComponent} from 'vue'
import { useVuelidate } from '@vuelidate/core'
import {required, helpers} from '@vuelidate/validators'
import {useAuthStore} from "@/stores/auth";
import NotificationList from "@/components/NotificationList.vue";

export default {
  name: "LoginView",
  components: {
    'notification-list': NotificationList,
  },
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  mounted() {
  },
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    async onSubmit() {
      const isFormCorrect = await this.v$.$validate()
      if (!isFormCorrect) {return null}
      const authStore = useAuthStore();
      await authStore.login(this.username, this.password)
    }
  },
  validations () {
    return {
      username: { required: helpers.withMessage('사용자명을 입력하세요.', required) }, // Matches this.firstName
      password: { required: helpers.withMessage('비밀번호를 입력하세요.', required) }, // Matches this.firstName
    }
  }
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="@/assets/img/mark.svg" alt="천일"/>
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">로그인</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" method="POST" @submit.prevent="onSubmit" novalidate>
        <div>
          <label for="username" class="block text-sm font-medium leading-6 text-gray-900">사용자명</label>
          <div class="mt-2">
            <input id="username" name="username" type="text" required="required" v-model="username"
                   class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
          </div>
          <p v-for="error in v$.username.$errors" class="mt-2 text-sm text-red-600" id="email-error">{{error.$message}}</p>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">비밀번호</label>
<!--            <div class="text-sm">-->
<!--              <router-link href="#" class="font-semibold text-indigo-600 hover:text-indigo-500" :to="{name: 'auth_findpassword'}">비밀번호 찾기</router-link>-->
<!--            </div>-->
          </div>
          <div class="mt-2">
            <input id="password" name="password" type="password" required="required" v-model="password"
                   class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
          </div>
          <p v-for="error in v$.password.$errors" class="mt-2 text-sm text-red-600" id="email-error">{{error.$message}}</p>
        </div>

        <div>
          <button type="submit"
                  class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            로그인
          </button>
        </div>
      </form>
    </div>
    <notification-list/>
  </div>

<!--  <NotificationList></NotificationList>-->
</template>

<style scoped>

</style>