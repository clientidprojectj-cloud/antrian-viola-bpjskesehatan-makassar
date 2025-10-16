import { defineStore } from 'pinia'
import { ref, computed } from 'vue' 

const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

export const useQueueStore = defineStore('queue', () => {
  const isLoading = ref(false);
  const ticket = ref(null); 
  const error = ref(null);

  const hasActiveTicket = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return ticket.value && ticket.value.tanggal === today;
  });

  const formStatus = computed(() => {
    const now = new Date();
    const day = now.getDay(); 
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour + (minute / 60);

    if (day === 0 || day === 6) {
      return { 
        isOpen: false, 
        message: 'Pendaftaran antrian online tutup pada hari Sabtu dan Minggu.' 
      };
    }

    const isSesi1 = (hour >= 8 && hour < 11) || (hour === 11 && minute <= 50);
    const isSesi2 = (hour === 13 && minute >= 30) || (hour === 14) || (hour === 15 && minute <= 30);
    
    if (isSesi1 || isSesi2) {
      return { 
        isOpen: true, 
        message: 'Formulir sedang dibuka.' 
      };
    }

    let nextOpen = '';
    if (hour < 8) {
      nextOpen = 'pukul 08:00 WITA hari ini.';
    
    } else if ((hour === 11 && minute > 30) || hour === 12 || (hour === 13 && minute < 30)) {
      nextOpen = 'pukul 13:30 WITA.';
    
    } else {
      nextOpen = 'besok hari.';
    }

    return { 
      isOpen: false, 
      message: `Saat ini pendaftaran ditutup. Akan dibuka kembali ${nextOpen}`
    };
  });

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

  
  return {
    isLoading,
    ticket,
    error,
    hasActiveTicket,
    formStatus, 
    checkLocalStorage,
    submitQueue,
    clearTicket
  };
});
