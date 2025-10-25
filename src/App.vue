<template>
  <div v-if="isOperatorArea" class="app-container" :class="{ 'sidebar-open': isSidebarOpen }">
    <div class="sidebar">
      <div class="sidebar-header">
        <img src="@/assets/logo-bpjs.png" alt="Logo BPJS Kesehatan" class="logo-bpjs">
        <h1>VIOLA</h1>
        <span>BPJS Kesehatan Cabang Makassar</span>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/operator">
              <i class="fa-solid fa-desktop"></i>
              <span>Halaman Antrian</span>
            </router-link>
          </li>
          <li>
            <router-link to="/laporan">
              <i class="fa-solid fa-print"></i>
              <span>Cetak Laporan</span>
            </router-link>
          </li>
          <li> <router-link to="/pengaturan">
              <i class="fa-solid fa-cogs"></i>
              <span>Pengaturan Form</span>
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="account-dropdown">
      <div class="account-summary" @click="toggleAccountDropdown">
        <i class="fa-solid fa-user-circle"></i>
        <span class="user-email">{{ userEmail }}</span>
        <i class="fa-solid fa-chevron-up"></i>
      </div>
      <div v-if="isAccountDropdownOpen" class="dropdown-menu">
        <a @click="handleLogout" href="#">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Logout</span>
        </a>
      </div>
    </div>
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
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter, RouterView, RouterLink } from 'vue-router'
import { auth } from '@/firebase/config'; 
import { signOut, onAuthStateChanged } from 'firebase/auth'; 
import { useSettingsStore } from '@/stores/settingsStore'
const route = useRoute()
const router = useRouter();
const isSidebarOpen = ref(false)
const settingsStore = useSettingsStore()
const isAccountDropdownOpen = ref(false); 
const userEmail = ref('');
const toggleAccountDropdown = () => {
  isAccountDropdownOpen.value = !isAccountDropdownOpen.value;
};
const handleLogout = async () => {
  if (confirm('Anda yakin ingin keluar?')) {
    try {
      await signOut(auth);
      console.log('Logout berhasil');
      router.push({ name: 'login' });
    } catch (error) {
      console.error('Gagal logout:', error);
      alert('Gagal untuk logout. Silakan coba lagi.');
    }
  }
}
onAuthStateChanged(auth, (user) => {
  if (user) {
    userEmail.value = user.email;
  } else {
    userEmail.value = '';
  }
});
const isOperatorArea = computed(() => {
  return route.name === 'operator' || route.name === 'laporan' || route.name === 'pengaturan'
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

watch(route, () => {
    isSidebarOpen.value = false;
});
onMounted(() => {
  if (isOperatorArea.value) {
    settingsStore.initListener()
  }
})
</script>

<style>
.sidebar-nav a.router-link-active,
.sidebar-nav a.router-link-exact-active {
    background-color: rgba(255, 255, 255, 0.15); 
    font-weight: 600;
}
.logo-bpjs {
  max-width: 50px;
  margin: 0 auto 20px;
  display: block;
  margin-top: 10px;
}
</style>