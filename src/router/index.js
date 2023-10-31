import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue';
import ProfleView from '@/views/ProfleView.vue';
import VehicleListView from '@/views/vehicle/VehicleListView.vue';
import VehicleDetailView from '@/views/vehicle/VehicleDetailView.vue';
import {useAuthStore} from "@/stores/auth";
import AffiliateListView from "@/views/affiliate/AffiliateListView.vue";
import AffiliateCreateView from "@/views/affiliate/AffiliateCreateView.vue";
import AffiliateDetailView from "@/views/affiliate/AffiliateDetailView.vue";
import VehicleCreateView from "@/views/vehicle/VehicleCreateView.vue";
import CompanyListView from "@/views/collection/company/CompanyListView.vue";
import CompanyCreateView from "@/views/collection/company/CompanyCreateView.vue";
import CompanyDetailView from "@/views/collection/company/CompanyDetailView.vue";
import BasePrice from "@/views/collection/BasePriceView.vue";
import BasePriceView from "@/views/collection/BasePriceView.vue";
import CompanyPriceTableView from "@/views/collection/company/CompanyPriceTableView.vue";
import CompanyUserView from "@/views/collection/company/CompanyUserView.vue";
import CompanyUserCreate from "@/views/collection/company/CompanyUserCreate.vue";
import CompanyUserDetail from "@/views/collection/company/CompanyUserDetail.vue";
import EmployeeListView from "@/views/employee/EmployeeListView.vue";
import EmployeeCreateView from "@/views/employee/EmployeeCreateView.vue";
import UserListView from "@/views/employee/UserListView.vue";
import UserCreateView from "@/views/employee/UserCreateView.vue";
import UserDetailView from "@/views/employee/UserDetailView.vue";
import EmployeeDetailView from "@/views/employee/EmployeeDetailView.vue";
import GpsView from "@/views/gps/GpsView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth/login',
      name: 'auth_login',
      component: LoginView,
      meta: {
        headClass: ['h-full', 'bg-white'], bodyClass: ['h-full'],
        requireAuth: false
      }
    },
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView,
          meta: {name: '홈', requireAuth: true}
        },
        {
          path: '/profile',
          name: 'profile',
          component: ProfleView,
          meta: {name: '프로필', requireAuth: true}
        },
        {
          path: '/employee/user',
          name: 'user_list',
          component: UserListView,
          meta: {name: '사용자 목록', requireAuth: true}
        },
        {
          path: '/employee/user/create',
          name: 'user_create',
          component: UserCreateView,
          meta: {name: '사용자 등록', requireAuth: true}
        },
        {
          path: '/employee/user/:userId',
          name: 'user_detail',
          component: UserDetailView,
          meta: {name: '사용자 조회', requireAuth: true}
        },
        {
          path: '/employee/user/:userId/create',
          name: 'employee_create',
          component: EmployeeCreateView,
          meta: {name: '임직원 상세 등록', requireAuth: true}
        },
        {
          path: '/employee',
          name: 'employee_list',
          component: EmployeeListView,
          meta: {name: '임직원 목록', requireAuth: true}
        },
        {
          path: '/employee/:employeeId',
          name: 'employee_detail',
          component: EmployeeDetailView,
          meta: {name: '임직원 상세', requireAuth: true}
        },
        {
          path: '/affiliate',
          name: 'affiliate_list',
          component: AffiliateListView,
          meta: {name: '사업장목록', requireAuth: true}
        },
        {
          path: '/affiliate/create',
          name: 'affiliate_create',
          component: AffiliateCreateView,
          meta: {name: '사업장등록', requireAuth: true}
        },
        {
          path: '/affiliate/:affiliateId',
          name: 'affiliate_detail',
          component: AffiliateDetailView,
          meta: {name: '사업장상세', requireAuth: true}
        },
        {
          path: '/vehicle',
          name: 'vehicle_list',
          component: VehicleListView,
          meta: {name: '차량목록', requireAuth: true}
        },
        {
          path: '/vehicle/create',
          name: 'vehicle_create',
          component: VehicleCreateView,
          meta: {name: '차량등록', requireAuth: true}
        },
        {
          path: '/vehicle/:vehicleId',
          name: 'vehicle_detail',
          component: VehicleDetailView,
          meta: {name: '차량상세', requireAuth: true}
        },
        {
          path: '/gps',
          name: 'gps_index',
          component: GpsView,
          meta: {name: '지도', requireAuth: true, fullscreen: true}
        },
        {
          path: '/gps/tracker',
          name: 'gps_tracker_list',
          component: VehicleDetailView,
          meta: {name: '단말기 관리', requireAuth: true}
        },
        {
          path: '/collection/company',
          name: 'collection_company_list',
          component: CompanyListView,
          meta: {name: '거래처', requireAuth: true}
        },
        {
          path: '/collection/company/create',
          name: 'collection_company_create',
          component: CompanyCreateView,
          meta: {name: '거래처 등록', requireAuth: true}
        },
        {
          path: '/collection/company/:companyId',
          name: 'collection_company_detail',
          component: CompanyDetailView,
          meta: {name: '거래처 기본정보', requireAuth: true}
        },
        {
          path: '/collection/company/:companyId/user',
          name: 'collection_company_user',
          component: CompanyUserView,
          meta: {name: '거래처 직원', requireAuth: true}
        },
        {
          path: '/collection/company/:companyId/user/:userId',
          name: 'collection_company_user_detail',
          component: CompanyUserDetail,
          meta: {name: '거래처 직원 상세', requireAuth: true}
        },
        {
          path: '/collection/company/:companyId/user/create',
          name: 'collection_company_user_create',
          component: CompanyUserCreate,
          meta: {name: '거래처 등록', requireAuth: true}
        },
        {
          path: '/collection/company/:companyId/price',
          name: 'collection_company_price',
          component: CompanyPriceTableView,
          meta: {name: '거래처 기본단가', requireAuth: true}
        },
        {
          path: '/collection/price',
          name: 'collection_price',
          component: BasePriceView,
          meta: {name: '기본단가 관리', requireAuth: true}
        },
      ],
      meta: {
        headClass: ['h-full', 'bg-gray-50'], bodyClass: ['h-full'], name: '차량/기사관리'
      }
    }
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // }
  ]
})



router.beforeEach(async (to, from, next) => {
  const authState = useAuthStore()
  const toMeta = to.meta
  document.head.classList = toMeta.headClass || []
  document.body.classList = toMeta.bodyClass || []
  const requireAuth = to.meta.requireAuth
  const isAuthenticated = await authState.isAuthenticated()
  let nextTo = null
  if (requireAuth === true) {
    // 로그인된 사용자만 들어갈 수 있는 경우
    if (isAuthenticated === false) {
      nextTo = {name: 'auth_login'}
    }
  } else if (requireAuth === false) {
    // 로그인되지 않은 사용자만 들어갈 수 있는 경우
    if (isAuthenticated === true) {
      nextTo = {name: from.name}
    }
  } else {
    // 로그인 여부와 무관하게 들어갈 수 있는 경우
  }
  if (nextTo === null) {
    next()
  } else {
    next(nextTo)
  }
})
export default router
