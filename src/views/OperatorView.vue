<template>
  <div id="operator-page">
  <div class="operator-card">
    <div class="main-display">
      <p>NOMOR ANTRIAN (Saat Ini)</p>
      <h1 id="op-display-nomor">{{ store.currentQueue?.nomor || '---' }}</h1>
      <h2 id="op-display-nama">{{ store.currentQueue?.nama || 'Menunggu Antrian Berikutnya...' }}</h2>
      <span v-if="store.currentQueue" id="op-display-layanan" class="layanan-tag">
        {{ store.currentQueue.layanan }}
      </span>
    </div>

    <div class="controls">
       <button id="btn-next" class="control-btn btn-next" @click="handleNext" :disabled="!store.currentQueue || store.isUpdating">
          <div v-if="store.isUpdating" class="btn-spinner"></div>
          <span v-else>
            <i class="fa-solid fa-play"></i> Berikutnya
          </span>
        </button>
        <button id="btn-skip" class="control-btn btn-skip" @click="handleSkip" :disabled="!store.currentQueue || store.isUpdating">
          <div v-if="store.isUpdating" class="btn-spinner"></div>
          <span v-else>
            <i class="fa-solid fa-forward-step"></i> Lewati
          </span>
        </button>
    </div>

    <div class="queue-lists">
      <div class="list-container">
        <h3><i class="fa-solid fa-user-group"></i> Antrian Berikutnya (<span>{{ store.nextQueues.length }}</span>)</h3>
        <ul>
          <li v-for="queue in store.nextQueues" :key="queue.nomor">
            <div>
              <span class="nomor">{{ queue.nomor }}</span>
              <span class="nama">{{ queue.nama }}</span>
            </div>
            <span>{{ queue.layanan }}</span>
          </li>
        </ul>
      </div>
      <div class="list-container">
        <h3><i class="fa-solid fa-user-clock"></i> Dilewati (<span>{{ store.skippedQueues.length }}</span>)</h3>
        <ul>
          <li v-for="skipped in store.skippedQueues" :key="skipped.nomor">
            <div>
              <span class="nomor">{{ skipped.nomor }}</span>
              <span class="nama">{{ skipped.nama }}</span>
            </div>
            <button class="btn-recall" @click="handleRecall(skipped.nomor)" :disabled="store.isUpdating">
                <div v-if="store.isUpdating" class="btn-spinner-small"></div>
                <span v-else>Panggil Ulang</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <p class="copyright">Halaman Operator Antrian &copy; 2025 BPJS Kesehatan cabang Makassar</p>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useOperatorStore } from '@/stores/operatorStore'

const store = useOperatorStore();
let pollingInterval = null;

onMounted(() => {
  store.fetchQueues();
  // Polling setiap 5 detik untuk data terbaru
  pollingInterval = setInterval(store.fetchQueues, 5000);
});

onUnmounted(() => {
  // Hentikan polling saat meninggalkan halaman
  clearInterval(pollingInterval);
});

const handleNext = () => {
  if (store.currentQueue) {
    store.updateQueueStatus(store.currentQueue.nomor, 'Selesai');
  }
};

const handleSkip = () => {
  if (store.currentQueue) {
    store.updateQueueStatus(store.currentQueue.nomor, 'Dilewati');
  }
};

const handleRecall = (nomor) => {
  if (confirm(`Anda yakin ingin memanggil ulang antrian nomor ${nomor}?`)) {
    store.updateQueueStatus(nomor, 'Mengantre');
  }
};
</script>
<style scoped>
.btn-spinner-small {
    width: 16px; 
    height: 16px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #ffffff;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto;
}
</style>