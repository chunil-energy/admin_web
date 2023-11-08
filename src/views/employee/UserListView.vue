<script>
import {useRoute} from "vue-router";
import phoneNumberParser from "@/utils/common/phoneNumberParser";
import getUserListData from "@/apis/employee/listUser";
import ListViewComponent from "@/components/common/ListViewComponent.vue";
import {defaultTextInput, defaultButton, whiteButton} from "@/styles";

export default {
  name: 'UserListView',
  async setup() {
    const columns = [
      {type: 'data', name: '아이디', field: 'username', class: null},
      {type: 'data', name: '성명', field: 'name', class: null},
      {type: 'data', name: '휴대전화', field: 'cellphone', class: null},
      {type: 'data', name: '이메일', field: 'email', class: null},
      {type: 'bool', name: '임직원', field: 'isEmployee', class: null},
      {
        type: 'button',
        name: '자세히',
        pathName: 'user_detail',
        pathParamName: 'userId',
        pathParamFieldName: 'id',
        class: null
      },
    ]
    const route = useRoute()
    const query = route.query
    const itemData = await getUserListData(query)
    itemData.results.map(item => {
      item['cellphone'] = item['cellphone'] ? phoneNumberParser(item['cellphone']) : null
      item['isEmployee'] = !!item['employee']
    })
    return {query, columns, itemData, defaultTextInput, defaultButton, whiteButton}
  },
  components: {
    ListViewComponent,
  },
}
</script>

<template>
  <ListViewComponent :columns="columns" :add-router-name="'user_create'" :item-data="itemData"
                     title-string="사용자 목록">
<!--    <template v-slot:queryForm>-->
<!--      <div class="mt-10 grid grid-cols-1 gap-x-2 gap-y-8 sm:grid-cols-12">-->
<!--        <div class="col-span-1 sm:col-span-3">-->
<!--          <label for="username">아이디</label>-->
<!--          <div class="mt-2">-->
<!--            <input type="text" :value="query.username" name="username" id="username" :class="defaultTextInput">-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="col-span-1 sm:col-span-3">-->
<!--          <label for="name">성명</label>-->
<!--          <div class="mt-2">-->
<!--            <input type="text" :value="query.name" name="name" id="name" :class="defaultTextInput">-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="col-span-1 sm:grid sm:items-end sm:col-span-1">-->
<!--          <button type="reset" :class="whiteButton">초기화</button>-->
<!--        </div>-->
<!--        <div class="col-span-1 sm:grid sm:items-end sm:col-span-1">-->
<!--          <button type="submit" :class="defaultButton">조회</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </template>-->
  </ListViewComponent>
</template>
