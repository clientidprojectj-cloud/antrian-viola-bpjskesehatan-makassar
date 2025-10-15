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

    <div class="zoom-link-container">
      <p class="zoom-title">Silahkan bergabung ke Link Ruang Pelayanan VIOLA (Zoom) berikut ini!</p>
      
      <div class="zoom-preview-card">
        <div class="zoom-info">
          <div class="zoom-header">Zoom</div>
          <div class="zoom-title-main">Join our Cloud HD Video Meeting</div>
          <div class="zoom-description">Gunakan tombol atau link di bawah untuk bergabung ke ruang Meeting.</div>
        </div>
        <a :href="zoomLink" target="_blank" class="zoom-join-button">
          <i class="fa-solid fa-video"></i>
          <span>Gabung</span>
        </a>
      </div>
      <div class="link-box">
        <a :href="zoomLink" target="_blank" class="zoom-link">{{ zoomLink }}</a>
        <button @click="copyZoomLink" class="copy-button">
          <i class="fa-solid fa-copy"></i>
          <span>{{ copyStatus }}</span>
        </button>
      </div>
    </div>


    <a class="link" @click="store.clearTicket()">Daftar untuk antrian baru</a>
  </div>
</template>

<script setup>
import { useQueueStore } from '@/stores/queueStore'
import { ref } from 'vue';

const store = useQueueStore()
const zoomLink = ref('https://bpjs-kesehatan-go-id.zoom.us/j/91628629114?pwd=YEOrgFrbM44fk8MEfc3mHKpo0cFNg1.1'); // Ganti dengan link asli Anda
const copyStatus = ref('Salin Link'); // Teks awal tombol

// 3. Fungsi untuk menyalin link
const copyZoomLink = () => {
  // Gunakan API modern browser untuk menyalin ke clipboard
  navigator.clipboard.writeText(zoomLink.value).then(() => {
    // Jika berhasil, ubah teks tombol sementara
    copyStatus.value = 'Berhasil Disalin!';
    // Kembalikan teks tombol ke semula setelah 2 detik
    setTimeout(() => {
      copyStatus.value = 'Salin Link';
    }, 2000);
  }).catch(err => {
    // Jika gagal, tampilkan pesan error di konsol
    console.error('Gagal menyalin link: ', err);
    copyStatus.value = 'Gagal';
  });
};
</script>

<style scoped>
/* Gaya yang sudah ada tidak diubah */
.ticket-view {
  animation: fadeInUp 0.7s ease-out forwards;
}
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
.notes-section {
  background-color: var(--bpjs-blue-light, #e6f1ff);
  border-left: 5px solid var(--bpjs-blue, #005bac);
  padding: 15px 20px;
  margin-top: 30px;
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
  padding-left: 20px;
  margin: 0;
  font-size: 14px;
  color: #3d5166;
}
.notes-section li { margin-bottom: 8px; }
.notes-section li:last-child { margin-bottom: 0; }
.notes-section strong { color:  #ac0000; }
.zoom-link-container { margin-top: 30px; text-align: left; }
.zoom-title { font-size: 14px; font-weight: 600; color: var(--text-dark); margin-bottom: 10px; }
.link-box { display: flex; align-items: center; background-color: #f8f9fa; border: 1px solid var(--border-color); border-radius: 12px; padding: 5px; overflow: hidden; }
.zoom-link { flex-grow: 1; padding: 8px 15px; font-family: 'Courier New', Courier, monospace; font-size: 14px; color: var(--bpjs-blue); text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.copy-button { display: flex; align-items: center; gap: 8px; background-color: var(--bpjs-blue); color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: 500; transition: background-color 0.2s; }
.copy-button:hover { background-color: #004a8c; }

.zoom-preview-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #f0f6ff;
  border-left: 4px solid #0E71EB;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.zoom-info { flex-grow: 1; }
.zoom-header { color: #0E71EB; font-weight: 600; font-size: 14px; }
.zoom-title-main { font-weight: 600; color: var(--text-dark); font-size: 16px; margin-top: 2px; }
.zoom-description { font-size: 14px; color: var(--text-muted); margin-top: 4px; }

.zoom-join-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #0E71EB;
  border-radius: 10px;
  padding: 12px 18px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
  flex-shrink: 0;
}
.zoom-join-button:hover { background-color: #0d65d2; }
.zoom-join-button i { font-size: 18px; }

.link-box { margin-top: 0; }

/* =====================================================
--- PERBAIKAN RESPONSIVE SECARA KESELURUHAN ---
Menggunakan max-width: 768px untuk mencakup tablet dan mobile
=====================================================
*/
@media (max-width: 768px) {
  /* [FIX 1] Mengurangi ukuran font utama agar tidak terlalu besar */
  h1 {
    font-size: 24px;
  }
  .ticket-box .number {
    font-size: 64px; /* Sedikit lebih kecil dari versi desktop */
  }

  /* [FIX 2] Menyesuaikan layout kartu preview Zoom, digabung dari media query sebelumnya */
  .zoom-preview-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .zoom-join-button {
    width: 100%; /* Tombol memenuhi lebar kartu */
  }
  
  /* [FIX 3] Membuat link box bisa wrap dan lebih ramah mobile */
  .link-box {
    flex-wrap: wrap; /* Izinkan item turun ke bawah jika tidak muat */
    padding: 10px;
  }

  /* [FIX 4] Membuat link dan tombol mengambil lebar penuh saat wrap */
  .zoom-link, .copy-button {
    flex-basis: 100%; /* Setiap item mengambil 1 baris penuh */
    width: 100%;
    text-align: center;
  }
  
  .zoom-link {
    white-space: normal; /* Izinkan teks link untuk wrap */
    word-break: break-all; /* Paksa link yang sangat panjang untuk patah */
    text-overflow: initial; /* Hapus ellipsis karena teks sudah bisa wrap */
    margin-bottom: 10px; /* Beri jarak ke tombol di bawahnya */
    font-size: 13px; /* Kecilkan sedikit font link */
    padding: 10px;
  }

  .copy-button {
    justify-content: center; /* Posisikan ikon dan teks di tengah tombol */
  }
  
  /* [FIX OPSIONAL] Membuat `.ticket-box` lebih rapi di mobile */
  .ticket-box {
    padding: 20px;
  }
  .ticket-box .detail {
    font-size: 16px;
  }
}

</style>
