<template>
  <div class="card ticket-view fade-in-up">
    <h1>Nomor Antrian Anda</h1>
    <p>Silakan tunjukkan nomor ini kepada petugas.</p>
    <div class="ticket-box">
      <span class="label">Nomor Antrian Anda untuk Hari Ini</span>
      <div class="number">{{ store.ticket?.nomor || '---' }}</div>
      <div class="detail">
        <strong>{{ store.ticket?.nama }}</strong><br>
        {{ store.ticket?.layanan }}
      </div>
    </div>

    <div class="notes-section">
      <p class="notes-title">
        <strong><em>Catatan Penting:</em></strong>
      </p>
      <ol>
        <li>Dimohon untuk menyiapkan berkas terlebih dahulu yang akan diperlukan seperti KTP, dll.</li>
        <li>Estimasi waktu pelayanan VIOLA untuk setiap peserta adalah <strong>7 menit</strong>.</li>
      </ol>
    </div>

    <a class="link" @click="store.clearTicket()">Daftar untuk antrian baru</a>
  </div>
</template>

<script setup>
import { useQueueStore } from '@/stores/queueStore'
const store = useQueueStore()
</script>

<style scoped>
/* [BARU] Gaya untuk membuat tampilan lebih menarik */
.ticket-view {
  /* Menerapkan animasi yang sama seperti form */
  animation: fadeInUp 0.7s ease-out forwards;
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

/* [BARU] Gaya khusus untuk bagian catatan */
.notes-section {
  background-color: var(--bpjs-blue-light, #e6f1ff); /* Warna latar biru muda */
  border-left: 5px solid var(--bpjs-blue, #005bac); /* Aksen garis biru di kiri */
  padding: 15px 20px;
  margin-top: 30px; /* Jarak dari kotak tiket */
  border-radius: 8px;
  text-align: left;
}

.notes-title {
  font-size: 16px;
  color: var(--text-dark, #2c3e50);
  margin-top: 0;
  margin-bottom: 10px;
}

.notes-section ol {
  padding-left: 20px; /* Atur posisi nomor urut */
  margin: 0;
  font-size: 14px;
  color: #3d5166;
}

.notes-section li {
  margin-bottom: 8px; /* Jarak antar poin catatan */
}

.notes-section li:last-child {
  margin-bottom: 0;
}

.notes-section strong {
  color:  #ac0000; /* Beri warna pada teks yang di-bold */
}
</style>