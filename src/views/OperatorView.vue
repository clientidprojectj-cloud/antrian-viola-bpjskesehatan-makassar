<template>
  <div id="operator-page">
  <div class="operator-card">
    <div class="main-display">
      <button @click="toggleFullscreen" class="fullscreen-btn">
          <i class="fa-solid fa-expand"></i>
      </button>
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
  <div v-if="isFullscreen" class="fullscreen-display">
    <div v-if="store.isUpdating" class="fs-loading-overlay">
      <div class="btn-spinner"></div>
    </div>
    <button @click="toggleFullscreen" class="fullscreen-btn close">
      <i class="fa-solid fa-compress"></i>
    </button>
    <div class="fullscreen-content">
      <p>NOMOR ANTRIAN (Saat Ini)</p>
      <div class="fs-number">{{ store.currentQueue?.nomor || '---' }}</div>
      <div class="fs-name">{{ store.currentQueue?.nama || 'Menunggu Antrian' }}</div>
      <div v-if="store.currentQueue" class="fs-service">{{ store.currentQueue.layanan }}</div>
    </div>
    <div class="fab-container">
      <button v-if="isFabMenuOpen" @click="runFabAction('skip')" class="fab-action-btn fab-skip">
        <i class="fa-solid fa-forward-step"></i>
      </button>
      <button v-if="isFabMenuOpen" @click="runFabAction('next')" class="fab-action-btn fab-next">
        <i class="fa-solid fa-play"></i>
      </button>

      <button @click="toggleFabMenu" class="fab-main-btn">
        <i class="fa-solid fa-bars"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useOperatorStore } from '@/stores/operatorStore'

const store = useOperatorStore();
const isFullscreen = ref(false);

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

const isFabMenuOpen = ref(false); 

const toggleFabMenu = () => {
  isFabMenuOpen.value = !isFabMenuOpen.value;
};

const runFabAction = (action) => {
  if (action === 'next') {
    handleNext();
  } else if (action === 'skip') {
    handleSkip();
  }
  isFabMenuOpen.value = false; 
};

let pollingInterval = null;

onMounted(() => {
  store.fetchQueues();
  pollingInterval = setInterval(store.fetchQueues, 5000);
});

onUnmounted(() => {
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

.main-display {
    position: relative; 
}

.fullscreen-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.fullscreen-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
}
.fullscreen-display {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bpjs-blue);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease-out;
}

.fullscreen-content {
    text-align: center;
}

.fs-number {
    font-size: 25vw; 
    font-weight: 700;
    line-height: 1;
}

.fs-name {
    font-size: 6vw;
    font-weight: 600;
    margin-top: 1rem;
}

.fs-service {
    font-size: 3vw;
    font-weight: 500;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 2rem;
    border-radius: 999px;
    display: inline-block;
    margin-top: 2rem;
}

.fullscreen-btn.close {
    top: 20px;
    right: 20px;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}


.fab-container {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 2010;
    display: flex;
    flex-direction: column-reverse; 
    align-items: center;
}

.fab-main-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: white;
    color: var(--bpjs-blue);
    border: none;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s ease;
}

.fab-main-btn:hover {
    transform: scale(1.1);
}

.fab-action-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    opacity: 0;
    transform: translateY(10px);
    animation: fab-in 0.3s ease-out forwards;
}

.fab-next {
    background-color: var(--bpjs-green);
    animation-delay: 0.1s; 
}

.fab-skip {
    background-color: #f39c12; 
}

@keyframes fab-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.fullscreen-display .fullscreen-content p { margin: 0; font-size: 16px; font-weight: 500; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; }
.fs-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2020; 
    backdrop-filter: blur(2px); 
}
.fs-loading-overlay .btn-spinner {
    width: 80px;
    height: 80px;
    border-width: 8px;
}
</style>