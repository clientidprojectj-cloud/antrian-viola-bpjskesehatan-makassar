// file: src/router/index.js

import { createRouter, createWebHashHistory } from 'vue-router'
import PublicView from '../views/PublicView.vue'
import OperatorView from '../views/OperatorView.vue'
import ReportView from '../views/ReportView.vue'

const OPERATOR_KEY = import.meta.env.VITE_OPERATOR_KEY;

const router = createRouter({
  history: createWebHashHistory(), // Menggunakan hash mode seperti pada kode asli
  routes: [
    {
      path: '/',
      name: 'public',
      component: PublicView
    },
    {
      path: '/operator',
      name: 'operator',
      component: OperatorView,
      // Navigation guard untuk memeriksa kunci rahasia
      beforeEnter: (to, from, next) => {
        const key = to.query.kunci;
        if (key === OPERATOR_KEY) {
          next(); // Kunci valid, lanjutkan
        } else {
          alert('Kunci akses tidak valid!');
          next({ name: 'public' }); // Kunci tidak valid, lempar ke halaman utama
        }
      }
    },
    {
      path: '/laporan',
      name: 'laporan',
      component: ReportView,
      beforeEnter: (to, from, next) => {
        const key = to.query.kunci;
        if (key === OPERATOR_KEY) {
          next(); 
        } else {
          next({ name: 'public' });
        }
      }
    }
  ]
})

export default router