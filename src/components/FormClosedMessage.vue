<template>
  <div class="card closed-view fade-in-up">
    <div class="icon-wrapper">
      <i class="fa-solid fa-clock"></i>
    </div>

    <h1>Pendaftaran Ditutup</h1>
    <p class="status-message">{{ message }}</p>

    <div class="schedule">
      <div class="schedule-title">Jadwal Pelayanan VIOLA</div>
      <div class="schedule-grid">
        <div class="schedule-item">
          <i class="fa-regular fa-sun"></i>
          <div>
            <div class="session-title">Pukul</div>
            <div class="session-time">08:00 - 11:50 WITA</div>
          </div>
        </div>
        <!-- <div class="schedule-item">
          <i class="fa-regular fa-moon"></i>
          <div>
            <div class="session-title">Sesi Siang</div>
            <div class="session-time">13:30 - 15:30 WITA</div>
          </div>
        </div> -->
      </div>
      <div class="schedule-days">
        Senin - Jumat (Sabtu, Minggu, dan Hari Libur Nasional Tutup)
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Pendaftaran antrian online saat ini sedang ditutup.'
  }
})
</script>

<style scoped>
.closed-view {
  text-align: center;
  padding: 40px;
  max-width: 480px;
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  background-color: var(--bpjs-blue-light, #e6f1ff);
  border-radius: 16px; 
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 91, 172, 0.1);
  transform: rotate(-10deg);
  transition: all 0.3s ease-in-out;
}

.closed-view:hover .icon-wrapper {
  transform: rotate(0deg) scale(1.1);
}

.icon-wrapper i {
  font-size: 32px;
  color: var(--bpjs-blue, #005bac);
}

h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--danger, #dc3545);
  margin-bottom: 8px;
}

.status-message {
  font-size: 16px;
  color: var(--text-muted, #8a96a3);
  margin-top: 0;
  margin-bottom: 30px;
  line-height: 1.6;
}

.schedule {
  background-color: #f8f9fa;
  border: 1px solid var(--border-color, #dfe7ef);
  border-radius: 12px;
  padding: 20px;
}

.schedule-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark, #2c3e50);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}

.schedule-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  text-align: left;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.schedule-item i {
  font-size: 24px;
  color: var(--bpjs-blue, #005bac);
  padding: 8px;
  border-radius: 8px;
  width: 28px;
  text-align: center;
}

.session-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 5px;
}

.session-time {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark, #2c3e50);
}

.schedule-days {
  margin-top: 20px;
  font-size: 13px;
  color: var(--text-muted, #8a96a3);
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fadeInUp 0.7s ease-out forwards;
}

/* komentar ini kalo sudah pakai sesi 2 */
.schedule-grid {
  grid-template-columns: 1fr;
}
</style>