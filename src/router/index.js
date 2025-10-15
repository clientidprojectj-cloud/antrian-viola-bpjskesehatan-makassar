import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/config';

// Impor semua komponen View Anda
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
        removeListener(); // Hentikan pendengar setelah kita dapat jawaban
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
      // Hanya menggunakan pengecekan login Firebase
      beforeEnter: async (to, from, next) => {
        const user = await getCurrentUser(); // Tunggu jawaban pasti dari Firebase
        if (user) {
          next(); // Ada pengguna, izinkan masuk
        } else {
          next({ name: 'login' }); // Tidak ada pengguna, lempar ke login
        }
      }
    },
    {
      path: '/laporan',
      name: 'laporan',
      component: ReportView,
      // Hanya menggunakan pengecekan login Firebase
      beforeEnter: async (to, from, next) => {
        const user = await getCurrentUser(); // Tunggu jawaban pasti dari Firebase
        if (user) {
          next(); // Ada pengguna, izinkan masuk
        } else {
          next({ name: 'login' }); // Tidak ada pengguna, lempar ke login
        }
      }
    }
  ]
})

export default router