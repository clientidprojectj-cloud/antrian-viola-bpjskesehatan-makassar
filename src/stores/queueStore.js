import { defineStore } from 'pinia'
import { ref, computed } from 'vue' // Pastikan computed di-import

// Ambil URL dari environment variable
const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

// [PERBAIKI STRUKTUR DI SINI] Gunakan format setup function
export const useQueueStore = defineStore('queue', () => {
  // --- STATE ---
  const isLoading = ref(false);
  const ticket = ref(null); // akan berisi { nomor, nama, layanan, tanggal }
  const error = ref(null);

  // --- COMPUTED / GETTERS ---
  const hasActiveTicket = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return ticket.value && ticket.value.tanggal === today;
  });

  const formStatus = computed(() => {
    const now = new Date();
    const day = now.getDay(); // 0 = Minggu, ..., 6 = Sabtu
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour + (minute / 60);

    // Tutup di hari Sabtu (6) dan Minggu (0)
    if (day === 0 || day === 6) {
      return { 
        isOpen: false, 
        message: 'Pendaftaran antrian online tutup pada hari Sabtu dan Minggu.' 
      };
    }

    //jadwal pelayanan
    const isSesi1 = (hour >= 8 && hour < 11) || (hour === 11 && minute <= 30);
    const isSesi2 = (hour === 13 && minute >= 30) || (hour === 14) || (hour === 15 && minute <= 30);
    
    if (isSesi1 || isSesi2) {
      return { 
        isOpen: true, 
        message: 'Formulir sedang dibuka.' 
      };
    }

    // Kondisi di luar jam operasional
    let nextOpen = '';
    // Jika waktu saat ini sebelum jam 8 pagi
    if (hour < 8) {
      nextOpen = 'pukul 08:00 WITA hari ini.';
    
    // Jika waktu saat ini berada di jam istirahat (setelah 11:30 dan sebelum 13:30)
    } else if ((hour === 11 && minute > 30) || hour === 12 || (hour === 13 && minute < 30)) {
      nextOpen = 'pukul 13:30 WITA.';
    
    // Untuk semua kondisi tutup lainnya (setelah jam 15:30)
    } else {
      nextOpen = 'besok hari.';
    }

    return { 
      isOpen: false, 
      message: `Saat ini pendaftaran ditutup. Akan dibuka kembali ${nextOpen}`
    };
  });

  // --- ACTIONS ---
  function checkLocalStorage() {
    const storedData = localStorage.getItem('antrianData');
    if (storedData) {
      ticket.value = JSON.parse(storedData);
    }
  }

  async function submitQueue(formData) {
    isLoading.value = true;
    error.value = null;
    try {
      const formPayload = new FormData();
      formPayload.append('nama', formData.nama);
      formPayload.append('hp', `'${formData.hp}`); 
      formPayload.append('layanan', formData.layanan);

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) throw new Error('Terjadi masalah pada server.');

      const data = await response.json();

      if (data.status === 'sukses') {
        const newTicket = {
          nomor: data.nomorAntrian,
          nama: formData.nama,
          layanan: formData.layanan,
          tanggal: new Date().toISOString().slice(0, 10)
        };
        ticket.value = newTicket;
        localStorage.setItem('antrianData', JSON.stringify(newTicket));
      } else {
        throw new Error(data.message || 'Gagal mendapatkan nomor antrian.');
      }
    } catch (err) {
      console.error('Error:', err);
      error.value = "Gagal mengambil nomor antrian. Mohon periksa koneksi Anda dan coba lagi.";
    } finally {
      isLoading.value = false;
    }
  }

  function clearTicket() {
    if (confirm('Anda yakin ingin menghapus nomor antrian saat ini?')) {
      ticket.value = null;
      localStorage.removeItem('antrianData');
    }
  }

  // --- RETURN ---
  // Pastikan semua yang dibutuhkan oleh komponen diekspor di sini
  return {
    isLoading,
    ticket,
    error,
    hasActiveTicket,
    formStatus, // <-- Jangan lupa ekspor formStatus
    checkLocalStorage,
    submitQueue,
    clearTicket
  };
});
