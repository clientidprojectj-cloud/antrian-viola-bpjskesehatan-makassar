import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/config';

import PublicView from '../views/PublicView.vue'
import OperatorView from '../views/OperatorView.vue'
import ReportView from '../views/ReportView.vue'
import LoginView from '../views/LoginView.vue'
import { onAuthStateChanged } from 'firebase/auth';

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener(); 
        resolve(user);
      },
      reject
    );
  });
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'public',
      component: PublicView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/operator',
      name: 'operator',
      component: OperatorView,
      beforeEnter: async (to, from, next) => {
        const user = await getCurrentUser(); 
        if (user) {
          next(); 
        } else {
          next({ name: 'login' }); 
        }
      }
    },
    {
      path: '/laporan',
      name: 'laporan',
      component: ReportView,
      beforeEnter: async (to, from, next) => {
        const user = await getCurrentUser(); 
        if (user) {
          next(); 
        } else {
          next({ name: 'login' }); 
        }
      }
    }
  ]
})

export default router