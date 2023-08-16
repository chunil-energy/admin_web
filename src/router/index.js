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
          path: '/vehicle/:vehicleId',
          name: 'vehicle_detail',
          component: VehicleDetailView,
          meta: {name: '차량상세', requireAuth: true}
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
