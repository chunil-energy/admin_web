<script>
import {useRoute} from "vue-router";
import phoneNumberParser from "@/utils/common/phoneNumberParser";
import ListViewComponent from "@/components/common/ListViewComponent.vue";
import {defaultTextInput, defaultButton, whiteButton} from "@/styles";
import getEmployeeListData from "@/apis/employee/listEmploye";

const sample = {
  "id": 1,
  "contract_company": {
    "id": 1,
    "name_legal": "(주)수거봇",
    "name": "수거봇",
    "rep": "박상원",
    "brn": "2978601887",
    "registration_no": "1912110031296",
    "parent": null,
    "parent_name": null,
    "registered_at": "2023-08-23T19:09:12.740148+09:00"
  },
  "work_company": {
    "id": 2,
    "name_legal": "tsdf",
    "name": "asdfasdf",
    "rep": "asdf",
    "brn": "1231235235",
    "registration_no": "1234123412341",
    "parent": 1,
    "parent_name": "수거봇",
    "registered_at": "2023-08-24T13:10:36.135994+09:00"
  },
  "name": "홍찬의1111123",
  "grade": "sdf",
  "tel": null,
  "cellphone": "01024846313",
  "email": "sdf@asdf.com",
  "employment_type": "c",
  "user": 1,
  "pay_type": "b",
  "work_start": "2023-09-22",
  "work_end": null
}
export default {
  name: 'EmployeeListView',
  async setup() {
    const columns = [
      {type: 'data', name: '성명', field: 'name', class: null},
      {type: 'data', name: '직급', field: 'grade', class: null},
      {type: 'data', name: '휴대전화', field: 'cellphone', class: null},
      {type: 'data', name: '전화', field: 'tel', class: null},
      {type: 'data', name: '이메일', field: 'email', class: null},
      {type: 'data', name: '입사일', field: 'work_start', class: null},
      {type: 'data', name: '퇴사일', field: 'work_end', class: null},
      {type: 'data', name: '소속', field: 'contract_company', class: null},
      {type: 'data', name: '근무지', field: 'work_company', class: null},
      {
        type: 'button',
        name: '자세히',
        pathName: 'employee_detail',
        pathParamName: 'employeeId',
        pathParamFieldName: 'id',
        class: null
      },
    ]
    const route = useRoute()
    const query = route.query
    const itemData = await getEmployeeListData(query)
    itemData.results.map(item => {
      item['cellphone'] = item['cellphone'] ? phoneNumberParser(item['cellphone']) : null
      item['tel'] = item['tel'] ? phoneNumberParser(item['tel']) : null
      item['contract_company'] = item['contract_company'] ? item['contract_company'].name : null
      item['work_company'] = item['work_company'] ? item['work_company'].name : null
      //   item['isEmployee'] = !!item['employee']
    })
    console.log('itemData')
    console.log(itemData)
    return {query, columns, itemData, defaultTextInput, defaultButton, whiteButton}
  },
  components: {
    ListViewComponent,
  },
}
</script>

<template>
  <ListViewComponent :columns="columns" :item-data="itemData"
                     title-string="임직원 목록">
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
