<template>
  <div v-if="isOperatorArea" class="app-container" :class="{ 'sidebar-open': isSidebarOpen }">
    <div class="sidebar">
      <div class="sidebar-header">
        <h1>VIOLA</h1>
        <span>BPJS Kesehatan</span>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link :to="{ path: '/operator', query: { kunci: operatorKey } }">
              <i class="fa-solid fa-desktop"></i>
              <span>Halaman Antrian</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ path: '/laporan', query: { kunci: operatorKey } }">
              <i class="fa-solid fa-print"></i>
              <span>Cetak Laporan</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <div class="main-content">
      <button @click="toggleSidebar" class="menu-toggle">
        <i class="fa-solid fa-bars"></i>
      </button>
      <div class="content-wrapper">
        <router-view />
      </div>
    </div>
    <div class="overlay" @click="toggleSidebar"></div>
  </div>

  <div v-else class="public-content-container">
    <router-view />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, RouterView, RouterLink } from 'vue-router'

const operatorKey = import.meta.env.VITE_OPERATOR_KEY;
const route = useRoute()
const isSidebarOpen = ref(false)

const isOperatorArea = computed(() => {
  return route.name === 'operator' || route.name === 'laporan'
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

watch(route, () => {
    isSidebarOpen.value = false;
});
</script>

<style>
/* CSS untuk active link di sidebar */
.sidebar-nav a.router-link-active,
.sidebar-nav a.router-link-exact-active {
    background-color: rgba(255, 255, 255, 0.15); /* Disesuaikan agar cocok dengan gaya hover */
    font-weight: 600;
}
</style>